"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  extractedText?: string;
  status: "uploading" | "processing" | "ready" | "error";
  error?: string;
}

interface SpecificationUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  maxFiles?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

export function SpecificationUpload({
  onFilesChange,
  files,
  maxFiles = 5,
  maxSizeMB = 10,
}: SpecificationUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File): Promise<UploadedFile> => {
    const id = crypto.randomUUID();

    // Create initial file entry
    const uploadedFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "processing",
    };

    try {
      // For now, we'll extract text client-side for .txt files
      // PDF and Word extraction will happen server-side
      if (file.type === "text/plain") {
        const text = await file.text();
        return {
          ...uploadedFile,
          extractedText: text,
          status: "ready",
        };
      }

      // For PDF/Word, we'll send to server for extraction
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const { text } = await response.json();

      return {
        ...uploadedFile,
        extractedText: text,
        status: "ready",
      };
    } catch (err) {
      return {
        ...uploadedFile,
        status: "error",
        error: err instanceof Error ? err.message : "Failed to process file",
      };
    }
  };

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(newFiles);

    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      // Check type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Accepted: PDF, Word, TXT`);
        continue;
      }

      // Check size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum ${maxSizeMB}MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Add files with uploading status
    const processingFiles: UploadedFile[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
    }));

    onFilesChange([...files, ...processingFiles]);

    // Process files
    const processedFiles = await Promise.all(
      validFiles.map((file, index) =>
        processFile(file).then((result) => ({
          ...result,
          id: processingFiles[index].id,
        }))
      )
    );

    // Update with processed results
    onFilesChange([
      ...files,
      ...processedFiles,
    ]);
  }, [files, maxFiles, maxSizeMB, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Specifications</h3>
          <p className="text-sm text-muted-foreground">
            Upload project specs, drawings notes, or scope documents for more accurate RAMS generation
          </p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging
            ? "border-primary bg-primary/5"
            : "border-white/20 hover:border-white/40"
          }
        `}
      >
        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className={`h-10 w-10 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-lg font-medium mb-1">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Accepted: PDF, Word (.doc, .docx), Text files. Max {maxSizeMB}MB each, up to {maxFiles} files.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                  {file.extractedText && (
                    <span className="ml-2">
                      • {file.extractedText.length.toLocaleString()} characters extracted
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {file.status === "uploading" && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
                {file.status === "processing" && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Processing...</span>
                  </div>
                )}
                {file.status === "ready" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
                {file.status === "error" && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">{file.error}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info about what happens with files */}
      {files.some((f) => f.status === "ready") && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-400">
            <strong>Ready for AI processing.</strong> When you generate the RAMS, Claude will read these specifications to understand your project scope, requirements, and any specific safety considerations mentioned.
          </p>
        </div>
      )}
    </div>
  );
}
