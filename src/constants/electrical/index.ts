/**
 * Electrical Trade Knowledge Base
 * Pre-processed from HSE documentation for deployment
 *
 * Sources:
 * - HSR25: Electricity at Work Regulations 1989 - Guidance
 * - INDG354: Safety in Electrical Testing
 * - GS38: Electrical Test Equipment for Use on Low Voltage Electrical Systems
 * - GS6: Avoiding Danger from Overhead Power Lines
 * - HSG47: Avoiding Danger from Underground Services
 * - BS 7671: Requirements for Electrical Installations (18th Edition)
 */

// Types
export type {
  ElectricalHazard,
  ElectricalControl,
  ElectricalMethodTemplate,
  MethodStatementStep,
  RegulatoryReference,
  CompetencyRequirement,
} from "./types";

export type { WorkActivity, WorkActivityCategory } from "./activities";

// Hazards
export {
  ELECTRICAL_HAZARDS,
  getHazardByCode,
  getHazardsByCategory,
  getActiveHazards,
} from "./hazards";

// Control Measures
export {
  ELECTRICAL_CONTROLS,
  getControlByCode,
  getControlsByCategory,
  getControlsForHazard,
  getActiveControls,
} from "./controls";

// Method Statement Templates
export {
  ELECTRICAL_METHOD_TEMPLATES,
  getMethodByCode,
  getMethodsForWorkType,
  getActiveMethods,
} from "./methods";

// Regulations and Competency
export {
  ELECTRICAL_REGULATIONS,
  COMPETENCY_REQUIREMENTS,
  getRegulationByCode,
  getRegulationsForActivity,
  getCompetencyByCode,
  getCompetenciesForWorkType,
} from "./regulations";

// Work Activities
export {
  ELECTRICAL_ACTIVITIES,
  ACTIVITY_CATEGORIES,
  getActivityByCode,
  getActivitiesByCategory,
  getActiveActivities,
  getAllCategories,
  getHazardsForActivities,
  getControlsForActivities,
  getPPEForActivities,
  getPermitsForActivities,
} from "./activities";

/**
 * Knowledge Base Statistics
 */
export const KNOWLEDGE_BASE_STATS = {
  hazards: 14,
  controls: 27,
  activities: 72, // Updated with BMS/specialist activities
  activityCategories: 14,
  methodTemplates: 5,
  regulations: 10,
  competencyLevels: 7,
  sources: [
    "HSE HSR25 - Electricity at Work Regulations 1989 Guidance",
    "HSE INDG354 - Safety in Electrical Testing",
    "HSE GS38 - Electrical Test Equipment",
    "HSE GS6 - Avoiding Danger from Overhead Power Lines",
    "BS 7671:2018 - 18th Edition Wiring Regulations",
  ],
  lastUpdated: "2024-12-03",
  version: "1.2.0",
};
