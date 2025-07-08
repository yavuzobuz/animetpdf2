"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { createBrowserClient } from '@/lib/supabase'

const profileSchema = z.object({
  full_name: z.string().min(2, 'En az 2 karakter').max(60, 'En fazla 60 karakter'),
  avatar_url: z.string().url({ message: 'Geçerli bir URL girin' }).optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfilePage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const t = {
    tr: {
      title: 'Profilini Düzenle',
      nameLabel: 'Ad Soyad',
      avatarLabel: 'Avatar URL',
      save: 'Kaydet',
      cancel: 'Vazgeç',
      success: 'Profil güncellendi',
      error: 'Profil güncellenemedi',
    },
    en: {
      title: 'Edit Your Profile',
      nameLabel: 'Full Name',
      avatarLabel: 'Avatar URL',
      save: 'Save',
      cancel: 'Cancel',
      success: 'Profile updated',
      error: 'Profile update failed',
    },
  } as const

  const text = (language && t[language]) || t.tr

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', avatar_url: '' },
  })

  // Load current profile info
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
      if (!error && data) {
        form.reset({
          full_name: data.full_name ?? '',
          avatar_url: data.avatar_url ?? '',
        })
      }
    }
    loadProfile()
  }, [user, form])

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return
    const supabase = createBrowserClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: values.full_name,
        avatar_url: values.avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast({ variant: 'destructive', title: text.error })
    } else {
      toast({ title: text.success })
      router.back()
    }
  }

  return (
    <div className="container mx-auto py-20">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>{text.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={text.nameLabel} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text.avatarLabel} (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  {text.cancel}
                </Button>
                <Button type="submit">{text.save}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 