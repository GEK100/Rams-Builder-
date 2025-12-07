"use client";

import { useState, useEffect } from "react";
import { useRAMSStore } from "@/stores/ramsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ChevronDown, ChevronUp, Calendar, RefreshCw, PenLine, Upload, FileText, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, description, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card variant="glass">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CardHeader>
      </button>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  );
}

/**
 * Calculate review date (3 months from RAMS date)
 */
function calculateReviewDate(ramsDate: string): string {
  if (!ramsDate) return "";
  const date = new Date(ramsDate);
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split("T")[0];
}

/**
 * Simplified CDM form for subcontractors
 * - No F10 Notification
 * - No Principal Designer
 * - Simplified Client (company name & address only)
 * - Main Contractor details
 * - Project/Site details
 * - RAMS Date + Auto Review Date (3 months)
 */
export function SubcontractorInfoForm() {
  const { currentRAMS, updateCDMInfo } = useRAMSStore();
  const cdmInfo = currentRAMS?.cdmInfo;

  // Local state for dates (will be added to CDMInfo type)
  const [ramsDate, setRamsDate] = useState(() => {
    // Default to today
    return new Date().toISOString().split("T")[0];
  });
  const [reviewDate, setReviewDate] = useState(() => calculateReviewDate(ramsDate));

  // Author signature details
  const [authorName, setAuthorName] = useState("");
  const [authorPosition, setAuthorPosition] = useState("");
  const [authorCompany, setAuthorCompany] = useState("");
  const [signatureDate, setSignatureDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Company LOTO document
  const [lotoDocument, setLotoDocument] = useState<File | null>(null);
  const [lotoDocumentName, setLotoDocumentName] = useState<string>("");

  // Update review date when RAMS date changes
  useEffect(() => {
    setReviewDate(calculateReviewDate(ramsDate));
  }, [ramsDate]);

  const updateField = (section: string, field: string, value: string) => {
    if (!cdmInfo) return;
    const sectionData = cdmInfo[section as keyof typeof cdmInfo];
    updateCDMInfo({
      [section]: {
        ...(typeof sectionData === "object" ? sectionData : {}),
        [field]: value,
      },
    });
  };

  const updateNestedField = (section: string, subsection: string, field: string, value: string) => {
    if (!cdmInfo) return;
    const sectionData = cdmInfo[section as keyof typeof cdmInfo] as Record<string, unknown>;
    updateCDMInfo({
      [section]: {
        ...sectionData,
        [subsection]: {
          ...(sectionData[subsection] as Record<string, unknown>),
          [field]: value,
        },
      },
    });
  };

  if (!cdmInfo) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No RAMS loaded. Create or load a RAMS to edit project information.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Project Information</h2>
        <p className="text-muted-foreground">
          Complete the project details for your RAMS
        </p>
      </div>

      {/* RAMS Dates - Always visible at top */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            RAMS Dates
          </CardTitle>
          <CardDescription>
            Document creation and review dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rams-date">RAMS Date *</Label>
              <Input
                id="rams-date"
                type="date"
                value={ramsDate}
                onChange={(e) => setRamsDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Date this RAMS is created/issued
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-date" className="flex items-center gap-2">
                Review Date
                <RefreshCw className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input
                id="review-date"
                type="date"
                value={reviewDate}
                readOnly
                className="bg-white/5 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Auto-set to 3 months from RAMS date
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author / Prepared By */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            Prepared By
          </CardTitle>
          <CardDescription>
            Details of the person preparing this RAMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author-name">Name *</Label>
                <Input
                  id="author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-position">Position / Role</Label>
                <Input
                  id="author-position"
                  value={authorPosition}
                  onChange={(e) => setAuthorPosition(e.target.value)}
                  placeholder="e.g., Contracts Manager, Electrician"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author-company">Company</Label>
                <Input
                  id="author-company"
                  value={authorCompany}
                  onChange={(e) => setAuthorCompany(e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature-date">Date Signed *</Label>
                <Input
                  id="signature-date"
                  type="date"
                  value={signatureDate}
                  onChange={(e) => setSignatureDate(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground mb-2">
                By completing this section, I confirm that this RAMS has been prepared in accordance with current health and safety legislation and best practice guidance.
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10 mt-3">
                <div className="flex-1 border-b border-dashed border-white/30 pb-1">
                  <p className="text-sm font-medium">{authorName || "Signature"}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {signatureDate ? new Date(signatureDate).toLocaleDateString("en-GB") : "Date"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client - Simplified (Company name and address only) */}
      <CollapsibleSection
        title="Client Details"
        description="The end client for this project"
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-company">Company Name *</Label>
            <Input
              id="client-company"
              value={cdmInfo.client.company}
              onChange={(e) => updateField("client", "company", e.target.value)}
              placeholder="Client company name"
            />
          </div>
          <div className="space-y-2">
            <Label>Site Address</Label>
            <div className="grid grid-cols-1 gap-3">
              <Input
                value={cdmInfo.project.siteAddress.line1}
                onChange={(e) => updateNestedField("project", "siteAddress", "line1", e.target.value)}
                placeholder="Street address"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={cdmInfo.project.siteAddress.city}
                  onChange={(e) => updateNestedField("project", "siteAddress", "city", e.target.value)}
                  placeholder="City"
                />
                <Input
                  value={cdmInfo.project.siteAddress.postcode}
                  onChange={(e) => updateNestedField("project", "siteAddress", "postcode", e.target.value)}
                  placeholder="Postcode"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Main Contractor - Who you're working under */}
      <CollapsibleSection
        title="Main Contractor"
        description="The contractor you are working under"
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mc-company">Company Name *</Label>
              <Input
                id="mc-company"
                value={cdmInfo.principalContractor.company}
                onChange={(e) => updateField("principalContractor", "company", e.target.value)}
                placeholder="Main contractor company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mc-contact">Site Contact Name</Label>
              <Input
                id="mc-contact"
                value={cdmInfo.principalContractor.contact.name}
                onChange={(e) => updateNestedField("principalContractor", "contact", "name", e.target.value)}
                placeholder="Site supervisor/manager"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mc-phone">Phone</Label>
              <Input
                id="mc-phone"
                type="tel"
                value={cdmInfo.principalContractor.contact.phone}
                onChange={(e) => updateNestedField("principalContractor", "contact", "phone", e.target.value)}
                placeholder="Contact phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mc-email">Email</Label>
              <Input
                id="mc-email"
                type="email"
                value={cdmInfo.principalContractor.contact.email}
                onChange={(e) => updateNestedField("principalContractor", "contact", "email", e.target.value)}
                placeholder="Contact email"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Project Details - Simplified */}
      <CollapsibleSection
        title="Project Details"
        description="Brief details about the work"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              value={cdmInfo.project.title}
              onChange={(e) => updateField("project", "title", e.target.value)}
              placeholder="e.g., Electrical Installation - Office Refurbishment"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-ref">Your Reference</Label>
            <Input
              id="project-ref"
              value={cdmInfo.project.reference}
              onChange={(e) => updateField("project", "reference", e.target.value)}
              placeholder="Your job/quote reference"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Brief Description of Works</Label>
            <textarea
              id="project-desc"
              value={cdmInfo.project.description}
              onChange={(e) => updateField("project", "description", e.target.value)}
              placeholder="Briefly describe the electrical work to be carried out..."
              className="flex min-h-[100px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-start">Expected Start Date</Label>
              <Input
                id="project-start"
                type="date"
                value={cdmInfo.project.startDate}
                onChange={(e) => updateField("project", "startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-duration">Duration (days)</Label>
              <Input
                id="project-duration"
                type="number"
                value={cdmInfo.project.durationWeeks || ""}
                onChange={(e) => updateField("project", "durationWeeks", e.target.value)}
                placeholder="Expected duration in days"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Site Information */}
      <CollapsibleSection
        title="Site Information"
        description="Important site-specific information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="asbestos-reg"
                checked={cdmInfo.preconstructionInfo.asbestosRegister}
                onChange={(e) => updateField("preconstructionInfo", "asbestosRegister", String(e.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="asbestos-reg">Asbestos register reviewed</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="drawings"
                checked={cdmInfo.preconstructionInfo.existingDrawings}
                onChange={(e) => updateField("preconstructionInfo", "existingDrawings", String(e.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="drawings">Drawings/plans available</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="utilities"
                checked={cdmInfo.preconstructionInfo.utilities}
                onChange={(e) => updateField("preconstructionInfo", "utilities", String(e.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="utilities">Existing services identified</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="building-services"
                checked={cdmInfo.preconstructionInfo.buildingServices}
                onChange={(e) => updateField("preconstructionInfo", "buildingServices", String(e.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="building-services">Isolation points known</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="known-hazards">Known Site Hazards</Label>
            <textarea
              id="known-hazards"
              value={cdmInfo.preconstructionInfo.knownHazards || ""}
              onChange={(e) => updateField("preconstructionInfo", "knownHazards", e.target.value)}
              placeholder="Any known hazards on site (e.g., asbestos locations, live services, height restrictions)..."
              className="flex min-h-[80px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Company LOTO Procedure */}
      <CollapsibleSection
        title="Company Lock Off Tag Off Procedure"
        description="Upload your company's LOTO procedure to include in all RAMS"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Lock className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Safe Isolation is Critical</p>
              <p className="text-xs text-muted-foreground mt-1">
                If your company has its own Lock Off Tag Off procedure, upload it here to be included
                as an appendix in all generated RAMS. This supplements the standard GS38 procedure.
              </p>
            </div>
          </div>

          {!lotoDocument ? (
            <div className="relative">
              <input
                type="file"
                id="loto-upload"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLotoDocument(file);
                    setLotoDocumentName(file.name);
                  }
                }}
              />
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Upload Company LOTO Procedure</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF or Word document (max 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lotoDocumentName}</p>
                  <p className="text-xs text-muted-foreground">
                    Will be included as Appendix in generated RAMS
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setLotoDocument(null);
                  setLotoDocumentName("");
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Your company procedure should include: isolation methods, lockout equipment used,
            danger tag requirements, testing procedures, and re-energisation checklist.
          </p>
        </div>
      </CollapsibleSection>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Subcontractor RAMS</strong>
          <br />
          This RAMS is for work carried out under a main contractor. F10 notification
          and Principal Designer details are handled by the main contractor.
        </p>
      </div>
    </div>
  );
}
