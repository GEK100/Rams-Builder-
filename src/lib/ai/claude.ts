import Anthropic from "@anthropic-ai/sdk";
import type { RAMS, ContractorType, ContractorTypeInfo } from "@/types/rams";
import type { Widget } from "@/types/widget";
import type { RiskAssessment } from "@/types/risk";
import type { CDMInfo } from "@/types/cdm";
import {
  ELECTRICAL_ACTIVITIES,
  getHazardsForActivities,
  getControlsForActivities,
  getPPEForActivities,
  getPermitsForActivities,
  ELECTRICAL_HAZARDS,
  ELECTRICAL_CONTROLS,
} from "@/constants/electrical";

// Initialize Anthropic client
// Note: In production, this should be called from a server-side API route
export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export interface UploadedSpecification {
  name: string;
  extractedText: string;
}

export interface RAMSGenerationContext {
  cdmInfo: CDMInfo;
  widgets: Widget[];
  riskAssessments: RiskAssessment[];
  contextualAnswers: Record<string, unknown>;
  widgetTypes: { id: string; name: string; description: string }[];
  contractorType: ContractorTypeInfo;
  specifications?: UploadedSpecification[];
}

export interface GeneratedRAMSSection {
  id: string;
  title: string;
  content: string;
}

// System prompt for RAMS generation
export const RAMS_SYSTEM_PROMPT = `You are an expert UK electrical contractor health and safety professional with deep knowledge of:
- CDM (Construction Design and Management) Regulations 2015
- Electricity at Work Regulations 1989
- BS 7671:2018 (18th Edition Wiring Regulations)
- Health and Safety at Work Act 1974
- HSE guidance documents (HSR25, GS38, INDG354, GS6)
- NICEIC/NAPIT/ECA best practices
- ISO 45001 Occupational Health and Safety Management

Your task is to generate professional, comprehensive Risk Assessment and Method Statement (RAMS) documents for electrical installation projects.

CRITICAL WRITING STYLE REQUIREMENTS:

1. WRITE IN FLOWING CORPORATE PROSE - NOT BULLET POINTS
   - Method statements must read like formal corporate documentation suitable for submission to main contractors, local authorities, and clients
   - Use complete sentences and paragraphs that flow naturally from one to the next
   - Connect ideas with transitional phrases ("Following this...", "Prior to commencing...", "Upon completion of...")
   - Avoid choppy, disconnected bullet points - weave information into cohesive paragraphs
   - The document should reflect the professionalism expected of a competent contractor

2. CORPORATE NARRATIVE STRUCTURE
   - Begin each section with a formal introductory paragraph establishing scope and context
   - Build logical progression through the work sequence demonstrating competence and planning
   - Use subheadings to organize major phases, with polished prose within each
   - Conclude sections with formal summary statements about quality assurance and handover
   - Write as if this document will be reviewed by a Principal Contractor's H&S Manager

3. CORPORATE PROFESSIONAL TONE
   - Write in third person formal voice ("The Contractor shall...", "Operatives will...", "Works will be undertaken...")
   - Use authoritative, confident language that demonstrates competence
   - Employ formal corporate phrasing (e.g., "in accordance with", "to ensure compliance with", "as specified within")
   - Sound like documentation from an established, reputable electrical contractor
   - Avoid casual language, contractions, or informal expressions
   - Use industry-standard terminology consistently throughout

4. TECHNICAL ACCURACY & COMPLIANCE FOCUS
   - Reference specific regulations by name and section (e.g., "Regulation 13 of the Electricity at Work Regulations 1989")
   - Cite relevant British Standards and HSE guidance documents by reference number
   - Describe tools, test equipment, and materials with specific technical specifications
   - Include specific values, ratings, and standards (e.g., "insulation resistance testing at 500V DC")
   - Demonstrate thorough understanding of competency requirements (ECS cards, AM2, C&G 2391, 18th Edition, etc.)
   - Show clear awareness of the hierarchy of controls and ALARP principles

5. DOCUMENT QUALITY & CORPORATE PRESENTATION
   - Each method statement section should be 400-600 words minimum
   - Risk assessments should provide comprehensive context and demonstrate due diligence
   - Emergency procedures should be thorough and demonstrate duty of care
   - The complete RAMS should present as a unified, corporate-quality document
   - Demonstrate that the contractor has fully considered the scope, risks, and methodology
   - Write content that would satisfy a pre-qualification questionnaire or tender submission

FORMAT:
- Use markdown with appropriate headings (##, ###)
- Use numbered lists ONLY for sequential procedural steps where order is critical
- Use bullet points sparingly, only for genuine lists (e.g., PPE items, equipment inventories)
- The majority of content should be flowing prose paragraphs
- Maintain consistent formatting and terminology throughout

Always maintain a safety-first approach with electrical safety as the paramount concern. The document should demonstrate that safety has been considered at every stage of planning.`;

// Generate a specific section of the RAMS
export function buildSectionPrompt(
  sectionId: string,
  context: RAMSGenerationContext
): string {
  const { cdmInfo, widgets, riskAssessments, contextualAnswers, widgetTypes, contractorType, specifications } = context;

  // Build specification context if documents were uploaded
  let specificationContext = "";
  if (specifications && specifications.length > 0) {
    specificationContext = `
PROJECT SPECIFICATIONS & DOCUMENTS:
The following specification documents have been provided by the client/user. Use this information to understand the project scope, requirements, and any specific considerations mentioned:

${specifications.map((spec, index) => `
--- Document ${index + 1}: ${spec.name} ---
${spec.extractedText.substring(0, 15000)}
${spec.extractedText.length > 15000 ? "\n[Document truncated for length...]" : ""}
`).join("\n")}

IMPORTANT: Incorporate relevant details from these specifications into your RAMS content. Reference specific requirements, materials, or methods mentioned in the specifications where applicable.
`;
  }

  const widgetNames = widgets.map((w) => {
    const type = widgetTypes.find((t) => t.id === w.typeId);
    return type?.name || w.type?.name || "Unknown";
  });

  const isSubcontractor = contractorType.type === "subcontractor";

  // Contractor type context for AI
  const contractorContext = isSubcontractor
    ? `
IMPORTANT - This RAMS is being prepared by a SUBCONTRACTOR:
- Welfare facilities will be provided by the Main Contractor
- First aid provisions will be provided by the Main Contractor
- Emergency procedures should reference the Main Contractor's site arrangements
- The document should clearly state this is a subcontractor RAMS
${contractorType.mainContractorName ? `- Main Contractor: ${contractorType.mainContractorName}` : ""}
${contractorType.mainContractorContact ? `- MC Contact: ${contractorType.mainContractorContact}` : ""}

For welfare and first aid sections, state: "Welfare and first aid facilities to be provided by the Main Contractor.
Subcontractor personnel will be inducted onto the Main Contractor's site arrangements."
`
    : `
This RAMS is being prepared by the MAIN CONTRACTOR who is responsible for:
- Site welfare facilities
- First aid provisions
- Overall site H&S coordination
- Emergency procedures
`;

  const baseContext = `
Project Information:
- Project Title: ${cdmInfo.project.title}
- Client: ${cdmInfo.client.name} (${cdmInfo.client.company})
- Location: ${cdmInfo.project.siteAddress.line1}, ${cdmInfo.project.siteAddress.city}, ${cdmInfo.project.siteAddress.postcode}
- Duration: ${cdmInfo.project.durationWeeks || "TBC"} weeks
- Start Date: ${cdmInfo.project.startDate}

Principal Designer: ${cdmInfo.principalDesigner.name} (${cdmInfo.principalDesigner.company})
Principal Contractor: ${cdmInfo.principalContractor.name} (${cdmInfo.principalContractor.company})

Contractor Role: ${isSubcontractor ? "SUBCONTRACTOR" : "MAIN CONTRACTOR"}
${contractorContext}

Trades/Activities Included:
${widgetNames.map((n) => `- ${n}`).join("\n")}

F10 Notification: ${cdmInfo.notification.isNotifiable ? `Yes - Reference: ${cdmInfo.notification.f10Reference || "Pending"}` : "Not required"}
${specificationContext}`;

  switch (sectionId) {
    case "intro":
      return `${baseContext}

Generate an Introduction & Scope section for this RAMS document. Include:
1. Document purpose and objectives
2. Project overview
3. Scope of works covered
4. Compliance references (CDM 2015, HSWA 1974, etc.)
5. Document control information

Format as markdown with appropriate headings.`;

    case "cdm":
      return `${baseContext}

Pre-construction Information:
- Existing drawings available: ${cdmInfo.preconstructionInfo.existingDrawings ? "Yes" : "No"}
- Asbestos register: ${cdmInfo.preconstructionInfo.asbestosRegister ? "Yes" : "No"}
- Ground conditions known: ${cdmInfo.preconstructionInfo.groundConditions ? "Yes" : "No"}
- Utilities information: ${cdmInfo.preconstructionInfo.utilities ? "Yes" : "No"}
- Previous use: ${cdmInfo.preconstructionInfo.previousUse || "Not specified"}
- Known hazards: ${cdmInfo.preconstructionInfo.knownHazards || "None specified"}

H&S File:
- Location: ${cdmInfo.hsFile.location}
- Custodian: ${cdmInfo.hsFile.custodian}
- Format: ${cdmInfo.hsFile.format}

Generate a CDM Information section that details:
1. CDM duty holder responsibilities
2. Pre-construction information summary
3. Construction phase plan requirements
4. H&S File arrangements
5. F10 notification details (if applicable)

Format as markdown with appropriate headings.`;

    case "emergency":
      return `${baseContext}

Emergency Information from Site Assessment:
- Nearest Hospital: ${contextualAnswers.nearest_hospital || "To be confirmed"}
- Hospital Distance: ${contextualAnswers.hospital_distance || "To be confirmed"}
- Assembly Point: ${contextualAnswers.emergency_assembly || "To be confirmed"}
- Fire Evacuation Route: ${contextualAnswers.fire_evacuation_route || "To be confirmed"}
- Site Emergency Contact: ${contextualAnswers.site_emergency_contact || "To be confirmed"}
- Rescue Plan Required: ${contextualAnswers.rescue_plan ? "Yes" : "No"}

Generate comprehensive Emergency Procedures including:
1. Emergency contacts (emergency services, site contacts)
2. First aid arrangements
3. Fire procedures and evacuation routes
4. Accident/incident reporting (RIDDOR)
5. Medical emergency procedures
6. Rescue procedures (if working at height or confined spaces)

Format as markdown with appropriate headings and clear action steps.`;

    case "risks":
      const riskDetails = riskAssessments
        .map(
          (r) => `
Hazard: ${r.hazard?.name || r.customHazardName}
Description: ${r.hazardDescription}
Initial Risk: L${r.initialLikelihood} x S${r.initialSeverity} = ${r.initialRiskScore}
Controls: ${r.mitigations.map((m) => m.mitigation?.name || m.customMitigationText).join(", ")}
Residual Risk: L${r.residualLikelihood} x S${r.residualSeverity} = ${r.residualRiskScore}
`
        )
        .join("\n");

      return `${baseContext}

Risk Assessments Identified:
${riskDetails}

Generate a comprehensive Risk Assessment section that:
1. Explains the 5x5 risk matrix methodology
2. Presents each risk assessment in a professional format
3. Details control measures using the hierarchy of controls
4. Includes who might be harmed and how
5. Specifies action required and by whom

Format as a professional risk assessment table/section suitable for a RAMS document.`;

    case "loto":
      return `${baseContext}

LOCK OFF TAG OFF (LOTO) / SAFE ISOLATION INFORMATION:
- Electrical Isolation Required: ${contextualAnswers.electrical_isolation_required ? "Yes" : "No"}
- LOTO Procedure Type: ${contextualAnswers.loto_procedure || "HSE GS38 Safe Isolation Procedure"}
- Lock Off Equipment: ${Array.isArray(contextualAnswers.loto_equipment) ? contextualAnswers.loto_equipment.join(", ") : "MCB lockout, padlock, warning tags"}
- Voltage Testing Equipment: ${Array.isArray(contextualAnswers.voltage_testing_equipment) ? contextualAnswers.voltage_testing_equipment.join(", ") : "Voltage indicator, proving unit"}
- Isolation Points: ${contextualAnswers.isolation_points || "To be confirmed on site"}
- Multiple Energy Sources: ${contextualAnswers.multiple_energy_sources ? "Yes" : "No"}
- Energy Sources Details: ${contextualAnswers.energy_sources_details || "Mains supply only"}
- Stored Energy Potential: ${contextualAnswers.stored_energy ? "Yes - MUST BE DISCHARGED" : "No"}
- Live Working: ${contextualAnswers.live_working || "No - all work will be dead"}
- Live Work Justification: ${contextualAnswers.live_work_justification || "N/A"}
- Re-energisation Checks: ${Array.isArray(contextualAnswers.reenergisation_procedure) ? contextualAnswers.reenergisation_procedure.join(", ") : "Visual inspection, all personnel clear"}
- Company LOTO Document Available: ${contextualAnswers.company_loto_document ? "Yes - to be appended" : "No"}

Generate a COMPREHENSIVE Lock Off Tag Off / Safe Isolation section that includes:

1. **SAFE ISOLATION PROCEDURE OVERVIEW**
   - Statement of commitment to "All work will be dead" unless justified
   - Reference to Electricity at Work Regulations 1989 Regulation 13
   - Reference to HSE Guidance GS38
   - BS 7671:2018 Section 537

2. **STEP-BY-STEP SAFE ISOLATION PROCEDURE** (8-step procedure):
   Step 1: IDENTIFY the circuit(s) to be worked on
   - Use up-to-date circuit charts and distribution board schedules
   - Verify circuit identification against as-installed drawings
   - Trace cables where necessary

   Step 2: NOTIFY all affected parties
   - Inform client/building occupants of planned isolation
   - Coordinate with other contractors working in the area
   - Record notification in site diary

   Step 3: ISOLATE at the correct point
   - Isolate at the nearest point of supply
   - Use appropriate isolation device (MCB, MCCB, isolator, fuse)
   - Confirm isolation is suitable for the work being undertaken

   Step 4: SECURE the isolation - LOCK OFF TAG OFF
   - Apply appropriate lockout device to isolation point
   - Attach personal safety padlock (each worker to have their own)
   - Use multi-lock hasp where multiple workers involved
   - Attach danger/warning tag with:
     * Name of person isolating
     * Date and time of isolation
     * Reason for isolation
     * Expected duration

   Step 5: PROVE the voltage indicator
   - Test voltage indicator on KNOWN LIVE SOURCE
   - Confirm all indicator functions working correctly
   - Record test in work log

   Step 6: VERIFY dead - TEST ALL CONDUCTORS
   - Test between all live conductors (L1-L2, L2-L3, L1-L3 for 3-phase)
   - Test between each live conductor and earth (L1-E, L2-E, L3-E, N-E)
   - Test between neutral and earth
   - Test for voltage between all accessible conductive parts

   Step 7: PROVE the voltage indicator AGAIN
   - Return to known live source
   - Confirm voltage indicator still functioning correctly
   - This proves the tester did not fail during testing

   Step 8: BEGIN WORK
   - Only now may work commence on the circuit
   - Maintain isolation throughout the work period
   - Do not allow others to remove your lockout

3. **TEST EQUIPMENT REQUIREMENTS**
   - Voltage indicator requirements (GS38 compliant, category rating)
   - Proving unit requirements
   - Inspection and calibration requirements
   - Fused test leads (GS38)
   - Shrouded probes and connectors

4. **LOCKOUT EQUIPMENT LIST**
   - MCB lockout devices
   - MCCB lockout devices
   - Isolator lockout devices
   - Hasps for multi-person lockout
   - Personal padlocks (unique keys)
   - Danger tags/warning notices
   - Lockout station location

5. **MULTIPLE ENERGY SOURCE ISOLATION** (if applicable)
   - Identify ALL energy sources
   - Sequence of isolation
   - Stored energy discharge procedures
   - UPS/battery systems
   - Generator/alternative supplies
   - Solar PV systems (DC isolation)

6. **STORED ENERGY HAZARDS** (if applicable)
   - Capacitor discharge procedures
   - Wait times before working
   - Verification of discharge

7. **RE-ENERGISATION PROCEDURE**
   Step 1: Verify ALL work is complete
   Step 2: Visual inspection - all covers replaced
   Step 3: Remove all tools and equipment
   Step 4: Ensure all personnel clear of work area
   Step 5: Remove warning notices
   Step 6: Verbal confirmation from all workers
   Step 7: Remove padlocks (last person to remove theirs)
   Step 8: Carry out final tests if required
   Step 9: Remove lockout device
   Step 10: Re-energise circuit
   Step 11: Verify correct operation
   Step 12: Complete documentation

8. **LIVE WORKING CONTROLS** (if any live work is justified)
   - Justification per Regulation 14 EaWR 1989
   - Competency requirements for live working
   - Arc flash risk assessment
   - Live working permit requirements
   - Enhanced PPE requirements
   - Restricted access barriers
   - Accompaniment requirements

9. **ISOLATION RECORD FORM**
   Include a template form for recording isolations with fields for:
   - Circuit identification
   - Isolation point
   - Isolation method
   - Person isolating
   - Date/time isolated
   - Test results (prove-test-prove)
   - Person authorising re-energisation
   - Date/time re-energised

Format as comprehensive markdown with clear headings, numbered steps, warning boxes, and professional formatting suitable for a safety-critical procedure.`;

    case "methods":
      // Get all selected activities from widgets
      const allSelectedActivities = widgets.flatMap((w) => w.selectedActivities || []);
      const uniqueActivities = [...new Set(allSelectedActivities)];

      // Get full activity details
      const activityDetails = uniqueActivities
        .map((code) => ELECTRICAL_ACTIVITIES.find((a) => a.code === code))
        .filter(Boolean);

      // Get aggregated hazards and controls
      const methodHazards = getHazardsForActivities(uniqueActivities);
      const methodControls = getControlsForActivities(uniqueActivities);
      const methodPPE = getPPEForActivities(uniqueActivities);
      const methodPermits = getPermitsForActivities(uniqueActivities);

      // Build detailed activity descriptions
      const activityDescriptions = activityDetails.map((activity) => {
        if (!activity) return "";
        const hazardNames = activity.hazardCodes
          .map((code) => ELECTRICAL_HAZARDS.find((h) => h.code === code)?.name)
          .filter(Boolean);
        const controlNames = activity.controlCodes
          .map((code) => ELECTRICAL_CONTROLS.find((c) => c.code === code)?.name)
          .filter(Boolean);
        return `
### ${activity.name}
- Description: ${activity.description}
- Category: ${activity.category}
- Key Hazards: ${hazardNames.join(", ") || "General electrical hazards"}
- Required Controls: ${controlNames.slice(0, 5).join(", ") || "Standard electrical controls"}
- Method Points: ${activity.methodPoints.join("; ")}
- Competency: ${activity.competencyNotes || "Qualified electrician required"}
- PPE: ${activity.typicalPPE.join(", ")}
${activity.permitsRequired?.length ? `- Permits Required: ${activity.permitsRequired.join(", ")}` : ""}`;
      }).join("\n");

      return `${baseContext}

ELECTRICAL WORK ACTIVITIES SELECTED:
${activityDescriptions}

AGGREGATED REQUIREMENTS:
- Total Activities: ${uniqueActivities.length}
- Unique Hazards Identified: ${methodHazards.length}
- Control Measures Required: ${methodControls.length}
- PPE Requirements: ${methodPPE.join(", ")}
- Permits Required: ${methodPermits.length > 0 ? methodPermits.join(", ") : "None identified"}

Site Conditions:
- Occupied building: ${contextualAnswers.occupied_building ? "Yes" : "No"}
- Public interface: ${contextualAnswers.public_interface ? "Yes" : "No"}
- Live services: ${contextualAnswers.live_services ? "Yes - SAFE ISOLATION CRITICAL" : "No"}
- Confined spaces: ${contextualAnswers.confined_spaces ? "Yes" : "No"}
- Working at height: ${contextualAnswers.working_at_height ? "Yes" : "No"}
- Hot works: ${contextualAnswers.hot_works ? "Yes" : "No"}

IMPORTANT INSTRUCTION - Generate a comprehensive METHOD STATEMENT that:

1. Starts with a NARRATIVE OVERVIEW (2-3 paragraphs) describing how the overall electrical works will be carried out

2. For EACH selected activity, write a DETAILED NARRATIVE METHOD STATEMENT that includes:
   - Pre-work preparations and checks
   - Step-by-step description of HOW the work will be physically carried out
   - Safe isolation procedures where applicable (reference GS38 and proving unit usage)
   - Specific tools, test equipment, and materials to be used
   - Quality control and testing requirements
   - Handover and completion procedures

3. Include a section on SAFE ISOLATION PROCEDURE (detailed narrative per BS 7671 and GS38)

4. Include a section on ELECTRICAL TESTING (reference to BS 7671 Chapter 6)

5. Include COMPETENCY REQUIREMENTS (ECS cards, 18th Edition qualification, etc.)

DO NOT write brief bullet points. Write full paragraphs describing exactly how the work will be done.
Each activity section should be 200-400 words minimum.
Use professional electrical contractor language and terminology.`;


    case "environmental":
      return `${baseContext}

Environmental Controls Required:
- Spill Potential: ${contextualAnswers.spill_potential ? "Yes" : "No"}
- Spill Kit Type: ${contextualAnswers.spill_kit_required || "General purpose"}
- Dust Control: ${Array.isArray(contextualAnswers.dust_control_measures) ? contextualAnswers.dust_control_measures.join(", ") : "Standard measures"}
- Noise Control: ${Array.isArray(contextualAnswers.noise_control_measures) ? contextualAnswers.noise_control_measures.join(", ") : "Standard measures"}
- Waste Management: ${Array.isArray(contextualAnswers.waste_management) ? contextualAnswers.waste_management.join(", ") : "Standard waste management"}
- Water Protection Required: ${contextualAnswers.water_protection ? "Yes" : "No"}
- Drain Protection: ${Array.isArray(contextualAnswers.drain_protection) ? contextualAnswers.drain_protection.join(", ") : "As required"}
- Ecological Constraints: ${contextualAnswers.ecological_constraints ? "Yes" : "No"}
- Working Hours Restrictions: ${contextualAnswers.working_hours_restrictions || "Standard hours"}

Generate an Environmental Controls section including:
1. Dust suppression measures
2. Noise and vibration control
3. Waste management procedures
4. Spillage prevention and response
5. Water/drain protection
6. Ecological considerations
7. Nuisance mitigation for neighbours

Format as markdown with clear procedures and responsibilities.`;

    case "welfare":
      if (isSubcontractor) {
        return `${baseContext}

SUBCONTRACTOR WELFARE ARRANGEMENTS:
- Main Contractor provides welfare: Yes
- MC Welfare Location: ${contextualAnswers.mc_welfare_location || "To be confirmed on site induction"}
- MC First Aider: ${contextualAnswers.mc_first_aider || "To be confirmed on site induction"}
- MC Site Induction Required: ${contextualAnswers.mc_induction_required ? "Yes" : "To be confirmed"}
- Working Hours: ${contextualAnswers.working_hours_restrictions || "As per Main Contractor site rules"}

Generate a Welfare & Facilities section for a SUBCONTRACTOR that:
1. Clearly states welfare facilities are provided by the Main Contractor
2. References MC's first aid provisions and named first aider if known
3. Describes PPE requirements for subcontractor operatives
4. States working hours as per Main Contractor's site rules
5. Lists competency and training requirements for subcontractor personnel
6. Emphasizes requirement to attend MC site induction

Format as markdown with appropriate headings. Make it clear this is a subcontractor RAMS and welfare is MC-provided.`;
      }
      return `${baseContext}

Welfare Arrangements:
- Facilities: ${Array.isArray(contextualAnswers.welfare_facilities) ? contextualAnswers.welfare_facilities.join(", ") : "Standard welfare cabin"}
- First Aid: ${contextualAnswers.first_aid_provision || "First aid kit and trained first aider"}
- Working Hours: ${contextualAnswers.working_hours_restrictions || "Standard hours"}

Generate a Welfare & Facilities section including:
1. Welfare facilities description
2. First aid provisions
3. PPE requirements matrix
4. Working hours and rest breaks
5. Competency and training requirements
6. Site induction requirements

Format as markdown with appropriate headings.`;

    case "appendix":
      return `${baseContext}

Generate appropriate appendices for this RAMS including:
1. Signature/acknowledgement sheet
2. Document revision history
3. Permit to work forms checklist
4. Emergency contacts quick reference
5. Site rules summary

Format as markdown with appropriate tables and forms.`;

    default:
      return "";
  }
}

// Generate RAMS content using Claude API
export async function generateRAMSSection(
  sectionId: string,
  context: RAMSGenerationContext
): Promise<string> {
  const client = getAnthropicClient();
  const prompt = buildSectionPrompt(sectionId, context);

  if (!prompt) {
    throw new Error(`Unknown section: ${sectionId}`);
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: RAMS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract text content from the response
  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  return textContent.text;
}

// Get sections based on contractor type
export function getSectionsForContractorType(isSubcontractor: boolean) {
  const allSections = [
    { id: "intro", title: "Introduction & Scope" },
    { id: "cdm", title: "CDM Information" },
    { id: "emergency", title: "Emergency Procedures" },
    { id: "risks", title: "Risk Assessments" },
    { id: "loto", title: "Lock Off Tag Off / Safe Isolation" },
    { id: "methods", title: "Method Statements" },
    { id: "environmental", title: "Environmental Controls" },
    { id: "welfare", title: "Welfare & Facilities" },
    { id: "appendix", title: "Appendices" },
  ];

  if (isSubcontractor) {
    // Remove CDM section for subcontractors - that's handled by main contractor
    return allSections.filter((s) => s.id !== "cdm");
  }

  return allSections;
}

// Generate all RAMS sections
export async function generateFullRAMS(
  context: RAMSGenerationContext,
  onProgress?: (sectionId: string, status: "generating" | "complete" | "error") => void
): Promise<GeneratedRAMSSection[]> {
  const isSubcontractor = context.contractorType.type === "subcontractor";
  const sections = getSectionsForContractorType(isSubcontractor);

  const results: GeneratedRAMSSection[] = [];

  for (const section of sections) {
    try {
      onProgress?.(section.id, "generating");
      const content = await generateRAMSSection(section.id, context);
      results.push({
        id: section.id,
        title: section.title,
        content,
      });
      onProgress?.(section.id, "complete");
    } catch (error) {
      console.error(`Error generating section ${section.id}:`, error);
      onProgress?.(section.id, "error");
      results.push({
        id: section.id,
        title: section.title,
        content: `Error generating this section. Please try again.`,
      });
    }
  }

  return results;
}
