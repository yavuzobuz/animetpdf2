-- Chat history foreign key constraint'ini tamamen kaldır
-- Bu sayede uygulama seviyesinde kontrol edebiliriz

-- Mevcut foreign key constraint'i kaldır
ALTER TABLE public.chat_history 
DROP CONSTRAINT IF EXISTS chat_history_project_id_fkey;

-- project_id alanını nullable yap (eğer değilse)
ALTER TABLE public.chat_history 
ALTER COLUMN project_id DROP NOT NULL;

-- Index'leri koru - performans için
CREATE INDEX IF NOT EXISTS idx_chat_history_project_id ON public.chat_history(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_project ON public.chat_history(user_id, project_id);

-- Chat history tablosunu kontrol et
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'chat_history' 
  AND table_schema = 'public'
ORDER BY ordinal_position;