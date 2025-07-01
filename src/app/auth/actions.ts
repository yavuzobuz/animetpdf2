'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Server-side auth için anon key kullanan client
const createAuthClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );
};

const SignupSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
  confirmPassword: z.string().min(6, { message: "Şifre onayı en az 6 karakter olmalıdır." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export async function signupUser(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(' ');
    return { message: errorMessages, type: 'error' };
  }

  const { email, password } = validatedFields.data;

  try {
    const supabase = createAuthClient();
    
    // Kullanıcı kaydı - email confirmation'sız
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          email_confirm: false // Email confirmation'ı devre dışı bırak
        }
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        return { message: 'Bu e-posta adresi zaten kayıtlı.', type: 'error' };
      }
      return { message: `Kayıt hatası: ${error.message}`, type: 'error' };
    }

    if (data.user && !data.user.email_confirmed_at) {
      return { 
        message: 'Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.', 
        type: 'success',
        redirectPath: '/login'
      };
    }

    return { 
      message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 
      type: 'success',
      redirectPath: '/login'
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  }
}

const LoginSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  password: z.string().min(1, { message: "Şifre boş olamaz." }),
});

export async function loginUser(
  prevState: any,
  formData: FormData,
  lang: string // Dil parametresi eklendi
) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(' ');
    return { message: errorMessages, type: 'error' };
  }
  
  const { email, password } = validatedFields.data;

  try {
    const supabase = createAuthClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('=== LOGIN ERROR DETAILS ===');
      console.error('Error message:', error.message);
      console.error('Error code:', error.status);
      console.error('Full error:', error);
      console.error('=========================');
      
      if (error.message.includes('Email not confirmed') || (error as any).code === 'email_not_confirmed') {
        return { message: 'E-posta adresiniz henüz onaylanmamış. Lütfen e-postanızı kontrol edin ve onay bağlantısına tıklayın.', type: 'error', needsConfirmation: true };
      }
      if (error.message.includes('Invalid login credentials')) {
        return { message: 'E-posta veya şifre hatalı. Lütfen tekrar kontrol edin.', type: 'error' };
      }
      return { message: `Giriş hatası: ${error.message}`, type: 'error' };
    }

    if (data.user) {
      return { 
        message: 'Giriş başarılı! Profilinize yönlendiriliyorsunuz...',
        type: 'success',
        redirectPath: `/${lang}/profil` // Dinamik yönlendirme yolu kullanılıyor
      };
    }

    return { message: 'Giriş yapılamadı.', type: 'error' };
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  }
}

export async function signOut() {
  try {
    const supabase = createAuthClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { message: 'Çıkış yapılırken hata oluştu.', type: 'error' };
    }
    
    redirect('/login');
  } catch (error) {
    console.error('Sign out error:', error);
    return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createAuthClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Profil güncelleme şeması
const ProfileSchema = z.object({
  first_name: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır." }).optional(),
  last_name: z.string().min(2, { message: "Soyad en az 2 karakter olmalıdır." }).optional(),
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." }).optional(),
  bio: z.string().max(500, { message: "Bio en fazla 500 karakter olmalıdır." }).optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const validatedFields = ProfileSchema.safeParse({
    first_name: formData.get('first_name') || undefined,
    last_name: formData.get('last_name') || undefined,
    username: formData.get('username') || undefined,
    bio: formData.get('bio') || undefined,
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(' ');
    return { message: errorMessages, type: 'error' };
  }

  try {
    const supabase = createAuthClient();
    
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { message: 'Oturum bulunamadı. Lütfen yeniden giriş yapın.', type: 'error' };
    }

    // Admin client ile profil güncelle
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await adminSupabase
      .from('profiles')
      .update(validatedFields.data)
      .eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { message: 'Profil güncellenirken hata oluştu.', type: 'error' };
    }

    return { message: 'Profil başarıyla güncellendi!', type: 'success' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  }
}