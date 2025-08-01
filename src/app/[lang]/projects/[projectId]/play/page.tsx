import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProjectDetails } from '@/lib/database';
import AnimationPlayer from '@/components/custom/animation-player';

interface PlayPageProps {
  params: Promise<{
    lang: 'tr' | 'en';
    projectId: string;
  }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { lang, projectId } = await params;

  // Proje detaylarını al - User ID kontrolü olmadan genel erişim
  const projectResult = await getProjectDetails(projectId, '');
  
  if (!projectResult.success || !projectResult.data) {
    notFound();
  }

  const project = projectResult.data;

  // Animasyon verisi var mı kontrol et
  if (!project.animation_scenario || !Array.isArray(project.animation_scenario) || project.animation_scenario.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {lang === 'tr' ? 'Animasyon Bulunamadı' : 'Animation Not Found'}
          </h1>
          <p className="text-gray-600">
            {lang === 'tr' 
              ? 'Bu proje için henüz animasyon oluşturulmamış.' 
              : 'No animation has been created for this project yet.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600">
            {lang === 'tr' ? 'Animasyon Oynatıcı' : 'Animation Player'}
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        }>
          <AnimationPlayer 
            project={project}
            language={lang}
          />
        </Suspense>
      </div>
    </div>
  );
}