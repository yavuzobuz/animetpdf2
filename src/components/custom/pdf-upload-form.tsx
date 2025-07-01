"use client";

import React, { useState, useRef, DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, FileText, Cloud, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PdfUploadFormProps {
  onPdfUpload: (file: File, dataUri: string) => void;
  isLoading: boolean;
  lang?: 'tr' | 'en';
}

const uploadFormText = {
  tr: {
    title: "PDF Yükle",
    subtitle: "Analiz edip animasyon senaryosu oluşturmak için PDF dosyanızı seçin",
    invalidFileType: "Geçersiz Dosya Türü",
    invalidFileTypeDesc: "Lütfen bir PDF dosyası yükleyin.",
    fileNotSelected: "Dosya Seçilmedi",
    fileNotSelectedDesc: "Lütfen yüklemek için bir PDF dosyası seçin.",
    fileReadError: "Dosya Okuma Hatası",
    fileReadErrorDesc: "Seçilen PDF dosyası okunamadı.",
    fileSuccessfullySelected: "✨ Dosya Başarıyla Seçildi!",
    size: "📊 Boyut:",
    dragDropText: "📁 PDF dosyanızı buraya sürükleyin",
    orText: "veya",
    selectFromComputer: "💻 bilgisayarınızdan seçin",
    onlyPdfFiles: "🔒 Yalnızca PDF dosyaları • Güvenli yükleme",
    processing: "🔄 İşleniyor...",
    uploadAnalyze: "🚀 Yükle ve Analiz Et",
    ready: "✅ Hazır! Analiz başlatmak için butona tıklayın",
    selectPdf: "PDF dosyası seç"
  },
  en: {
    title: "Upload PDF",
    subtitle: "Select your PDF file to analyze and create animation scenario",
    invalidFileType: "Invalid File Type",
    invalidFileTypeDesc: "Please upload a PDF file.",
    fileNotSelected: "No File Selected",
    fileNotSelectedDesc: "Please select a PDF file to upload.",
    fileReadError: "File Reading Error",
    fileReadErrorDesc: "The selected PDF file could not be read.",
    fileSuccessfullySelected: "✨ File Successfully Selected!",
    size: "📊 Size:",
    dragDropText: "📁 Drag your PDF file here",
    orText: "or",
    selectFromComputer: "💻 select from your computer",
    onlyPdfFiles: "🔒 PDF files only • Secure upload",
    processing: "🔄 Processing...",
    uploadAnalyze: "🚀 Upload and Analyze",
    ready: "✅ Ready! Click the button to start analysis",
    selectPdf: "Select PDF file"
  }
};

export function PdfUploadForm({ onPdfUpload, isLoading, lang }: PdfUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const currentLang = lang || language || 'tr';
  const text = uploadFormText[currentLang] || uploadFormText.tr;
  const tooltipText = currentLang === 'tr' ? 'PDF Yükle' : 'Upload PDF';

  const handleFileChange = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: text.invalidFileType,
        description: text.invalidFileTypeDesc,
        variant: "destructive",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Dosya boyutu kontrolü (15MB = 15 * 1024 * 1024 bytes)
    const maxSizeInMB = 15;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2);
      toast({
        title: "Dosya Çok Büyük",
        description: `PDF dosyası ${fileSizeInMB} MB boyutunda. Lütfen ${maxSizeInMB} MB'dan küçük bir dosya seçin.`,
        variant: "destructive",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: text.fileNotSelected,
        description: text.fileNotSelectedDesc,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUri = loadEvent.target?.result as string;
      onPdfUpload(selectedFile, dataUri);
    };
    reader.onerror = () => {
      toast({
        title: text.fileReadError,
        description: text.fileReadErrorDesc,
        variant: "destructive",
      });
    }
    reader.readAsDataURL(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-headline bg-gradient-to-r from-purple-600 via-primary to-pink-600 bg-clip-text text-transparent mt-[10px]">
            {text.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        {/* Modern Drag & Drop Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-3xl p-16 transition-all duration-600 cursor-pointer group backdrop-blur-sm",
            isDragOver
              ? "border-primary bg-gradient-to-br from-primary/10 to-purple-500/10 scale-105 shadow-xl shadow-primary/20"
              : selectedFile
              ? "border-green-500 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg shadow-green-500/20"
              : "border-muted-foreground/30 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-purple-500/5 hover:shadow-lg hover:shadow-primary/10",
            isLoading && "pointer-events-none opacity-60"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isLoading}
            aria-label={text.selectPdf}
          />
          
          <div className="flex flex-col items-center space-y-6 text-center">
            {selectedFile ? (
              <>
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">
                    {text.fileSuccessfullySelected}
                  </p>
                  <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full border shadow-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      📄 {selectedFile.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {text.size} {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 group-hover:from-purple-500/30 group-hover:to-purple-500/30 transition-all duration-540 group-hover:scale-110">
                        <Upload className="w-12 h-12 text-primary group-hover:animate-bounce" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {tooltipText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-foreground">
                    {text.dragDropText}
                  </p>
                  <p className="text-muted-foreground">
                    {text.orText}{" "}
                    <span className="text-primary font-semibold hover:underline bg-primary/10 px-2 py-1 rounded-md">
                      {text.selectFromComputer}
                    </span>
                  </p>
                  <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground mt-6 bg-muted/50 rounded-full px-4 py-2">
                    <FileText className="w-4 h-4" />
                    <span>{text.onlyPdfFiles}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compact Submit Button */}
        <Button
          type="submit"
          className={cn(
            "block mx-auto px-6 h-10 text-sm font-medium rounded-md shadow-md flex items-center justify-center gap-2 transition-all duration-200",
            selectedFile
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              {text.processing}
            </>
          ) : (
            <>
              <Upload className="mr-1 h-3 w-3" />
              {text.uploadAnalyze}
            </>
          )}
        </Button>

        {/* File Info */}
        {selectedFile && !isLoading && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <FileText className="w-4 h-4" />
              <span>{text.ready}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
