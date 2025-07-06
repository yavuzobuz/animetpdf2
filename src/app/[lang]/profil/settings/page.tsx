"use client";

import { useLanguage } from '@/contexts/language-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const t = {
    tr: {
      title: 'Ayarlar',
      comingSoon: 'Ayarlar sayfası yakında aktif olacak.',
      back: 'Geri Dön',
    },
    en: {
      title: 'Settings',
      comingSoon: 'Settings page will be active soon.',
      back: 'Go Back',
    },
  } as const;

  const text = (language && t[language]) || t.tr;

  return (
    <div className="container mx-auto py-20">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>{text.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>{text.comingSoon}</p>
          <Button onClick={() => router.back()}>{text.back}</Button>
        </CardContent>
      </Card>
    </div>
  );
} 