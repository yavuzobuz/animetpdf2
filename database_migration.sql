-- Profil sayfası için gerekli veritabanı tabloları

-- 1. profiles tablosunu güncelle (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'Free',
  next_billing_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. achievements tablosunu oluştur (başarı türleri)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. user_achievements tablosunu oluştur (kullanıcı başarıları)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 4. pdf_projects tablosuna pdf_file_size kolonu ekle (eğer yoksa)
ALTER TABLE pdf_projects 
ADD COLUMN IF NOT EXISTS pdf_file_size BIGINT DEFAULT 0;

-- 4b. pdf_projects tablosuna yumuşak silme için kolonlar ekle
ALTER TABLE pdf_projects 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- pdf_projects için RLS ve politika (kullanıcı kendi silinmemiş projelerini görebilsin)
ALTER TABLE pdf_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users select own active projects" ON pdf_projects
FOR SELECT USING (auth.uid() = user_id AND is_deleted = FALSE);

-- 5. Başlangıç başarılarını ekle
INSERT INTO achievements (title, description, icon) VALUES 
('İlk PDF', 'İlk PDF dönüşümünüzü tamamladınız', '📄'),
('Hızlı Başlangıç', '5 PDF dönüştürdünüz', '⚡'),
('Üretken Kullanıcı', '10 PDF dönüştürdünüz', '🚀'),
('Animasyon Ustası', 'İlk animasyonunuzu oluşturdunuz', '🎬'),
('Yaratıcı', '5 animasyon oluşturdunuz', '🎨')
ON CONFLICT DO NOTHING;

-- 6. RLS (Row Level Security) politikalarını ayarla
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles için RLS
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- User achievements için RLS
CREATE POLICY "Users can view own achievements" ON user_achievements
FOR SELECT USING (auth.uid() = user_id);

-- 7. Kullanıcı oluşturulduğunda otomatik profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluştur (eğer yoksa)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. İstatistikleri güncelleme fonksiyonları
CREATE OR REPLACE FUNCTION update_converted_pdfs()
RETURNS TRIGGER AS $$
BEGIN
  -- Her yeni PDF projesi oluşturulduğunda converted_pdfs sayacını artır
  IF TG_OP = 'INSERT' THEN
    INSERT INTO statistics (converted_pdfs, created_animations, total_downloads, storage_used)
    VALUES (1, 0, 0, 0)
    ON CONFLICT (id) DO UPDATE SET
      converted_pdfs = statistics.converted_pdfs + 1;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_created_animations()
RETURNS TRIGGER AS $$
BEGIN
  -- Her yeni animasyon oluşturulduğunda created_animations sayacını artır
  IF TG_OP = 'INSERT' THEN
    INSERT INTO statistics (converted_pdfs, created_animations, total_downloads, storage_used)
    VALUES (0, 1, 0, 0)
    ON CONFLICT (id) DO UPDATE SET
      created_animations = statistics.created_animations + 1;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS trigger_update_converted_pdfs ON pdf_projects;
CREATE TRIGGER trigger_update_converted_pdfs
  AFTER INSERT ON pdf_projects
  FOR EACH ROW EXECUTE FUNCTION update_converted_pdfs();

DROP TRIGGER IF EXISTS trigger_update_created_animations ON animation_pages;
CREATE TRIGGER trigger_update_created_animations
  AFTER INSERT ON animation_pages
  FOR EACH ROW EXECUTE FUNCTION update_created_animations();

-- 9. İstatistik tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS statistics (
  id SERIAL PRIMARY KEY,
  converted_pdfs INTEGER DEFAULT 0,
  created_animations INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk kayıt ekle
INSERT INTO statistics (converted_pdfs, created_animations, total_downloads, storage_used)
VALUES (0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
