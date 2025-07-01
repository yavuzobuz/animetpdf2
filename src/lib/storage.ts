import { createServerClient, createBrowserClient } from './supabase';

// PDF upload işlemi
export async function uploadPDF(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; error?: string } | null> {
  const supabase = createBrowserClient();
  
  // Dosya kontrolü
  if (!file.type.includes('pdf')) {
    return { url: '', error: 'Sadece PDF dosyaları yüklenebilir.' };
  }
  
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    return { url: '', error: 'Dosya boyutu 50MB\'dan küçük olmalıdır.' };
  }

  const fileExt = 'pdf';
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', error: error.message };
    }

    // Public URL al
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: '', error: 'Dosya yüklenirken hata oluştu.' };
  }
}

// Resim upload işlemi
export async function uploadImage(
  file: File,
  userId: string,
  folder: string = 'generated'
): Promise<{ url: string; error?: string } | null> {
  const supabase = createBrowserClient();
  
  if (!file.type.startsWith('image/')) {
    return { url: '', error: 'Sadece resim dosyaları yüklenebilir.' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return { url: '', error: 'Resim boyutu 10MB\'dan küçük olmalıdır.' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${folder}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Image upload error:', error);
      return { url: '', error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Image upload error:', error);
    return { url: '', error: 'Resim yüklenirken hata oluştu.' };
  }
}

// Ses dosyası upload işlemi
export async function uploadAudio(
  file: File,
  userId: string,
  folder: string = 'generated'
): Promise<{ url: string; error?: string } | null> {
  const supabase = createBrowserClient();
  
  if (!file.type.startsWith('audio/')) {
    return { url: '', error: 'Sadece ses dosyaları yüklenebilir.' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return { url: '', error: 'Ses dosyası boyutu 10MB\'dan küçük olmalıdır.' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${folder}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('audio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Audio upload error:', error);
      return { url: '', error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audio')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Audio upload error:', error);
    return { url: '', error: 'Ses dosyası yüklenirken hata oluştu.' };
  }
}