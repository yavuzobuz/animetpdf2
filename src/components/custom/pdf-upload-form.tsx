
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PdfUploadFormProps {
  onPdfUpload: (file: File, dataUri: string) => void;
  isLoading: boolean;
}

export function PdfUploadForm({ onPdfUpload, isLoading }: PdfUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
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
        title: "File Read Error",
        description: "Could not read the selected PDF file.",
        variant: "destructive",
      });
    }
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Upload PDF</CardTitle>
        <CardDescription>Select a PDF document to analyze and generate an animation scenario.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-upload" className="text-base">PDF File</Label>
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:text-primary file:font-semibold"
              disabled={isLoading}
              aria-describedby="pdf-upload-description"
            />
            <p id="pdf-upload-description" className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file chosen."}
            </p>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
