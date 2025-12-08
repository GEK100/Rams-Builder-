"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRAMSStore } from "@/stores/ramsStore";
import { cn } from "@/lib/utils";

export function ProjectScopeUpload() {
  const { currentRAMS, updateRAMS } = useRAMSStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Max file size: 5MB (scope documents don't need to be huge)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  // Max extracted text: 50,000 characters (~12,000 tokens for AI)
  const MAX_TEXT_LENGTH = 50000;

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, Word document, or text file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB. Try compressing the PDF or splitting the document.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text");
      }

      if (data.warning) {
        setError(data.warning);
      }

      updateRAMS({
        projectScope: data.text,
        projectScopeFileName: file.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    updateRAMS({
      projectScope: undefined,
      projectScopeFileName: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasScope = !!currentRAMS?.projectScope;

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Project Scope
        </CardTitle>
        <CardDescription>
          Upload your project scope document (PDF, Word, or text file) to help generate accurate RAMS content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasScope ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">Scope uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    {currentRAMS?.projectScopeFileName || "Document"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 max-h-48 overflow-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                {currentRAMS?.projectScope?.substring(0, 500)}
                {(currentRAMS?.projectScope?.length || 0) > 500 && "..."}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              This content will be used when generating your RAMS document
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-white/10 hover:border-white/20",
              isUploading && "opacity-50 pointer-events-none"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                <p className="text-muted-foreground">Extracting text from document...</p>
              </div>
            ) : (
              <>
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium mb-1">
                  Drag and drop your scope document here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports PDF, Word (.doc, .docx), and text files up to 5MB
                </p>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
