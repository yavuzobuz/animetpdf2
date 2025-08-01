import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProjectDetails } from '@/lib/database';
import DiagramViewer from '@/components/custom/diagram-viewer';

interface DiagramPageProps {
  params: Promise<{
    lang: 'tr' | 'en';
    projectId: string;
  }>;
}

export default async function DiagramPage({ params }: DiagramPageProps) {
  const { lang, projectId } = await params;

  // Proje detaylarını al - User ID kontrolü olmadan genel erişim
  const projectResult = await getProjectDetails(projectId, '');

  if (!projectResult.success || !projectResult.data) {
    notFound();
  }

  const project = projectResult.data;

  // Diyagram verisi var mı kontrol et
  const hasDiagram = project.analysis_result?.diagram || project.animation_settings?.type === 'diagram';

  if (!hasDiagram) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {lang === 'tr' ? 'Diyagram Bulunamadı' : 'Diagram Not Found'}
          </h1>
          <p className="text-gray-600">
            {lang === 'tr'
              ? 'Bu proje için henüz diyagram oluşturulmamış.'
              : 'No diagram has been created for this project yet.'}
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
            {lang === 'tr' ? 'Diyagram Görüntüleyici' : 'Diagram Viewer'}
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          </div>
        }>
          <DiagramViewer
            project={project}
            language={lang}
          />
        </Suspense>
      </div>
    </div>
  );
}