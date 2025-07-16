-- Chat history foreign key constraint düzeltmesi
-- Mevcut constraint'i kaldır ve yeniden oluştur

-- Önce mevcut foreign key constraint'i kaldır
ALTER TABLE public.chat_history 
DROP CONSTRAINT IF EXISTS chat_history_project_id_fkey;

-- Yeni constraint ekle - hem pdf_projects hem de animation_pages'i desteklesin
-- Bu constraint project_id'nin ya pdf_projects'te ya da animation_pages'te olmasını sağlar
ALTER TABLE public.chat_history 
ADD CONSTRAINT chat_history_project_id_fkey 
CHECK (
  EXISTS (SELECT 1 FROM public.pdf_projects WHERE id = project_id) OR
  EXISTS (SELECT 1 FROM public.animation_pages WHERE id = project_id)
);

-- Alternatif olarak, eğer yukarıdaki çalışmazsa, constraint'i tamamen kaldırabiliriz
-- ve uygulama seviyesinde kontrol edebiliriz
-- ALTER TABLE public.chat_history DROP CONSTRAINT IF EXISTS chat_history_project_id_fkey;

-- Index'leri koru
CREATE INDEX IF NOT EXISTS idx_chat_history_project_id ON public.chat_history(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_project ON public.chat_history(user_id, project_id);