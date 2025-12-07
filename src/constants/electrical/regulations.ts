/**
 * Electrical Regulatory References and Competency Requirements
 * Key legislation and guidance for UK electrical work
 * Extracted from HSE HSR25 and related documents
 */

import type { RegulatoryReference, CompetencyRequirement } from "./types";

// ============================================
// REGULATORY REFERENCES
// ============================================
export const ELECTRICAL_REGULATIONS: RegulatoryReference[] = [
  // Electricity at Work Regulations 1989 - Key Regulations
  {
    id: "reg-ewr-4",
    code: "ewr_reg_4",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 4",
    title: "Systems, work activities and protective equipment",
    summary: "All systems shall be constructed, maintained, and worked to prevent danger. Work activities must not give rise to danger. Protective equipment must be suitable and maintained.",
    keyRequirements: [
      "Systems must be constructed to prevent danger",
      "Systems must be maintained to prevent danger",
      "Work activities must be carried out safely",
      "Protective equipment must be suitable for use",
      "Protective equipment must be properly maintained",
    ],
    applicableActivities: ["installation", "maintenance", "testing", "all_electrical_work"],
    hseGuidanceRef: "HSR25 Para 34-47",
  },
  {
    id: "reg-ewr-5",
    code: "ewr_reg_5",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 5",
    title: "Strength and capability of electrical equipment",
    summary: "Equipment must be of adequate strength and capability for the known or foreseeable conditions of use.",
    keyRequirements: [
      "Equipment rated for maximum voltage",
      "Equipment rated for maximum current",
      "Fault current capability adequate",
      "Environmental conditions considered",
    ],
    applicableActivities: ["installation", "equipment_selection"],
    hseGuidanceRef: "HSR25 Para 42-47",
  },
  {
    id: "reg-ewr-6",
    code: "ewr_reg_6",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 6",
    title: "Adverse or hazardous environments",
    summary: "Equipment must be suitable for the environment or protected from adverse conditions.",
    keyRequirements: [
      "Wet locations require appropriate IP rating",
      "Corrosive atmospheres need suitable materials",
      "Mechanical damage protection required",
      "Temperature extremes considered",
      "Flammable atmospheres require Ex rated equipment",
    ],
    applicableActivities: ["installation", "equipment_selection", "maintenance"],
    hseGuidanceRef: "HSR25 Para 48-54",
  },
  {
    id: "reg-ewr-12",
    code: "ewr_reg_12",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 12",
    title: "Means for cutting off the supply and for isolation",
    summary: "Suitable means must exist for cutting off supply and isolating equipment where necessary to prevent danger.",
    keyRequirements: [
      "Isolators clearly identified",
      "Isolators readily accessible",
      "Capable of being secured against re-energisation",
      "Adequate for the duty (switching capacity)",
    ],
    applicableActivities: ["installation", "isolation", "maintenance"],
    hseGuidanceRef: "HSR25 Para 95-106",
  },
  {
    id: "reg-ewr-13",
    code: "ewr_reg_13",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 13",
    title: "Precautions for work on equipment made dead",
    summary: "Adequate precautions must be taken to prevent equipment becoming live during work.",
    keyRequirements: [
      "Equipment isolated from all sources",
      "Isolation secured (locked off)",
      "Equipment proved dead before work",
      "Work earthing applied where appropriate",
      "Precautions remain in place during work",
    ],
    applicableActivities: ["isolation", "maintenance", "testing"],
    hseGuidanceRef: "HSR25 Para 107-111",
  },
  {
    id: "reg-ewr-14",
    code: "ewr_reg_14",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 14",
    title: "Work on or near live conductors",
    summary: "Live work prohibited unless unreasonable to work dead AND suitable precautions taken.",
    keyRequirements: [
      "Live work only if unreasonable to work dead",
      "Suitable precautions taken",
      "Competent persons only",
      "Adequate information, instruction, training",
      "Technical and managerial controls in place",
    ],
    applicableActivities: ["live_working", "testing", "fault_finding"],
    hseGuidanceRef: "HSR25 Para 112-128",
  },
  {
    id: "reg-ewr-16",
    code: "ewr_reg_16",
    regulation: "Electricity at Work Regulations 1989",
    section: "Regulation 16",
    title: "Persons to be competent to prevent danger and injury",
    summary: "No person shall engage in electrical work unless they have the technical knowledge and experience to prevent danger, or are under appropriate supervision.",
    keyRequirements: [
      "Technical knowledge appropriate to work",
      "Experience appropriate to work",
      "Understanding of risks and precautions",
      "Appropriate supervision for less experienced",
      "Competence verified before work",
    ],
    applicableActivities: ["all_electrical_work"],
    hseGuidanceRef: "HSR25 Para 129-139",
  },

  // Other Key Regulations
  {
    id: "reg-bs7671",
    code: "bs7671",
    regulation: "BS 7671 (18th Edition)",
    section: "Wiring Regulations",
    title: "Requirements for Electrical Installations",
    summary: "The UK national standard for electrical installations, meeting the requirements of the Electricity at Work Regulations.",
    keyRequirements: [
      "Design and erection requirements",
      "Selection of equipment",
      "Inspection and testing",
      "Special installations (locations)",
      "Certification requirements",
    ],
    applicableActivities: ["installation", "testing", "certification"],
    hseGuidanceRef: "IET Guidance Notes series",
  },
  {
    id: "reg-cdm",
    code: "cdm_2015",
    regulation: "Construction (Design and Management) Regulations 2015",
    section: "Various",
    title: "CDM Requirements for Construction",
    summary: "Health and safety requirements for construction projects including electrical work.",
    keyRequirements: [
      "Pre-construction information",
      "Construction phase plan",
      "Health and safety file",
      "Competent duty holders",
      "Welfare facilities",
    ],
    applicableActivities: ["construction", "installation"],
    hseGuidanceRef: "L153 Managing health and safety in construction",
  },
  {
    id: "reg-puwer",
    code: "puwer_1998",
    regulation: "Provision and Use of Work Equipment Regulations 1998",
    section: "Various",
    title: "Work Equipment Requirements",
    summary: "Requirements for provision, suitability, maintenance, and inspection of work equipment including electrical tools and test equipment.",
    keyRequirements: [
      "Equipment suitable for intended use",
      "Equipment maintained in safe condition",
      "Users provided with adequate information and training",
      "Specific requirements for power presses, woodworking, etc.",
    ],
    applicableActivities: ["tool_use", "equipment_maintenance"],
    hseGuidanceRef: "L22 Safe use of work equipment",
  },
];

// ============================================
// COMPETENCY REQUIREMENTS
// ============================================
export const COMPETENCY_REQUIREMENTS: CompetencyRequirement[] = [
  {
    id: "comp-electrician",
    code: "qualified_electrician",
    name: "Qualified Electrician",
    description: "Person with formal electrical qualifications capable of working without direct supervision on most electrical work",
    level: "competent",
    qualifications: [
      "NVQ Level 3 in Electrical Installation",
      "City & Guilds 2330/2365 or equivalent",
      "Current BS 7671 certification (18th Edition)",
      "ECS/JIB Gold Card or equivalent",
    ],
    experience: "Minimum 3 years post-qualification experience",
    assessmentCriteria: [
      "Can interpret technical drawings and specifications",
      "Understands and applies BS 7671 requirements",
      "Can carry out safe isolation procedure",
      "Competent in electrical testing and certification",
      "Understands relevant health and safety legislation",
    ],
    applicableWorkTypes: [
      "installation",
      "maintenance",
      "testing",
      "repair",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16",
  },
  {
    id: "comp-approved-electrician",
    code: "approved_electrician",
    name: "Approved Electrician",
    description: "Electrician working under an Approved Contractor scheme such as NICEIC, NAPIT, or ELECSA",
    level: "competent",
    qualifications: [
      "All requirements of Qualified Electrician",
      "Working for scheme-registered company",
      "Part P certification for domestic work",
      "Regular assessment by scheme",
    ],
    experience: "Typically 5+ years as qualified electrician",
    assessmentCriteria: [
      "All criteria for Qualified Electrician",
      "Can certify own work under scheme",
      "Understands building regulations notification requirements",
      "Maintains CPD and technical knowledge",
    ],
    applicableWorkTypes: [
      "installation",
      "certification",
      "design",
    ],
    regulatoryBasis: "Building Regulations Part P, EWR 1989 Regulation 16",
  },
  {
    id: "comp-apprentice",
    code: "electrical_apprentice",
    name: "Electrical Apprentice",
    description: "Person undergoing formal electrical training who must work under direct supervision",
    level: "supervised",
    qualifications: [
      "Enrolled on approved electrical apprenticeship",
      "Working towards NVQ Level 3",
      "ECS Apprentice card",
    ],
    experience: "In training - level depends on stage of apprenticeship",
    assessmentCriteria: [
      "Can carry out work under direct supervision",
      "Understands basic electrical safety",
      "Learning safe isolation procedures",
      "Must not work unsupervised on electrical systems",
    ],
    applicableWorkTypes: [
      "installation_supervised",
      "cable_pulling",
      "containment_installation",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16",
  },
  {
    id: "comp-electrical-tester",
    code: "electrical_tester",
    name: "Electrical Tester",
    description: "Person competent to carry out electrical testing and produce test results",
    level: "competent",
    qualifications: [
      "City & Guilds 2391 or 2394/2395 or equivalent",
      "Current BS 7671 certification",
      "Understanding of test equipment (GS38)",
    ],
    experience: "Practical testing experience under supervision before independent testing",
    assessmentCriteria: [
      "Understands all initial verification tests",
      "Can interpret test results correctly",
      "Knows when to issue different certificate types",
      "Competent in use of test equipment",
      "Understands safety precautions during testing",
    ],
    applicableWorkTypes: [
      "testing",
      "inspection",
      "fault_finding",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16, BS 7671 Part 6",
  },
  {
    id: "comp-hv-authorised",
    code: "hv_authorised_person",
    name: "HV Authorised Person",
    description: "Person authorised to work on or operate high voltage electrical systems",
    level: "authorised",
    qualifications: [
      "Qualified electrician background",
      "High voltage training and assessment",
      "Company authorisation in writing",
      "Knowledge of network operator requirements",
    ],
    experience: "Substantial LV experience before HV authorisation, typically 5+ years",
    assessmentCriteria: [
      "Demonstrates comprehensive HV knowledge",
      "Understands HV switching procedures",
      "Can assess risks specific to HV work",
      "Knows emergency procedures for HV incidents",
      "Maintains ongoing competence through practice and refresher training",
    ],
    applicableWorkTypes: [
      "hv_switching",
      "hv_maintenance",
      "hv_testing",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16, EAWR 1989",
  },
  {
    id: "comp-site-electrical",
    code: "construction_electrician",
    name: "Construction Site Electrician",
    description: "Electrician working on construction sites with site-specific competencies",
    level: "competent",
    qualifications: [
      "All requirements of Qualified Electrician",
      "CSCS card (Gold - Electrician)",
      "Site safety awareness (SSSTS or SMSTS for supervisors)",
    ],
    experience: "Site experience in addition to core electrical competence",
    assessmentCriteria: [
      "All criteria for Qualified Electrician",
      "Understands site-specific risks",
      "Can work with temporary supplies and reduced voltage systems",
      "Understands construction phase H&S requirements",
      "Can coordinate with other trades",
    ],
    applicableWorkTypes: [
      "construction_installation",
      "temporary_supplies",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16, CDM Regulations 2015",
  },
  {
    id: "comp-awareness",
    code: "electrical_awareness",
    name: "Electrical Safety Awareness",
    description: "Non-electrical workers who may encounter electrical hazards in their work",
    level: "awareness",
    qualifications: [
      "Electrical safety awareness training",
      "Site induction covering electrical risks",
    ],
    experience: "N/A - awareness level only",
    assessmentCriteria: [
      "Recognises electrical hazards",
      "Knows not to interfere with electrical equipment",
      "Understands how to report electrical defects",
      "Knows emergency procedures for electrical incidents",
      "Aware of safe distances from live equipment",
    ],
    applicableWorkTypes: [
      "non_electrical_work_near_electrical_systems",
    ],
    regulatoryBasis: "EWR 1989 Regulation 16, HSWA 1974",
  },
];

// Helper functions
export function getRegulationByCode(code: string): RegulatoryReference | undefined {
  return ELECTRICAL_REGULATIONS.find((r) => r.code === code);
}

export function getRegulationsForActivity(activity: string): RegulatoryReference[] {
  return ELECTRICAL_REGULATIONS.filter((r) =>
    r.applicableActivities.includes(activity) ||
    r.applicableActivities.includes("all_electrical_work")
  );
}

export function getCompetencyByCode(code: string): CompetencyRequirement | undefined {
  return COMPETENCY_REQUIREMENTS.find((c) => c.code === code);
}

export function getCompetenciesForWorkType(workType: string): CompetencyRequirement[] {
  return COMPETENCY_REQUIREMENTS.filter((c) =>
    c.applicableWorkTypes.includes(workType)
  );
}
