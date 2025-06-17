'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

// Placeholder for Prisma client initialization
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// Placeholder for password hashing library
// import bcrypt from 'bcryptjs';

const SignupSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
  confirmPassword: z.string().min(6, { message: "Şifre onayı en az 6 karakter olmalıdır." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"], // Set error on confirmPassword field
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

  // --- Prisma Integration Placeholder ---
  // try {
  //   const existingUser = await prisma.user.findUnique({ where: { email } });
  //   if (existingUser) {
  //     return { message: 'Bu e-posta adresi zaten kayıtlı.', type: 'error' };
  //   }
  //
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //
  //   await prisma.user.create({
  //     data: { email, password: hashedPassword },
  //   });
  //
  //   return { message: 'Kayıt başarılı! Lütfen giriş yapın.', type: 'success' };
  // } catch (error) {
  //   console.error('Signup error:', error);
  //   return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  // }
  // --- End Prisma Integration Placeholder ---

  console.log('Simulating user signup:', { email });
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  return { message: 'Kayıt başarılı (simülasyon)! Lütfen giriş yapın.', type: 'success' };
}

const LoginSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  password: z.string().min(1, { message: "Şifre boş olamaz." }), // Min 1 for login, specific length check done by bcrypt compare
});

export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(' ');
    return { message: errorMessages, type: 'error' };
  }
  
  const { email, password } = validatedFields.data;

  // --- Prisma Integration Placeholder ---
  // try {
  //   const user = await prisma.user.findUnique({ where: { email } });
  //   if (!user) {
  //     return { message: 'Geçersiz e-posta veya şifre.', type: 'error' };
  //   }
  //
  //   const isValidPassword = await bcrypt.compare(password, user.password); // user.password should be hashed
  //   if (!isValidPassword) {
  //     return { message: 'Geçersiz e-posta veya şifre.', type: 'error' };
  //   }
  //
  //   // TODO: Handle session creation (e.g., using next-auth or cookies)
  //   // For now, we'll redirect directly after successful login simulation
  //
  // } catch (error) {
  //   console.error('Login error:', error);
  //   return { message: 'Beklenmedik bir hata oluştu.', type: 'error' };
  // }
  // --- End Prisma Integration Placeholder ---

  console.log('Simulating user login:', { email });
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

  if (email === "test@example.com" && password === "password") {
    // Successful login simulation, redirect to /animate
    // Note: redirect() must be called, not returned, from a server action.
    // If useFormState is used, this can be tricky. A common pattern is to
    // return a state that indicates redirection.
    return { message: 'Giriş başarılı (simülasyon)! Yönlendiriliyorsunuz...', type: 'success', redirectPath: '/animate' };
  } else {
    return { message: 'Geçersiz e-posta veya şifre (simülasyon).', type: 'error' };
  }
}