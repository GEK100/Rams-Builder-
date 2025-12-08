"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Sparkles, Check } from "lucide-react";
import { useRAMSStore } from "@/stores/ramsStore";
import { cn } from "@/lib/utils";

interface ExtractedInfo {
  projectTitle?: string;
  projectDescription?: string;
  projectReference?: string;
  clientCompany?: string;
  siteAddress?: {
    line1?: string;
    city?: string;
    postcode?: string;
  };
  mainContractor?: string;
  startDate?: string;
  duration?: string;
  suggestedActivities?: string[];
}

export function ProjectScopeUpload() {
  const { currentRAMS, updateRAMS, updateCDMInfo } = useRAMSStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [showExtracted, setShowExtracted] = useState(false);
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

      // Try to extract project info using AI
      setIsExtracting(true);
      try {
        const extractResponse = await fetch("/api/extract-project-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scopeText: data.text }),
        });

        if (extractResponse.ok) {
          const extractData = await extractResponse.json();
          if (extractData.extracted && Object.keys(extractData.extracted).length > 0) {
            setExtractedInfo(extractData.extracted);
            setShowExtracted(true);
          }
        }
      } catch (extractErr) {
        console.error("Failed to extract project info:", extractErr);
        // Non-fatal - user can still fill manually
      } finally {
        setIsExtracting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Apply extracted information to the form
  const handleApplyExtracted = () => {
    if (!extractedInfo) return;

    // Update CDM info with extracted data
    if (extractedInfo.projectTitle || extractedInfo.projectDescription || extractedInfo.projectReference || extractedInfo.startDate) {
      updateCDMInfo({
        project: {
          ...currentRAMS?.cdmInfo?.project,
          title: extractedInfo.projectTitle || currentRAMS?.cdmInfo?.project?.title || "",
          description: extractedInfo.projectDescription || currentRAMS?.cdmInfo?.project?.description || "",
          reference: extractedInfo.projectReference || currentRAMS?.cdmInfo?.project?.reference || "",
          startDate: extractedInfo.startDate || currentRAMS?.cdmInfo?.project?.startDate || "",
          siteAddress: extractedInfo.siteAddress ? {
            line1: extractedInfo.siteAddress.line1 || currentRAMS?.cdmInfo?.project?.siteAddress?.line1 || "",
            city: extractedInfo.siteAddress.city || currentRAMS?.cdmInfo?.project?.siteAddress?.city || "",
            postcode: extractedInfo.siteAddress.postcode || currentRAMS?.cdmInfo?.project?.siteAddress?.postcode || "",
          } : currentRAMS?.cdmInfo?.project?.siteAddress || { line1: "", city: "", postcode: "" },
        },
      });
    }

    if (extractedInfo.clientCompany) {
      updateCDMInfo({
        client: {
          ...currentRAMS?.cdmInfo?.client,
          company: extractedInfo.clientCompany,
        },
      });
    }

    if (extractedInfo.mainContractor) {
      updateCDMInfo({
        principalContractor: {
          ...currentRAMS?.cdmInfo?.principalContractor,
          company: extractedInfo.mainContractor,
        },
      });
    }

    // Update RAMS title if we have a project title
    if (extractedInfo.projectTitle) {
      updateRAMS({ title: extractedInfo.projectTitle });
    }

    setShowExtracted(false);
  };

  const handleRemove = () => {
    updateRAMS({
      projectScope: undefined,
      projectScopeFileName: undefined,
    });
    setExtractedInfo(null);
    setShowExtracted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Count how many fields were extracted
  const extractedFieldCount = extractedInfo
    ? Object.entries(extractedInfo).filter(([, v]) => v !== undefined && v !== null && v !== "").length
    : 0;

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

            {/* Extracting indicator */}
            {isExtracting && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <p className="text-sm text-primary">Analyzing document for project details...</p>
              </div>
            )}

            {/* Extracted info panel */}
            {showExtracted && extractedInfo && extractedFieldCount > 0 && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-medium text-primary">Project details found</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We found {extractedFieldCount} field{extractedFieldCount > 1 ? "s" : ""} in your document that can auto-fill the form:
                </p>
                <ul className="text-sm space-y-1">
                  {extractedInfo.projectTitle && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Project Title: {extractedInfo.projectTitle}</span>
                    </li>
                  )}
                  {extractedInfo.clientCompany && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Client: {extractedInfo.clientCompany}</span>
                    </li>
                  )}
                  {extractedInfo.mainContractor && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Main Contractor: {extractedInfo.mainContractor}</span>
                    </li>
                  )}
                  {extractedInfo.siteAddress?.line1 && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Site Address: {extractedInfo.siteAddress.line1}, {extractedInfo.siteAddress.city}</span>
                    </li>
                  )}
                  {extractedInfo.projectReference && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Reference: {extractedInfo.projectReference}</span>
                    </li>
                  )}
                  {extractedInfo.startDate && (
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Start Date: {extractedInfo.startDate}</span>
                    </li>
                  )}
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleApplyExtracted}>
                    <Check className="h-4 w-4 mr-1" />
                    Apply to Form
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowExtracted(false)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
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
