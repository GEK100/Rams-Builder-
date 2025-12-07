"use client";

import { useState } from "react";
import { useRAMSStore } from "@/stores/ramsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CDMInfo, Contractor } from "@/types/cdm";

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

function AddressFields({
  prefix,
  value,
  onChange,
}: {
  prefix: string;
  value: { line1: string; line2?: string; city: string; county?: string; postcode: string };
  onChange: (field: string, val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor={`${prefix}-line1`}>Address Line 1</Label>
        <Input
          id={`${prefix}-line1`}
          value={value.line1}
          onChange={(e) => onChange("line1", e.target.value)}
          placeholder="Street address"
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor={`${prefix}-line2`}>Address Line 2</Label>
        <Input
          id={`${prefix}-line2`}
          value={value.line2 || ""}
          onChange={(e) => onChange("line2", e.target.value)}
          placeholder="Building, suite, etc. (optional)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-city`}>City</Label>
        <Input
          id={`${prefix}-city`}
          value={value.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="City"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-county`}>County</Label>
        <Input
          id={`${prefix}-county`}
          value={value.county || ""}
          onChange={(e) => onChange("county", e.target.value)}
          placeholder="County (optional)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-postcode`}>Postcode</Label>
        <Input
          id={`${prefix}-postcode`}
          value={value.postcode}
          onChange={(e) => onChange("postcode", e.target.value)}
          placeholder="Postcode"
        />
      </div>
    </div>
  );
}

function ContactFields({
  prefix,
  value,
  onChange,
}: {
  prefix: string;
  value: { name: string; email: string; phone: string; mobile?: string };
  onChange: (field: string, val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-contact-name`}>Contact Name</Label>
        <Input
          id={`${prefix}-contact-name`}
          value={value.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-email`}>Email</Label>
        <Input
          id={`${prefix}-email`}
          type="email"
          value={value.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="email@company.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-phone`}>Phone</Label>
        <Input
          id={`${prefix}-phone`}
          type="tel"
          value={value.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-mobile`}>Mobile</Label>
        <Input
          id={`${prefix}-mobile`}
          type="tel"
          value={value.mobile || ""}
          onChange={(e) => onChange("mobile", e.target.value)}
          placeholder="Mobile (optional)"
        />
      </div>
    </div>
  );
}

export function CDMForm() {
  const { currentRAMS, updateCDMInfo } = useRAMSStore();
  const cdmInfo = currentRAMS?.cdmInfo;

  const updateField = (section: keyof CDMInfo, field: string, value: string | boolean) => {
    if (!cdmInfo) return;
    updateCDMInfo({
      [section]: {
        ...cdmInfo[section],
        [field]: value,
      },
    } as Partial<CDMInfo>);
  };

  const updateNestedField = (section: keyof CDMInfo, subsection: string, field: string, value: string) => {
    if (!cdmInfo) return;
    const current = cdmInfo[section] as Record<string, unknown>;
    updateCDMInfo({
      [section]: {
        ...current,
        [subsection]: {
          ...(current[subsection] as Record<string, unknown>),
          [field]: value,
        },
      },
    } as Partial<CDMInfo>);
  };

  const addContractor = () => {
    if (!cdmInfo) return;
    const newContractor: Contractor = {
      id: crypto.randomUUID(),
      companyName: "",
      tradeName: "",
      address: { line1: "", city: "", postcode: "" },
      contact: { name: "", email: "", phone: "" },
    };
    updateCDMInfo({
      contractors: [...cdmInfo.contractors, newContractor],
    });
  };

  const removeContractor = (id: string) => {
    if (!cdmInfo) return;
    updateCDMInfo({
      contractors: cdmInfo.contractors.filter((c) => c.id !== id),
    });
  };

  const updateContractor = (id: string, field: string, value: string) => {
    if (!cdmInfo) return;
    updateCDMInfo({
      contractors: cdmInfo.contractors.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  if (!cdmInfo) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No RAMS loaded. Create or load a RAMS to edit CDM information.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">CDM Information</h2>
        <p className="text-muted-foreground">
          Complete the Construction Design and Management details for your RAMS
        </p>
      </div>

      {/* Client */}
      <CollapsibleSection
        title="Client Details"
        description="The person or organisation for whom the project is carried out"
        defaultOpen={true}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={cdmInfo.client.name}
                onChange={(e) => updateField("client", "name", e.target.value)}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-company">Company Name</Label>
              <Input
                id="client-company"
                value={cdmInfo.client.company}
                onChange={(e) => updateField("client", "company", e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Address</h4>
            <AddressFields
              prefix="client"
              value={cdmInfo.client.address}
              onChange={(field, value) => updateNestedField("client", "address", field, value)}
            />
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact Details</h4>
            <ContactFields
              prefix="client"
              value={cdmInfo.client.contact}
              onChange={(field, value) => updateNestedField("client", "contact", field, value)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Principal Designer */}
      <CollapsibleSection
        title="Principal Designer"
        description="Designer with control over the pre-construction phase"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pd-name">Name</Label>
              <Input
                id="pd-name"
                value={cdmInfo.principalDesigner.name}
                onChange={(e) => updateField("principalDesigner", "name", e.target.value)}
                placeholder="Principal Designer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pd-company">Company</Label>
              <Input
                id="pd-company"
                value={cdmInfo.principalDesigner.company}
                onChange={(e) => updateField("principalDesigner", "company", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pd-reg">Registration Number</Label>
              <Input
                id="pd-reg"
                value={cdmInfo.principalDesigner.registrationNumber || ""}
                onChange={(e) => updateField("principalDesigner", "registrationNumber", e.target.value)}
                placeholder="Professional registration (optional)"
              />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Address</h4>
            <AddressFields
              prefix="pd"
              value={cdmInfo.principalDesigner.address}
              onChange={(field, value) => updateNestedField("principalDesigner", "address", field, value)}
            />
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact Details</h4>
            <ContactFields
              prefix="pd"
              value={cdmInfo.principalDesigner.contact}
              onChange={(field, value) => updateNestedField("principalDesigner", "contact", field, value)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Principal Contractor */}
      <CollapsibleSection
        title="Principal Contractor"
        description="Contractor with control over the construction phase"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pc-name">Name</Label>
              <Input
                id="pc-name"
                value={cdmInfo.principalContractor.name}
                onChange={(e) => updateField("principalContractor", "name", e.target.value)}
                placeholder="Principal Contractor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pc-company">Company</Label>
              <Input
                id="pc-company"
                value={cdmInfo.principalContractor.company}
                onChange={(e) => updateField("principalContractor", "company", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pc-reg">Registration Number</Label>
              <Input
                id="pc-reg"
                value={cdmInfo.principalContractor.registrationNumber || ""}
                onChange={(e) => updateField("principalContractor", "registrationNumber", e.target.value)}
                placeholder="Professional registration (optional)"
              />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Address</h4>
            <AddressFields
              prefix="pc"
              value={cdmInfo.principalContractor.address}
              onChange={(field, value) => updateNestedField("principalContractor", "address", field, value)}
            />
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact Details</h4>
            <ContactFields
              prefix="pc"
              value={cdmInfo.principalContractor.contact}
              onChange={(field, value) => updateNestedField("principalContractor", "contact", field, value)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Contractors */}
      <CollapsibleSection
        title="Contractors"
        description="Other contractors working on the project"
      >
        <div className="space-y-4">
          {cdmInfo.contractors.map((contractor, index) => (
            <div key={contractor.id} className="p-4 rounded-xl bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contractor {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContractor(contractor.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={contractor.companyName}
                    onChange={(e) => updateContractor(contractor.id, "companyName", e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trade</Label>
                  <Input
                    value={contractor.tradeName}
                    onChange={(e) => updateContractor(contractor.id, "tradeName", e.target.value)}
                    placeholder="Trade/discipline"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addContractor} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Contractor
          </Button>
        </div>
      </CollapsibleSection>

      {/* Project Details */}
      <CollapsibleSection
        title="Project Details"
        description="Information about the construction project"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input
                id="project-title"
                value={cdmInfo.project.title}
                onChange={(e) => updateField("project", "title", e.target.value)}
                placeholder="Project title"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <textarea
                id="project-desc"
                value={cdmInfo.project.description}
                onChange={(e) => updateField("project", "description", e.target.value)}
                placeholder="Brief description of the project"
                className="flex min-h-[100px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-ref">Project Reference</Label>
              <Input
                id="project-ref"
                value={cdmInfo.project.reference}
                onChange={(e) => updateField("project", "reference", e.target.value)}
                placeholder="Reference number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-duration">Duration (weeks)</Label>
              <Input
                id="project-duration"
                type="number"
                value={cdmInfo.project.durationWeeks || ""}
                onChange={(e) => updateField("project", "durationWeeks", e.target.value)}
                placeholder="Expected duration"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-start">Start Date</Label>
              <Input
                id="project-start"
                type="date"
                value={cdmInfo.project.startDate}
                onChange={(e) => updateField("project", "startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-end">End Date</Label>
              <Input
                id="project-end"
                type="date"
                value={cdmInfo.project.endDate || ""}
                onChange={(e) => updateField("project", "endDate", e.target.value)}
              />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Site Address</h4>
            <AddressFields
              prefix="site"
              value={cdmInfo.project.siteAddress}
              onChange={(field, value) => updateNestedField("project", "siteAddress", field, value)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* F10 Notification */}
      <CollapsibleSection
        title="F10 Notification"
        description="HSE notification details for notifiable projects"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifiable"
              checked={cdmInfo.notification.isNotifiable}
              onChange={(e) => updateField("notification", "isNotifiable", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            <Label htmlFor="notifiable">This is a notifiable project</Label>
          </div>
          {cdmInfo.notification.isNotifiable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="f10-ref">F10 Reference</Label>
                <Input
                  id="f10-ref"
                  value={cdmInfo.notification.f10Reference || ""}
                  onChange={(e) => updateField("notification", "f10Reference", e.target.value)}
                  placeholder="F10 reference number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f10-date">Submission Date</Label>
                <Input
                  id="f10-date"
                  type="date"
                  value={cdmInfo.notification.f10SubmissionDate || ""}
                  onChange={(e) => updateField("notification", "f10SubmissionDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-num">Notification Number</Label>
                <Input
                  id="notification-num"
                  value={cdmInfo.notification.notificationNumber || ""}
                  onChange={(e) => updateField("notification", "notificationNumber", e.target.value)}
                  placeholder="HSE notification number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hse-office">HSE Office</Label>
                <Input
                  id="hse-office"
                  value={cdmInfo.notification.hseOffice || ""}
                  onChange={(e) => updateField("notification", "hseOffice", e.target.value)}
                  placeholder="Local HSE office"
                />
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Pre-construction Information */}
      <CollapsibleSection
        title="Pre-construction Information"
        description="Information gathered during the pre-construction phase"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="drawings"
                checked={cdmInfo.preconstructionInfo.existingDrawings}
                onChange={(e) => updateField("preconstructionInfo", "existingDrawings", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="drawings">Existing drawings available</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="asbestos-reg"
                checked={cdmInfo.preconstructionInfo.asbestosRegister}
                onChange={(e) => updateField("preconstructionInfo", "asbestosRegister", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="asbestos-reg">Asbestos register available</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ground"
                checked={cdmInfo.preconstructionInfo.groundConditions}
                onChange={(e) => updateField("preconstructionInfo", "groundConditions", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="ground">Ground conditions known</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="utilities"
                checked={cdmInfo.preconstructionInfo.utilities}
                onChange={(e) => updateField("preconstructionInfo", "utilities", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="utilities">Utilities information available</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="building-services"
                checked={cdmInfo.preconstructionInfo.buildingServices}
                onChange={(e) => updateField("preconstructionInfo", "buildingServices", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <Label htmlFor="building-services">Building services information available</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous-use">Previous Use</Label>
            <Input
              id="previous-use"
              value={cdmInfo.preconstructionInfo.previousUse || ""}
              onChange={(e) => updateField("preconstructionInfo", "previousUse", e.target.value)}
              placeholder="Previous use of the building/site"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="known-hazards">Known Hazards</Label>
            <textarea
              id="known-hazards"
              value={cdmInfo.preconstructionInfo.knownHazards || ""}
              onChange={(e) => updateField("preconstructionInfo", "knownHazards", e.target.value)}
              placeholder="Any known hazards from pre-construction information"
              className="flex min-h-[80px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* H&S File */}
      <CollapsibleSection
        title="Health & Safety File"
        description="Information about the H&S file for the project"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hs-location">File Location</Label>
            <Input
              id="hs-location"
              value={cdmInfo.hsFile.location}
              onChange={(e) => updateField("hsFile", "location", e.target.value)}
              placeholder="Where the H&S file will be held"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hs-custodian">Custodian</Label>
            <Input
              id="hs-custodian"
              value={cdmInfo.hsFile.custodian}
              onChange={(e) => updateField("hsFile", "custodian", e.target.value)}
              placeholder="Person responsible for the file"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hs-format">Format</Label>
            <select
              id="hs-format"
              value={cdmInfo.hsFile.format}
              onChange={(e) => updateField("hsFile", "format", e.target.value as "digital" | "physical" | "both")}
              className="flex h-10 w-full rounded-xl border bg-transparent px-4 py-2 text-sm transition-colors border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="digital" className="bg-card">Digital</option>
              <option value="physical" className="bg-card">Physical</option>
              <option value="both" className="bg-card">Both</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
