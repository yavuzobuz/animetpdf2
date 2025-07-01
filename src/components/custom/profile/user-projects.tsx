"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Calendar, Eye, Plus, Workflow, Network, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ProjectData {
  id: string;
  title: string;
  pdf_file_url?: string;
  pdf_url?: string; // Backward compatibility
  qa_data?: any;
  qa_pairs?: any;
  animation_scenario?: any;
  analysis_result?: {
    summary?: string;
    diagram?: {
      description: string;
      steps: any[];
      reactFlowSteps: any[];
      stepCount: number;
      flowType: string;
    };
  };
  animation_settings?: {
    type?: string;
    diagramType?: string;
    stepCount?: number;
  };
  status: 'processing' | 'completed' | 'failed' | 'uploaded';
  created_at: string;
  updated_at: string;
}

interface UserProjectsProps {
  projects: ProjectData[];
  isOwner: boolean;
  currentLang: 'tr' | 'en';
  onDeleteProject?: (projectId: string) => Promise<void>;
}

const statusLabels = {
  processing: { tr: 'İşleniyor', en: 'Processing' },
  completed: { tr: 'Tamamlandı', en: 'Completed' },
  failed: { tr: 'Başarısız', en: 'Failed' },
  uploaded: { tr: 'Yüklendi', en: 'Uploaded' }
};

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  uploaded: 'bg-blue-100 text-blue-800'
};

// Proje tipini belirle
const getProjectType = (project: ProjectData) => {
  if (project.animation_settings?.type === 'diagram' || project.analysis_result?.diagram) {
    return 'diagram';
  }
  if (project.animation_scenario && project.animation_scenario.length > 0) {
    return 'animation';
  }
  return 'pdf';
};

export default function UserProjects({ projects, isOwner, currentLang, onDeleteProject }: UserProjectsProps) {
  const [showAll, setShowAll] = useState(false);

  const uiText = {
    tr: {
      title: 'Son Projeler',
      description: 'Oluşturduğunuz PDF animasyon ve diyagram projeleri',
      noProjects: 'Henüz proje oluşturulmamış',
      noProjectsDescription: 'İlk projenizi oluşturmak için PDF yükleyin veya diyagram oluşturun.',
      createProject: 'Yeni Proje Oluştur',
      viewProject: 'Projeyi Görüntüle',
      playAnimation: 'Animasyonu Oynat',
      viewDiagram: 'Diyagramı Görüntüle',
      deleteProject: 'Sil',
      showAll: 'Tümünü Göster',
      showLess: 'Daha Az Göster',
      createdAt: 'Oluşturulma',
      updatedAt: 'Güncelleme',
      projectTypes: {
        animation: 'Animasyon Projesi',
        diagram: 'Diyagram Projesi',
        pdf: 'PDF Projesi'
      }
    },
    en: {
      title: 'Recent Projects',
      description: 'Your created PDF animation and diagram projects',
      noProjects: 'No projects created yet',
      noProjectsDescription: 'Upload a PDF or create a diagram to start your first project.',
      createProject: 'Create New Project',
      viewProject: 'View Project',
      playAnimation: 'Play Animation',
      viewDiagram: 'View Diagram',
      deleteProject: 'Delete',
      showAll: 'Show All',
      showLess: 'Show Less',
      createdAt: 'Created',
      updatedAt: 'Updated',
      projectTypes: {
        animation: 'Animation Project',
        diagram: 'Diagram Project',
        pdf: 'PDF Project'
      }
    }
  };

  const text = uiText[currentLang] || uiText.tr;
  
  // Son 5 proje veya tümünü göster
  const displayedProjects = showAll ? projects : projects.slice(0, 5);
  const hasMoreProjects = projects.length > 5;

  if (projects.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {text.noProjects}
          </h3>
          <p className="text-gray-500 mb-6">
            {text.noProjectsDescription}
          </p>
          {isOwner && (
            <Link href={`/${currentLang}/animate`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {text.createProject}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{text.title}</CardTitle>
            <CardDescription>{text.description}</CardDescription>
          </div>
          {isOwner && (
            <Link href={`/${currentLang}/animate`}>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {text.createProject}
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              text={text}
              currentLang={currentLang}
              isOwner={isOwner}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </div>
        
        {/* Tümünü Göster/Daha Az Göster Butonu */}
        {hasMoreProjects && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {text.showLess}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {text.showAll} ({projects.length - 5} proje daha)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectCard({ 
  project, 
  text, 
  currentLang, 
  isOwner,
  onDeleteProject
}: { 
  project: ProjectData;
  text: any;
  currentLang: 'tr' | 'en';
  isOwner: boolean;
  onDeleteProject?: (projectId: string) => Promise<void>;
}) {
  const statusLabel = statusLabels[project.status][currentLang] || statusLabels[project.status].tr;
  const statusColor = statusColors[project.status];
  const projectType = getProjectType(project);

  const createdDate = formatDistanceToNow(new Date(project.created_at), {
    addSuffix: true,
    locale: currentLang === 'tr' ? tr : undefined
  });

  const hasAnimation = project.animation_scenario && project.animation_scenario.length > 0 && project.status === 'completed';
  const hasDiagram = project.analysis_result?.diagram || (project.animation_settings?.type === 'diagram');
  
  const handleDelete = async () => {
    if (onDeleteProject && window.confirm(currentLang === 'tr' ? 'Bu projeyi silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this project?')) {
      await onDeleteProject(project.id);
    }
  };
  
  // Proje tipi ikonunu belirle
  const getProjectIcon = () => {
    switch (projectType) {
      case 'diagram':
        return <Network className="w-4 h-4" />;
      case 'animation':
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Proje tipi rengini belirle
  const getProjectTypeColor = () => {
    switch (projectType) {
      case 'diagram':
        return 'bg-purple-100 text-purple-800';
      case 'animation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getProjectTypeColor()}`}>
                {getProjectIcon()}
                <span className="ml-1">{text.projectTypes[projectType]}</span>
              </Badge>
              <Badge className={`text-xs ${statusColor}`}>
                {statusLabel}
              </Badge>
            </div>
          </div>
          {/* Silme Butonu */}
          {isOwner && onDeleteProject && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{text.createdAt}: {createdDate}</span>
        </div>

        {/* Proje detayları */}
        <div className="text-xs text-muted-foreground space-y-1">
          {(project.qa_data || project.qa_pairs) && (
            <div>📋 {(project.qa_data?.questions?.length || project.qa_pairs?.length || 0)} soru oluşturuldu</div>
          )}
          {hasDiagram && project.analysis_result?.diagram && (
            <div>📊 {project.analysis_result.diagram.stepCount || 0} adımlı diyagram</div>
          )}
          {hasAnimation && (
            <div>🎬 {project.animation_scenario.length} çerçeveli animasyon</div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link href={`/${currentLang}/projects/${project.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              {text.viewProject}
            </Button>
          </Link>
          
          <div className="flex gap-2">
            {hasAnimation && (
              <Link href={`/${currentLang}/projects/${project.id}/play`} className="flex-1">
                <Button size="sm" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  {text.playAnimation}
                </Button>
              </Link>
            )}
            
            {hasDiagram && (
              <Link href={`/${currentLang}/projects/${project.id}/diagram`} className="flex-1">
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  <Workflow className="w-4 h-4 mr-2" />
                  {text.viewDiagram}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
