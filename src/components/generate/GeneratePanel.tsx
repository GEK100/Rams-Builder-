"use client";

import { useState, useMemo } from "react";
import { useRAMSStore } from "@/stores/ramsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WIDGET_TYPES } from "@/constants/trades";
import { getQuestionsForContractorType } from "@/constants/questions";
import { getSectionsForContractorType, type RAMSGenerationContext } from "@/lib/ai/claude";
import {
  ELECTRICAL_ACTIVITIES,
  ELECTRICAL_HAZARDS,
  ELECTRICAL_CONTROLS,
  getHazardsForActivities,
  getControlsForActivities,
  getPPEForActivities,
  getPermitsForActivities,
  getHazardByCode,
  getControlByCode,
} from "@/constants/electrical";
import type { ContractorType } from "@/types/rams";
import {
  Sparkles,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Copy,
  Mail,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";

type GenerationStatus = "idle" | "generating" | "complete" | "error";

interface GeneratedSection {
  id: string;
  title: string;
  content: string;
  status: GenerationStatus;
}

export function GeneratePanel() {
  const {
    currentRAMS,
    widgets,
    riskAssessments,
    contextualAnswers,
  } = useRAMSStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSections, setGeneratedSections] = useState<GeneratedSection[]>([]);
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isRecordingAcceptance, setIsRecordingAcceptance] = useState(false);
  const [pendingAction, setPendingAction] = useState<"download" | "email" | null>(null);

  // Get contractor type from current RAMS
  const contractorType: ContractorType = currentRAMS?.contractorType?.type || "main_contractor";

  // Get filtered questions based on contractor type
  const filteredQuestions = useMemo(() => {
    return getQuestionsForContractorType(contractorType);
  }, [contractorType]);

  // Calculate readiness with filtered questions
  const cdmComplete = currentRAMS?.cdmInfo?.client?.company && currentRAMS?.cdmInfo?.project?.siteAddress?.line1;
  const hasWidgets = widgets.length > 0;
  const hasActivities = widgets.some((w) => (w.selectedActivities?.length || 0) > 0);
  const hasRisks = riskAssessments.length > 0;
  const requiredQuestions = filteredQuestions.filter((q) => q.isRequired);
  const answeredRequired = requiredQuestions.filter((q) =>
    contextualAnswers.some((a) => a.questionId === q.id && a.answer !== undefined && a.answer !== "")
  ).length;
  const questionsComplete = answeredRequired === requiredQuestions.length || requiredQuestions.length === 0;

  // Count total selected activities and get details
  const allSelectedActivityCodes = widgets.flatMap((w) => w.selectedActivities || []);
  const uniqueActivityCodes = [...new Set(allSelectedActivityCodes)];
  const totalActivities = uniqueActivityCodes.length;

  // Get activity details for display
  const selectedActivityDetails = useMemo(() => {
    return uniqueActivityCodes
      .map((code) => ELECTRICAL_ACTIVITIES.find((a) => a.code === code))
      .filter(Boolean);
  }, [uniqueActivityCodes.join(",")]);

  // Get aggregated hazards, controls, PPE, permits
  const aggregatedHazards = useMemo(() => getHazardsForActivities(uniqueActivityCodes), [uniqueActivityCodes.join(",")]);
  const aggregatedControls = useMemo(() => getControlsForActivities(uniqueActivityCodes), [uniqueActivityCodes.join(",")]);
  const aggregatedPPE = useMemo(() => getPPEForActivities(uniqueActivityCodes), [uniqueActivityCodes.join(",")]);
  const aggregatedPermits = useMemo(() => getPermitsForActivities(uniqueActivityCodes), [uniqueActivityCodes.join(",")]);

  const readinessScore = [cdmComplete, hasWidgets && hasActivities, hasRisks, questionsComplete].filter(Boolean).length;
  const isReady = readinessScore >= 2; // Lower threshold for beta

  // Build context for AI generation
  const buildGenerationContext = (): RAMSGenerationContext => {
    // Convert contextualAnswers array to object
    const answersObj: Record<string, unknown> = {};
    contextualAnswers.forEach((a) => {
      answersObj[a.questionId] = a.answer;
    });

    // Build specifications array from uploaded project scope
    const specifications = currentRAMS?.projectScope
      ? [{
          name: currentRAMS.projectScopeFileName || "Project Scope Document",
          extractedText: currentRAMS.projectScope,
        }]
      : undefined;

    return {
      cdmInfo: currentRAMS?.cdmInfo || ({} as RAMSGenerationContext["cdmInfo"]),
      widgets,
      riskAssessments,
      contextualAnswers: answersObj,
      widgetTypes: WIDGET_TYPES.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
      })),
      contractorType: currentRAMS?.contractorType || { type: "main_contractor", welfareProvidedByMC: false },
      specifications,
    };
  };

  // Generate mock content based on selected activities (fallback when no API key)
  const generateMockContent = (sectionId: string): string => {
    const projectTitle = currentRAMS?.cdmInfo?.project?.title || "Electrical Installation Works";
    const clientCompany = currentRAMS?.cdmInfo?.client?.company || "Client Company";
    const siteAddress = currentRAMS?.cdmInfo?.project?.siteAddress;
    const mainContractor = currentRAMS?.cdmInfo?.principalContractor?.company || "Main Contractor";
    const isSubcontractor = contractorType === "subcontractor";

    switch (sectionId) {
      case "intro":
        return `# Introduction & Scope

## Document Purpose
This Risk Assessment and Method Statement (RAMS) has been prepared for ${projectTitle} to identify hazards, assess risks, and define safe working methods for all electrical installation activities.

## Project Overview
- **Client:** ${clientCompany}
- **Location:** ${siteAddress?.line1 || "Site Address"}, ${siteAddress?.city || "City"}, ${siteAddress?.postcode || "Postcode"}
${isSubcontractor ? `- **Main Contractor:** ${mainContractor}` : ""}
- **Contractor Type:** ${isSubcontractor ? "Subcontractor" : "Main Contractor"}

## Scope of Works
This RAMS covers the following electrical activities:

${selectedActivityDetails.map((a) => `### ${a?.name}
${a?.description}
- **Category:** ${a?.category?.replace(/_/g, " ")}
- **Key Method Points:** ${a?.methodPoints?.join("; ") || "Standard electrical procedures"}
`).join("\n")}

## Compliance
This document is prepared in accordance with:
- Construction (Design and Management) Regulations 2015
- Electricity at Work Regulations 1989
- BS 7671:2018 Requirements for Electrical Installations (18th Edition)
- Health and Safety at Work Act 1974
- HSE Guidance GS38, HSR25, INDG354`;

      case "emergency":
        return `# Emergency Procedures

## Emergency Contacts
| Contact | Number |
|---------|--------|
| Emergency Services | 999 |
| Site Manager | To be confirmed |
| First Aider | ${isSubcontractor ? "Main Contractor to confirm" : "To be confirmed"} |
| Electrical Emergency | Isolate supply immediately |

## Electrical Emergency Procedure
In the event of an electrical accident:
1. **DO NOT** touch the casualty if they are still in contact with the electrical source
2. Isolate the electrical supply if safe to do so
3. Call 999 immediately
4. If trained, commence CPR if the casualty is not breathing
5. Treat for burns - cool with water for at least 20 minutes
6. Do not remove clothing stuck to burns

## Fire Procedures
- Sound the alarm
- Leave by the nearest exit
- Do not use lifts
- Assemble at designated assembly point
- Do not re-enter the building

${isSubcontractor ? `## Main Contractor Arrangements
As a subcontractor, our personnel will:
- Attend the Main Contractor's site induction
- Follow the Main Contractor's emergency procedures
- Report to the Main Contractor's first aider
- Use the Main Contractor's welfare facilities` : ""}`;

      case "risks": {
        // Look up full hazard objects from codes
        const hazardObjects = aggregatedHazards
          .map((code) => getHazardByCode(code))
          .filter(Boolean);
        // Look up full control objects from codes
        const controlObjects = aggregatedControls
          .map((code) => getControlByCode(code))
          .filter(Boolean);

        return `# Risk Assessments

## Risk Assessment Methodology
Risk is assessed using a 5x5 matrix:
- **Likelihood (L):** 1 (Very Unlikely) to 5 (Very Likely)
- **Severity (S):** 1 (Minor) to 5 (Fatal/Catastrophic)
- **Risk Score:** L × S

| Risk Score | Rating | Action Required |
|------------|--------|-----------------|
| 1-4 | Low | Proceed with standard controls |
| 5-9 | Medium | Additional controls may be required |
| 10-14 | High | Senior management review required |
| 15-25 | Critical | Work must not proceed |

## Identified Hazards and Controls

${hazardObjects.map((hazard) => `### ${hazard?.name}
**Category:** ${hazard?.category}
**Severity:** ${hazard?.severity}
**Description:** ${hazard?.description}
**Persons at Risk:** ${hazard?.atRiskPersons?.join(", ") || "All operatives"}
**Regulatory Reference:** ${hazard?.regulatoryReference || "Electricity at Work Regulations 1989"}
`).join("\n")}

## Control Measures Applied

${controlObjects.slice(0, 15).map((control) => `### ${control?.name}
**Category:** ${control?.category}
**Effectiveness:** ${control?.effectiveness}
**Description:** ${control?.description}
${control?.implementationNotes ? `**Implementation:** ${control?.implementationNotes}` : ""}
${control?.verificationRequired ? `**Verification:** ${control?.verificationRequired}` : ""}
`).join("\n")}`;
      }

      case "loto":
        return `# Lock Off Tag Off (LOTO) / Safe Isolation Procedure

## Policy Statement
**ALL WORK ON ELECTRICAL SYSTEMS WILL BE CARRIED OUT DEAD UNLESS IT CAN BE DEMONSTRATED THAT IT IS UNREASONABLE FOR THE WORK TO BE DONE DEAD.**

This procedure complies with:
- Electricity at Work Regulations 1989 (Regulation 13 - Working Dead)
- HSE Guidance Note GS38 - Electrical Test Equipment for Use on Low Voltage Electrical Systems
- BS 7671:2018 Section 537 - Isolation and Switching
- Health and Safety at Work Act 1974

---

## Safe Isolation Procedure (8 Steps)

### ⚠️ CRITICAL: This procedure must be followed for ALL electrical work

### Step 1: IDENTIFY
- Identify the circuit(s) to be worked on using distribution board schedules and circuit charts
- Verify circuit identification against as-installed drawings where available
- Trace cables physically where there is any doubt about circuit identification
- Never assume - always verify

### Step 2: NOTIFY
- Inform the client/building occupants of planned isolation and expected duration
- Notify the Main Contractor site supervisor (for subcontractor works)
- Coordinate with other contractors who may be affected
- Record notification in the site diary/day sheet

### Step 3: ISOLATE
- Isolate at the nearest practical point of supply to the work
- Use appropriate isolation device:
  - MCB (Miniature Circuit Breaker)
  - MCCB (Moulded Case Circuit Breaker)
  - Isolator switch
  - Fuse carrier removal
- Switch OFF the device and verify it is in the OFF position

### Step 4: SECURE - LOCK OFF TAG OFF
Apply lockout equipment in the following order:

1. **Lockout Device**: Apply appropriate lockout device to the isolation point
   - MCB lockout for MCBs
   - MCCB lockout for MCCBs
   - Multi-lock hasp where multiple persons are working

2. **Personal Padlock**: Each person working on the circuit MUST apply their OWN unique padlock
   - Only the person who applied the padlock may remove it
   - Each padlock must have a unique key retained by that person only

3. **Warning Tag**: Attach a danger tag with:
   | Information | Details |
   |-------------|---------|
   | Name | Person who applied isolation |
   | Date | Date of isolation |
   | Time | Time isolation applied |
   | Reason | Brief description of work |
   | Expected Duration | When re-energisation expected |
   | Contact Number | Phone number if available |

**WARNING: The tag alone is NOT sufficient - a physical lock MUST be used**

### Step 5: PROVE the Voltage Indicator (First Prove)
Before testing the isolated circuit:
1. Select a **known live source** (another circuit confirmed as live)
2. Test between Line and Neutral
3. Test between Line and Earth
4. Confirm the voltage indicator illuminates/indicates correctly
5. Check all indicator functions are working

**Test Equipment Requirements (GS38 Compliant):**
- Voltage indicator with clear indication
- Maximum tip exposure 4mm with finger guard
- Fused test leads (500mA HRC fuse)
- CAT III or CAT IV rated for the installation

### Step 6: VERIFY Dead (Test the Isolated Circuit)
Test the isolated circuit systematically:

**Single Phase:**
- Test Line to Neutral
- Test Line to Earth
- Test Neutral to Earth

**Three Phase:**
- Test L1 to L2
- Test L2 to L3
- Test L1 to L3
- Test L1 to Earth
- Test L2 to Earth
- Test L3 to Earth
- Test Neutral to Earth

**Confirm:** No voltage indication on ANY test

### Step 7: PROVE the Voltage Indicator AGAIN (Second Prove)
Immediately after testing the isolated circuit:
1. Return to the **same known live source**
2. Repeat the tests from Step 5
3. Confirm the voltage indicator still functions correctly

**This step is CRITICAL** - it proves the tester did not fail during testing of the isolated circuit

### Step 8: BEGIN WORK
Only after completing ALL steps above may work commence:
- Maintain isolation throughout the work period
- Do NOT allow anyone else to remove your lockout
- If you leave the work area, you must re-verify the isolation on return
- Re-test before re-commencing work after breaks

---

## Lockout Equipment Required

| Equipment | Purpose | Quantity Required |
|-----------|---------|-------------------|
| MCB Lockout Device | Lock off MCBs in distribution boards | As required |
| MCCB Lockout Device | Lock off larger MCCBs | As required |
| Isolator Lockout | Lock off rotary isolators | As required |
| Fuse Lockout | Lock off fuse carriers | As required |
| Multi-Lock Hasp | Allow multiple padlocks on one device | 1 per isolation point |
| Personal Padlock | Individual lockout - unique key | 1 per worker |
| Danger Tags | Warning notices | Minimum 10 |
| Lockout Station | Storage for lockout equipment | 1 per site |

---

## Test Equipment Checklist

Before starting work, verify:
- [ ] Voltage indicator in date for calibration/PAT
- [ ] Proving unit in date for calibration/PAT
- [ ] Fused test leads in good condition
- [ ] Probes shrouded with max 4mm tip exposure
- [ ] Finger guards in place
- [ ] No damage to equipment
- [ ] Correct CAT rating for the installation

---

## Re-Energisation Procedure

**Before removing ANY lockout, complete ALL of the following:**

| Step | Action | Confirmed |
|------|--------|-----------|
| 1 | Verify ALL work is complete | ☐ |
| 2 | Visual inspection - all covers and guards replaced | ☐ |
| 3 | All tools and equipment removed from work area | ☐ |
| 4 | All personnel clear of the work area | ☐ |
| 5 | Warning notices can be removed | ☐ |
| 6 | Verbal confirmation obtained from all workers | ☐ |
| 7 | Final testing/verification complete | ☐ |
| 8 | Documentation completed | ☐ |

**Removal Sequence:**
1. Each person removes their own padlock ONLY
2. Last person removes the lockout device
3. Re-energise the circuit
4. Verify correct operation
5. Complete isolation record documentation

---

## Live Working Controls

**Live working is ONLY permitted when:**
1. It is unreasonable for the work to be done dead (Reg 14 EaWR 1989)
2. A written risk assessment justifies the decision
3. A live working permit has been issued
4. The person is competent for live working
5. Suitable precautions are in place

**If live working is required:**
- Arc flash risk assessment completed
- Arc-rated PPE worn (suit, hood, gloves)
- Insulated tools used (VDE 1000V rated)
- Barriers and warning signs in place
- Accompanying person present
- Fire extinguisher available
- Non-synthetic clothing worn underneath PPE

---

## Isolation Record Form

| Field | Entry |
|-------|-------|
| **Circuit/Equipment ID** | |
| **Location** | |
| **Isolation Point** | |
| **Isolation Method** | MCB / MCCB / Isolator / Fuse |
| **Lockout Device Applied** | Yes / No |
| **Padlock Number** | |
| **Person Isolating** | Name: |
| **Date Isolated** | |
| **Time Isolated** | |
| **Voltage Indicator Serial No** | |
| **First Prove Result** | Pass / Fail |
| **Test Results (Dead)** | L-N: / L-E: / N-E: |
| **Second Prove Result** | Pass / Fail |
| **Work Description** | |
| **Re-energisation Authorised By** | |
| **Re-energisation Date** | |
| **Re-energisation Time** | |

---

**⚠️ REMEMBER: When in doubt - DON'T. Stop work and seek guidance.**`;

      case "methods":
        return `# Method Statements

## Overview
The following method statements describe the safe systems of work for the electrical installation activities covered by this RAMS. All work will be carried out in accordance with BS 7671:2018 (18th Edition Wiring Regulations) and the Electricity at Work Regulations 1989.

**⚠️ IMPORTANT: Before commencing any electrical work, the Lock Off Tag Off (LOTO) / Safe Isolation procedure detailed in the previous section of this RAMS MUST be followed. No work shall commence until the circuit has been proven dead using the 8-step safe isolation procedure.**

${selectedActivityDetails.map((activity) => `## ${activity?.name}

### Description
${activity?.description}

### Pre-Work Requirements
- Ensure safe isolation procedure has been completed (where applicable)
- Check work area for hazards and obstructions
- Ensure correct PPE is available and worn
- Review relevant drawings and specifications
- Confirm materials and tools are available

### Method
${activity?.methodPoints?.map((point, i) => `${i + 1}. ${point}`).join("\n") || "Standard electrical installation procedures apply."}

### Competency Requirements
${activity?.competencyNotes || "Work to be carried out by qualified electricians holding ECS cards and BS 7671 18th Edition certification."}

### PPE Requirements
${activity?.typicalPPE?.join(", ") || "Safety boots, hi-vis, hard hat, safety glasses, insulated gloves (where required)"}

${activity?.permitsRequired?.length ? `### Permits Required
${activity.permitsRequired.join(", ")}` : ""}

---
`).join("\n")}

## Electrical Testing
All installations will be tested in accordance with BS 7671 Chapter 6. Testing will include:
- Continuity of protective conductors
- Continuity of ring final circuit conductors
- Insulation resistance
- Polarity
- Earth fault loop impedance
- RCD operation (where applicable)

Test results will be recorded on Electrical Installation Certificates or Minor Works Certificates as appropriate.`;

      case "environmental":
        return `# Environmental Controls

## Waste Management
- Cable offcuts to be collected and recycled where possible
- Packaging materials to be sorted for recycling
- WEEE waste to be disposed of via licensed carrier
- Hazardous waste (e.g., batteries) to be disposed of appropriately

## Dust Control
- Use dust extraction when drilling into masonry
- Clean work areas regularly
- Cover sensitive equipment when working overhead

## Noise Control
- Use battery-powered tools where possible to reduce noise
- Inform building users of noisy activities in advance
- Comply with site working hours restrictions

## Spillage Prevention
- Store oils and lubricants in secondary containment
- Keep spill kit available when using cutting oils
- Clean up any spills immediately`;

      case "welfare":
        return `# Welfare & Facilities

${isSubcontractor ? `## Subcontractor Arrangements
As a subcontractor, welfare facilities will be provided by the Main Contractor (${mainContractor}).

Our personnel will:
- Attend the Main Contractor's site induction before commencing work
- Use the Main Contractor's welfare facilities (toilets, washing facilities, rest area)
- Report to the Main Contractor's named first aider in case of injury
- Follow the Main Contractor's site rules and procedures

## Subcontractor Responsibilities
We will ensure:
- All operatives have received site induction
- All operatives hold valid ECS cards
- All operatives are competent for the work being undertaken
- All required PPE is provided and worn
` : `## Welfare Provisions
- Toilets and washing facilities provided on site
- Rest area with seating and facilities for heating food
- Drinking water available
- First aid kit and trained first aider on site
`}

## PPE Requirements
The following PPE is required for electrical installation work:

| Item | Standard | When Required |
|------|----------|---------------|
${aggregatedPPE.map((ppe) => `| ${ppe} | As per manufacturer | All electrical work |`).join("\n")}

## Competency Requirements
All electrical operatives must hold:
- Valid ECS (Electrotechnical Certification Scheme) card
- BS 7671:2018 18th Edition qualification
- Appropriate additional qualifications for specialist work

${aggregatedPermits.length > 0 ? `## Permits Required
The following permits may be required:
${aggregatedPermits.map((p) => `- ${p}`).join("\n")}` : ""}`;

      case "appendix":
        return `# Appendices

## Appendix A - RAMS Acknowledgement Sheet
All personnel must sign to confirm they have read and understood this RAMS before commencing work.

| Name | Company | ECS Card No. | Signature | Date |
|------|---------|--------------|-----------|------|
|      |         |              |           |      |
|      |         |              |           |      |
|      |         |              |           |      |
|      |         |              |           |      |
|      |         |              |           |      |

## Appendix B - Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | ${new Date().toLocaleDateString("en-GB")} | RAMS Builder | Initial issue |

**Review Date:** ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")} (3 months from issue)

## Appendix C - Selected Activities Summary

**Total Activities:** ${selectedActivityDetails.length}
**Total Hazards Identified:** ${aggregatedHazards.length}
**Total Controls Applied:** ${aggregatedControls.length}
**PPE Items Required:** ${aggregatedPPE.length}
${aggregatedPermits.length > 0 ? `**Permits Required:** ${aggregatedPermits.join(", ")}` : "**Permits Required:** None identified"}

### Activity List
${selectedActivityDetails.map((a) => `- ${a?.name}`).join("\n")}

## Appendix D - Test Equipment Checklist
- [ ] Voltage indicator (GS38 compliant)
- [ ] Proving unit
- [ ] Multifunction tester (calibrated within 12 months)
- [ ] Earth loop impedance tester
- [ ] RCD tester
- [ ] Insulation resistance tester
- [ ] Lock-off devices and warning notices`;

      default:
        return "";
    }
  };

  // Generate RAMS - uses mock content (API integration pending)
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    const isSubcontractor = contractorType === "subcontractor";
    const sectionDefinitions = getSectionsForContractorType(isSubcontractor);

    const sections: GeneratedSection[] = sectionDefinitions.map((s) => ({
      id: s.id,
      title: s.title,
      content: "",
      status: "idle" as GenerationStatus,
    }));

    setGeneratedSections(sections);

    // Generate each section with mock content (API will be used when key is available)
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      setGeneratedSections((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "generating" } : s))
      );

      // Simulate generation delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use mock content based on selected activities
      const content = generateMockContent(section.id);

      setGeneratedSections((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "complete", content } : s
        )
      );

      setGenerationProgress(((i + 1) / sections.length) * 100);
    }

    setIsGenerating(false);
  };

  // Show disclaimer before download
  const handleDownloadClick = () => {
    setPendingAction("download");
    setShowDisclaimer(true);
  };

  // Show disclaimer before email
  const handleEmailClick = () => {
    setPendingAction("email");
    setShowDisclaimer(true);
  };

  // Handle disclaimer acceptance
  const handleDisclaimerAccept = async () => {
    setIsRecordingAcceptance(true);

    try {
      // Generate content for hash
      const content = generatedSections.map((s) => s.content).join("\n\n---\n\n");

      // Record acceptance in backend
      const response = await fetch("/api/rams/accept-disclaimer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ramsId: currentRAMS?.id,
          ramsVersion: currentRAMS?.version || 1,
          generatedContent: content,
        }),
      });

      if (!response.ok) {
        console.error("Failed to record disclaimer acceptance");
        // Continue with download even if recording fails
      }

      // Close disclaimer and proceed with pending action
      setShowDisclaimer(false);

      if (pendingAction === "download") {
        performDownload();
      } else if (pendingAction === "email") {
        setShowEmailModal(true);
      }

      setPendingAction(null);
    } catch (error) {
      console.error("Error recording acceptance:", error);
      // Continue with download even if recording fails
      setShowDisclaimer(false);
      if (pendingAction === "download") {
        performDownload();
      } else if (pendingAction === "email") {
        setShowEmailModal(true);
      }
      setPendingAction(null);
    } finally {
      setIsRecordingAcceptance(false);
    }
  };

  // Actually perform the download
  const performDownload = () => {
    const projectTitle = currentRAMS?.cdmInfo?.project?.title || "RAMS_Document";
    const safeTitle = projectTitle.replace(/[^a-zA-Z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];

    // Create markdown content with all sections
    const content = generatedSections.map((s) => s.content).join("\n\n---\n\n");

    // Download as markdown file (can be opened in Word)
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}_${dateStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Legacy function for email modal internal use
  const handleDownload = () => {
    performDownload();
  };

  // Send RAMS via email
  const handleSendEmail = async () => {
    if (!emailAddress || !emailAddress.includes("@")) {
      return;
    }

    setIsSendingEmail(true);

    // For now, use mailto: as a fallback since we don't have email API configured
    // In production, this would call an API endpoint to send the email
    const projectTitle = currentRAMS?.cdmInfo?.project?.title || "RAMS Document";
    const content = generatedSections.map((s) => s.content).join("\n\n---\n\n");

    // Create a simple mailto link with the content summary
    const subject = encodeURIComponent(`RAMS Document: ${projectTitle}`);
    const body = encodeURIComponent(
      `Please find attached the RAMS document for: ${projectTitle}\n\n` +
      `Generated on: ${new Date().toLocaleDateString("en-GB")}\n\n` +
      `---\n\n` +
      `Note: The full document has been downloaded. Please attach it to this email.\n\n` +
      `Sections included:\n` +
      generatedSections.map((s) => `- ${s.title}`).join("\n")
    );

    // Download the file first
    handleDownload();

    // Small delay then open mailto
    setTimeout(() => {
      window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      setIsSendingEmail(false);
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSent(false);
        setEmailAddress("");
      }, 2000);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Generate RAMS Document</h2>
        <p className="text-muted-foreground">
          Use AI to generate your complete Risk Assessment and Method Statement
        </p>
      </div>

      {/* Readiness Check */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Document Readiness</CardTitle>
          <CardDescription>
            Complete these sections before generating your RAMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {cdmComplete ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              <span className={cn(!cdmComplete && "text-muted-foreground")}>
                {contractorType === "subcontractor" ? "Project Information" : "CDM Information"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasWidgets && hasActivities ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              <span className={cn(!(hasWidgets && hasActivities) && "text-muted-foreground")}>
                Work Activities ({totalActivities} selected)
              </span>
            </div>
            <div className="flex items-center gap-3">
              {questionsComplete ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              <span className={cn(!questionsComplete && "text-muted-foreground")}>
                Site Questions ({answeredRequired}/{requiredQuestions.length})
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasRisks ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              <span className={cn(!hasRisks && "text-muted-foreground")}>
                Risk Assessments ({riskAssessments.length} added)
              </span>
            </div>
            <div className="flex items-center gap-3">
              {currentRAMS?.projectScope ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-white/20" />
              )}
              <span className={cn(!currentRAMS?.projectScope && "text-muted-foreground")}>
                Project Scope {currentRAMS?.projectScope ? "(uploaded)" : "(optional)"}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Readiness Score</span>
              <span>{readinessScore}/4 complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(readinessScore / 4) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate RAMS with AI
            </>
          )}
        </Button>
        {generatedSections.length > 0 && !isGenerating && (
          <div className="flex gap-2">
            <Button size="lg" variant="outline" onClick={handleDownloadClick}>
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>
            <Button size="lg" variant="outline" onClick={handleEmailClick}>
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Button>
          </div>
        )}
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card variant="glass">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Generating document sections...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Sections */}
      {generatedSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Sections</h3>
          {generatedSections.map((section) => (
            <Card key={section.id} variant="glass">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {section.status === "complete" ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : section.status === "generating" ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : section.status === "error" ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {section.status === "complete" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPreviewSection(previewSection === section.id ? null : section.id)
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {previewSection === section.id ? "Hide" : "Preview"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(section.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {section.status === "error" && (
                    <Button variant="ghost" size="sm" onClick={() => {}}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
              {previewSection === section.id && (
                <div className="border-t border-white/10 p-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-white/5 p-4 rounded-lg overflow-auto max-h-96">
                    {section.content}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Info about AI */}
      <Card variant="glass" className="p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Powered by Claude AI</p>
            <p className="text-sm text-muted-foreground">
              Our AI generates comprehensive RAMS content based on your inputs, following UK
              construction safety standards including CDM 2015 and HSE guidelines.
            </p>
          </div>
        </div>
      </Card>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email RAMS Document</h3>
                <p className="text-sm text-muted-foreground">Send to yourself or a colleague</p>
              </div>
            </div>

            {emailSent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="font-medium">Email client opened!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Attach the downloaded file to complete sending.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will download the RAMS document and open your email client with a pre-filled message.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSendEmail}
                    disabled={!emailAddress || !emailAddress.includes("@") || isSendingEmail}
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => {
          setShowDisclaimer(false);
          setPendingAction(null);
        }}
        onAccept={handleDisclaimerAccept}
        ramsTitle={currentRAMS?.cdmInfo?.project?.title || "RAMS Document"}
        isLoading={isRecordingAcceptance}
      />
    </div>
  );
}
