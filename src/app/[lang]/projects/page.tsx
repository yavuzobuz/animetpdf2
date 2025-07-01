"use client";

import React from 'react';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { createBrowserClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsListPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const params = useParams();
  const currentLang = (params?.lang as 'en' | 'tr') || language || 'tr';
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const supabase = createBrowserClient();

      // Fetch PDF projects
      const { data: pdfs, error: pdfErr } = await supabase
        .from('pdf_projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (pdfErr) console.error(pdfErr);

      // Fetch animation-only projects
      const { data: animations, error: animErr } = await supabase
        .from('animation_pages')
        .select('id, topic, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (animErr) console.error(animErr);

      const combined = [
        ...(pdfs || []),
        ...(animations || []).map((ap: any) => ({
          id: ap.id,
          title: ap.topic,
          created_at: ap.created_at,
          is_animation: true
        }))
      ];

      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setProjects(combined);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  const ui = {
    tr: {
      title: 'Analiz Projeleri',
      empty: 'Henüz analiz yapılmadı.',
      view: 'Görüntüle'
    },
    en: {
      title: 'Analysis Projects',
      empty: 'No analyses yet.',
      view: 'View'
    }
  }[currentLang];

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p>Giriş yapmalısınız.</p>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading">
          <circle cx="15" cy="15" r="15" fill="#8b5cf6">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0s"/>
          </circle>
          <circle cx="60" cy="15" r="15" fill="#ec4899">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.2s"/>
          </circle>
          <circle cx="105" cy="15" r="15" fill="#06b6d4">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.4s"/>
          </circle>
        </svg>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold">{ui.title}</h1>
      {projects.length === 0 ? (
        <p>{ui.empty}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj) => (
            <Card key={proj.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{proj.title}</CardTitle>
                <CardDescription>{new Date(proj.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${currentLang}/projects/${proj.id}`}>
                  <Button>{ui.view}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 