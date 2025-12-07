export type LikelihoodScore = 1 | 2 | 3 | 4 | 5;
export type SeverityScore = 1 | 2 | 3 | 4 | 5;
export type RiskLevel = "low" | "medium" | "high" | "very_high";

export interface Hazard {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "physical" | "chemical" | "biological" | "ergonomic" | "psychosocial" | "environmental";
  applicableWidgetTypes: string[]; // Widget type codes
  severityGuidance?: string;
  isActive: boolean;
  sortOrder: number;
}

export type MitigationCategory =
  | "elimination"
  | "substitution"
  | "engineering"
  | "administrative"
  | "ppe";

export interface Mitigation {
  id: string;
  code: string;
  name: string;
  description: string;
  category: MitigationCategory;
  applicableHazardIds: string[];
  effectivenessRating: "high" | "medium" | "low";
  isActive: boolean;
  sortOrder: number;
}

export interface RiskAssessment {
  id: string;
  ramsId: string;
  widgetId: string;

  // Hazard details
  hazardId?: string;
  hazard?: Hazard;
  customHazardName?: string;
  hazardDescription: string;

  // Initial risk (before controls)
  initialLikelihood: LikelihoodScore;
  initialSeverity: SeverityScore;
  initialRiskScore: number; // Calculated: likelihood * severity

  // Mitigations
  mitigations: RiskMitigation[];

  // Residual risk (after controls)
  residualLikelihood: LikelihoodScore;
  residualSeverity: SeverityScore;
  residualRiskScore: number; // Calculated: likelihood * severity

  // Additional info
  responsiblePerson?: string;
  reviewDate?: string;
  notes?: string;
  aiGenerated: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface RiskMitigation {
  mitigationId?: string;
  mitigation?: Mitigation;
  customMitigationText?: string;
  implementationStatus: "planned" | "in_progress" | "complete";
}

// Risk matrix helpers
export const LIKELIHOOD_LABELS: Record<LikelihoodScore, string> = {
  1: "Rare",
  2: "Unlikely",
  3: "Possible",
  4: "Likely",
  5: "Almost Certain",
};

export const SEVERITY_LABELS: Record<SeverityScore, string> = {
  1: "Negligible",
  2: "Minor",
  3: "Moderate",
  4: "Major",
  5: "Catastrophic",
};

export function calculateRiskScore(
  likelihood: LikelihoodScore,
  severity: SeverityScore
): number {
  return likelihood * severity;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "very_high";
}

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  low: "#22c55e", // Green
  medium: "#eab308", // Yellow
  high: "#f97316", // Orange
  very_high: "#ef4444", // Red
};

export const RISK_MATRIX_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#22c55e",
  3: "#84cc16",
  4: "#84cc16",
  5: "#eab308",
  6: "#84cc16",
  8: "#eab308",
  9: "#eab308",
  10: "#f97316",
  12: "#f97316",
  15: "#f97316",
  16: "#ef4444",
  20: "#ef4444",
  25: "#ef4444",
};
