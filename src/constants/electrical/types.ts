/**
 * Type definitions for the electrical trade knowledge base
 * Pre-processed from HSE documents for deployment
 */

export interface ElectricalHazard {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "shock" | "burn" | "fire" | "arc" | "explosion" | "secondary";
  severity: "low" | "medium" | "high" | "critical";
  regulatoryReference?: string;
  hseGuidance?: string;
  riskFactors: string[];
  atRiskPersons: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface ElectricalControl {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "elimination" | "substitution" | "engineering" | "administrative" | "ppe";
  applicableHazardCodes: string[];
  effectiveness: "high" | "medium" | "low";
  regulatoryReference?: string;
  implementationNotes?: string;
  verificationRequired?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MethodStatementStep {
  stepNumber: number;
  activity: string;
  keyPoints: string[];
  hazardsAddressed: string[];
  controlsApplied: string[];
}

export interface ElectricalMethodTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  applicableWorkTypes: string[];
  preWorkChecks: string[];
  steps: MethodStatementStep[];
  postWorkChecks: string[];
  competencyRequired: string[];
  equipmentRequired: string[];
  ppeRequired: string[];
  emergencyProcedures: string[];
  regulatoryReferences: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface RegulatoryReference {
  id: string;
  code: string;
  regulation: string;
  section: string;
  title: string;
  summary: string;
  fullText?: string;
  applicableActivities: string[];
  keyRequirements: string[];
  hseGuidanceRef?: string;
}

export interface CompetencyRequirement {
  id: string;
  code: string;
  name: string;
  description: string;
  level: "awareness" | "supervised" | "competent" | "authorised";
  qualifications?: string[];
  experience?: string;
  assessmentCriteria: string[];
  applicableWorkTypes: string[];
  regulatoryBasis: string;
}
