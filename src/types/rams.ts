import type { CDMInfo } from "./cdm";
import type { CanvasState, Widget } from "./widget";
import type { RiskAssessment } from "./risk";

export type RAMSStatus = "draft" | "complete" | "archived";

// Contractor type affects which questions are shown and how the RAMS is generated
export type ContractorType = "main_contractor" | "subcontractor";

export interface ContractorTypeInfo {
  type: ContractorType;
  // For subcontractors, welfare is provided by MC
  welfareProvidedByMC: boolean;
  // Main contractor company name (relevant for subcontractors)
  mainContractorName?: string;
  mainContractorContact?: string;
}

export interface RAMS {
  id: string;
  userId: string;
  title: string;
  status: RAMSStatus;
  version: number;
  currentRevisionId?: string;

  // Contractor Type - determines if MC or subcontractor is building this RAMS
  contractorType: ContractorTypeInfo;

  // CDM Information
  cdmInfo: CDMInfo;

  // Project Details
  projectReference: string;
  siteAddress: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };

  // Uploaded project scope (extracted text from PDF/Word)
  projectScope?: string;
  projectScopeFileName?: string;

  // Canvas state
  canvasData: CanvasState;

  // Related data (loaded separately)
  widgets?: Widget[];
  riskAssessments?: RiskAssessment[];
  contextualAnswers?: ContextualAnswer[];

  // Template
  isTemplate: boolean;
  templateName?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface RAMSRevision {
  id: string;
  ramsId: string;
  version: number;
  revisionNotes?: string;

  // Full snapshot
  cdmInfo: CDMInfo;
  canvasData: CanvasState;
  widgets: Widget[];
  contextualAnswers: ContextualAnswer[];
  riskAssessments: RiskAssessment[];
  generatedContent?: GeneratedContent;

  createdBy: string;
  createdAt: string;
}

export interface ContextualQuestion {
  id: string;
  code: string;
  questionText: string;
  questionType: "boolean" | "select" | "multiselect" | "text" | "number";
  options?: { value: string; label: string }[];
  category: "site_conditions" | "work_environment" | "interfaces" | "emergency" | "environmental" | "general";
  isRequired: boolean;
  triggersWidgets: string[]; // Widget codes to suggest when answered
  sortOrder: number;
  isActive: boolean;
  // Contractor type visibility - if not specified, shows for both
  visibleFor?: ContractorType[];
  // Alternative question text for subcontractors
  subcontractorText?: string;
  // Conditional display - only show if another question has a specific answer
  dependsOn?: { questionId: string; value: boolean | string | string[] };
  // Placeholder text for text inputs
  placeholder?: string;
}

export interface ContextualAnswer {
  id: string;
  ramsId: string;
  questionId: string;
  question?: ContextualQuestion;
  answer: boolean | string | string[] | number;
  createdAt: string;
}

export interface GeneratedContent {
  id: string;
  ramsId: string;
  revisionId?: string;

  // AI-generated content
  scopeOfWorks: string;
  methodStatement: MethodStatementStep[];
  sequenceOfOperations: string[];
  plantAndEquipment: string[];
  ppeRequirements: PPERequirement[];
  emergencyProcedures: EmergencyProcedures;
  environmentalConsiderations: string[];
  welfareFacilities: string[];
  trainingRequirements: string[];
  monitoringAndReview: string;

  // Export tracking
  exportFormat?: "docx" | "pdf";
  exportUrl?: string;
  exportExpiresAt?: string;

  // Generation metadata
  generationModel: string;
  generationTokens: number;

  createdAt: string;
}

export interface MethodStatementStep {
  stepNumber: number;
  activity: string;
  description: string;
  hazards: string[];
  controls: string[];
  responsible: string;
}

export interface PPERequirement {
  item: string;
  standard?: string;
  mandatory: boolean;
  notes?: string;
}

export interface EmergencyProcedures {
  fireEvacuation: string;
  firstAid: string;
  spillResponse?: string;
  rescueProcedures?: string;
  emergencyContacts: { role: string; name: string; phone: string }[];
}

// Helper function to create empty RAMS
export function createEmptyRAMS(
  userId: string,
  contractorType: ContractorType = "main_contractor"
): Omit<RAMS, "id" | "createdAt" | "updatedAt"> {
  return {
    userId,
    title: "Untitled RAMS",
    status: "draft",
    version: 1,
    contractorType: {
      type: contractorType,
      welfareProvidedByMC: contractorType === "subcontractor",
    },
    cdmInfo: {
      client: {
        name: "",
        company: "",
        address: { line1: "", city: "", postcode: "" },
        contact: { name: "", email: "", phone: "" },
      },
      principalDesigner: {
        name: "",
        company: "",
        address: { line1: "", city: "", postcode: "" },
        contact: { name: "", email: "", phone: "" },
      },
      principalContractor: {
        name: "",
        company: "",
        address: { line1: "", city: "", postcode: "" },
        contact: { name: "", email: "", phone: "" },
      },
      contractors: [],
      project: {
        title: "",
        description: "",
        reference: "",
        siteAddress: { line1: "", city: "", postcode: "" },
        startDate: "",
      },
      notification: { isNotifiable: false },
      preconstructionInfo: {
        existingDrawings: false,
        asbestosRegister: false,
        groundConditions: false,
        utilities: false,
        buildingServices: false,
      },
      hsFile: { location: "", custodian: "", format: "digital" },
    },
    projectReference: "",
    siteAddress: { line1: "", city: "", postcode: "" },
    canvasData: { zoom: 1, position: { x: 0, y: 0 }, selectedWidgetIds: [] },
    isTemplate: false,
  };
}
