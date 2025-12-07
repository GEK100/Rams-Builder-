/**
 * Electrical Method Statement Templates
 * Pre-built templates for common electrical work activities
 * Based on HSE guidance and industry best practice
 */

import type { ElectricalMethodTemplate } from "./types";

export const ELECTRICAL_METHOD_TEMPLATES: ElectricalMethodTemplate[] = [
  // ============================================
  // SAFE ISOLATION - Core Procedure
  // ============================================
  {
    id: "method-safe-isolation",
    code: "safe_isolation",
    name: "Safe Isolation Procedure",
    description: "Standard procedure for safely isolating electrical circuits before work commences",
    applicableWorkTypes: [
      "installation",
      "maintenance",
      "repair",
      "testing",
      "modification",
    ],
    preWorkChecks: [
      "Identify the circuit(s) to be worked on from drawings/schedules",
      "Confirm the correct isolation point(s) for all sources of supply",
      "Ensure approved voltage indicator is available and in good condition",
      "Check voltage indicator on a known live source (PROVING UNIT preferred)",
      "Ensure locking-off equipment is available (padlocks, hasps, tags)",
      "Inform all affected persons of intended isolation",
      "Obtain permit to work if required by site procedures",
    ],
    steps: [
      {
        stepNumber: 1,
        activity: "Identify the circuit",
        keyPoints: [
          "Use circuit charts, drawings, or trace cables to identify correct circuit",
          "Consider all possible sources of supply including alternative feeds, UPS, generators",
          "Identify all points of isolation required",
        ],
        hazardsAddressed: ["electric_shock_direct"],
        controlsApplied: ["risk_assessment", "competent_persons"],
      },
      {
        stepNumber: 2,
        activity: "Switch off at the identified isolation point(s)",
        keyPoints: [
          "Operate the isolator/switch to the OFF position",
          "Ensure the device is suitable for isolation (not just functional switching)",
          "Check the device is capable of being locked off",
        ],
        hazardsAddressed: ["electric_shock_direct"],
        controlsApplied: ["isolation"],
      },
      {
        stepNumber: 3,
        activity: "Secure the isolation",
        keyPoints: [
          "Apply personal safety lock(s) to prevent re-energisation",
          "Use multi-lock hasp if multiple workers involved",
          "Attach 'Danger - Do Not Operate' tag with name and date",
          "Retain key on person at all times",
        ],
        hazardsAddressed: ["electric_shock_direct"],
        controlsApplied: ["lockout_tagout"],
      },
      {
        stepNumber: 4,
        activity: "Prove the voltage indicator",
        keyPoints: [
          "Test the voltage indicator on a known live source",
          "Use a proving unit for reliable testing",
          "Confirm indicator shows correct reading on all phases",
          "Check indicator battery condition if applicable",
        ],
        hazardsAddressed: ["test_equipment_failure"],
        controlsApplied: ["test_equipment_inspection", "test_equipment_gs38"],
      },
      {
        stepNumber: 5,
        activity: "Test for dead at the point of work",
        keyPoints: [
          "Test between all live conductors (L-L, L-N)",
          "Test between all live conductors and earth (L-E, N-E)",
          "Test at the actual point where work will take place",
          "If any voltage detected - STOP - investigate and re-isolate",
        ],
        hazardsAddressed: ["electric_shock_direct", "stored_energy"],
        controlsApplied: ["dead_working", "test_equipment_gs38"],
      },
      {
        stepNumber: 6,
        activity: "Re-prove the voltage indicator",
        keyPoints: [
          "Immediately re-test indicator on known live source",
          "Confirms the indicator was working during the dead test",
          "Only proceed with work once this step is complete",
        ],
        hazardsAddressed: ["test_equipment_failure"],
        controlsApplied: ["test_equipment_inspection"],
      },
    ],
    postWorkChecks: [
      "Ensure all work is complete and tested",
      "Remove all tools and temporary equipment from work area",
      "Replace covers and reinstate barriers",
      "Remove danger tags and personal locks (last worker out)",
      "Confirm with all affected persons before re-energisation",
      "Re-energise and functionally test if appropriate",
    ],
    competencyRequired: [
      "Qualified electrician (NVQ Level 3 or equivalent)",
      "18th Edition BS 7671 trained",
      "Safe isolation trained and assessed",
      "ECS/JIB card holder",
    ],
    equipmentRequired: [
      "Approved voltage indicator (CAT III/IV rated)",
      "Proving unit or known live source",
      "Personal padlock with unique key",
      "Danger tags",
      "Multi-lock hasp (for team working)",
    ],
    ppeRequired: [
      "Safety boots",
      "Safety glasses (for isolation switching)",
      "Insulated gloves (if risk of flashover)",
    ],
    emergencyProcedures: [
      "If shock occurs: Isolate supply, do not touch victim until supply confirmed off",
      "Call emergency services (999) immediately for any electric shock",
      "Administer CPR if victim is unresponsive and not breathing",
      "Report all electrical incidents to supervisor and complete accident report",
    ],
    regulatoryReferences: [
      "Electricity at Work Regulations 1989 Reg 12, 13",
      "HSE Guidance Note GS38",
      "BS 7671 (18th Edition)",
    ],
    isActive: true,
    sortOrder: 1,
  },

  // ============================================
  // ELECTRICAL TESTING
  // ============================================
  {
    id: "method-initial-verification",
    code: "initial_verification",
    name: "Initial Verification and Testing",
    description: "Testing new electrical installations before energisation in accordance with BS 7671",
    applicableWorkTypes: [
      "installation",
      "new_work",
    ],
    preWorkChecks: [
      "Confirm installation is complete and ready for testing",
      "Ensure installation is safely isolated from all supplies",
      "Verify test instruments are calibrated and in date",
      "Check test leads comply with GS38 requirements",
      "Review design documentation and expected test values",
      "Ensure area is clear of other workers and hazards",
      "Confirm emergency procedures in case of incident",
    ],
    steps: [
      {
        stepNumber: 1,
        activity: "Visual inspection",
        keyPoints: [
          "Inspect installation before any testing",
          "Check for correct cable sizes, connections, and terminations",
          "Verify protective devices are correctly rated",
          "Confirm basic protection (insulation, barriers) is in place",
          "Check IP ratings of enclosures",
          "Identify any obvious defects",
        ],
        hazardsAddressed: ["electric_shock_indirect", "electrical_fire"],
        controlsApplied: ["competent_persons", "risk_assessment"],
      },
      {
        stepNumber: 2,
        activity: "Continuity of protective conductors",
        keyPoints: [
          "Test continuity of all protective conductors (CPC, main bonding, supplementary bonding)",
          "Record values in ohms - should be low resistance",
          "Ensure meter leads are in good condition",
          "Test from distribution board to furthest point",
        ],
        hazardsAddressed: ["electric_shock_indirect"],
        controlsApplied: ["earthing_bonding", "test_equipment_gs38"],
      },
      {
        stepNumber: 3,
        activity: "Continuity of ring final circuit conductors",
        keyPoints: [
          "Perform ring continuity test (r1, rn, r2 measurements)",
          "Cross-connect method to verify ring integrity",
          "Check for interconnections and spurs",
          "Record results for each ring circuit",
        ],
        hazardsAddressed: ["electrical_fire"],
        controlsApplied: ["test_equipment_gs38"],
      },
      {
        stepNumber: 4,
        activity: "Insulation resistance testing",
        keyPoints: [
          "Disconnect or remove sensitive electronic equipment",
          "Test at 500V DC between L-E, N-E, L-N",
          "Minimum acceptable value 1 Megohm",
          "Ensure all switches are ON, lamps removed",
          "WARNING: Circuit can retain charge after test - discharge before touching",
        ],
        hazardsAddressed: ["electric_shock_indirect", "electrical_fire", "stored_energy"],
        controlsApplied: ["test_equipment_gs38", "barriers_enclosures"],
      },
      {
        stepNumber: 5,
        activity: "Polarity check",
        keyPoints: [
          "Verify single pole devices are in line conductor only",
          "Confirm correct polarity at all socket outlets and accessories",
          "Can be tested during continuity or with live polarity indicator",
        ],
        hazardsAddressed: ["electric_shock_direct"],
        controlsApplied: ["competent_persons"],
      },
      {
        stepNumber: 6,
        activity: "Earth fault loop impedance (Zs)",
        keyPoints: [
          "Measure at furthest point of each circuit (energised test)",
          "Compare with maximum Zs values in BS 7671",
          "Account for temperature correction if necessary",
          "Ensure result allows disconnection in required time",
        ],
        hazardsAddressed: ["electric_shock_indirect"],
        controlsApplied: ["circuit_protection", "test_equipment_gs38"],
      },
      {
        stepNumber: 7,
        activity: "Prospective fault current (Ipf)",
        keyPoints: [
          "Measure at origin of installation",
          "Confirm protective devices can break prospective fault current",
          "Record highest Ipf value",
        ],
        hazardsAddressed: ["arc_flash", "electrical_fire"],
        controlsApplied: ["circuit_protection"],
      },
      {
        stepNumber: 8,
        activity: "RCD testing",
        keyPoints: [
          "Test at rated residual current (30mA, 100mA, etc.)",
          "Record trip times - must be within specification",
          "Test all RCDs including at 5x and on ramp test if required",
          "Press integral test button after instrument test",
        ],
        hazardsAddressed: ["electric_shock_direct", "electric_shock_indirect"],
        controlsApplied: ["rcd_protection", "test_equipment_gs38"],
      },
    ],
    postWorkChecks: [
      "Complete all test result schedules",
      "Issue Electrical Installation Certificate (EIC)",
      "Provide schedules of test results",
      "Provide circuit charts and labelling",
      "Inform client of any limitations or observations",
      "Restore protective covers and barriers",
    ],
    competencyRequired: [
      "Qualified electrician with current 18th Edition certificate",
      "Trained and competent in electrical testing",
      "Understanding of BS 7671 requirements",
      "Part P registered (for domestic work) or working under scheme supervision",
    ],
    equipmentRequired: [
      "Multi-function installation tester (calibrated)",
      "Insulation resistance tester (500V minimum)",
      "Low resistance ohmmeter",
      "RCD tester",
      "GS38 compliant test leads and probes",
      "Proving unit",
    ],
    ppeRequired: [
      "Safety boots",
      "Safety glasses",
      "Insulating gloves (for live Zs testing)",
    ],
    emergencyProcedures: [
      "If shock occurs during live testing: Isolate immediately, call 999",
      "In case of test equipment failure: Stop work, isolate, inspect equipment",
      "Report any incidents and near misses",
    ],
    regulatoryReferences: [
      "BS 7671 Part 6 (Inspection and Testing)",
      "HSE Guidance Note GS38",
      "Electricity at Work Regulations 1989",
    ],
    isActive: true,
    sortOrder: 2,
  },

  // ============================================
  // CABLE INSTALLATION
  // ============================================
  {
    id: "method-cable-installation",
    code: "cable_installation",
    name: "Cable Installation",
    description: "Safe installation of electrical cables in various environments",
    applicableWorkTypes: [
      "installation",
      "new_work",
      "modification",
    ],
    preWorkChecks: [
      "Review drawings and cable schedule",
      "Confirm cable routes are clear and accessible",
      "Check for existing services (use CAT scanner for concealed routes)",
      "Ensure correct cable type and size is available",
      "Check environmental conditions (temperature, moisture)",
      "Obtain permits if required (hot work, confined space)",
      "Ensure all isolations in place for work near live equipment",
    ],
    steps: [
      {
        stepNumber: 1,
        activity: "Survey cable route",
        keyPoints: [
          "Walk the entire cable route",
          "Identify all fixing points and supports required",
          "Note any obstacles or hazards",
          "Check for proximity to heat sources, other services",
          "Confirm cable entry points to equipment",
        ],
        hazardsAddressed: ["underground_cable_strike"],
        controlsApplied: ["cable_avoidance_tools", "risk_assessment"],
      },
      {
        stepNumber: 2,
        activity: "Install containment (if required)",
        keyPoints: [
          "Install cable tray, trunking, or conduit as per design",
          "Ensure adequate support at required intervals",
          "Maintain separation from other services",
          "Allow for thermal expansion",
          "Install fire barriers at compartment penetrations",
        ],
        hazardsAddressed: ["electrical_fire"],
        controlsApplied: ["cable_protection"],
      },
      {
        stepNumber: 3,
        activity: "Pull in cables",
        keyPoints: [
          "Calculate maximum pulling tension for cable",
          "Use appropriate pulling equipment and lubricant",
          "Observe minimum bending radii",
          "Do not exceed cable sidewall pressure limits",
          "Leave adequate length for terminations",
        ],
        hazardsAddressed: [],
        controlsApplied: ["competent_persons"],
      },
      {
        stepNumber: 4,
        activity: "Secure and support cables",
        keyPoints: [
          "Fix cables at intervals per manufacturer guidance",
          "Do not over-tighten clips (damage to sheath)",
          "Ensure cables are dressed neatly",
          "Group circuits appropriately (EMC considerations)",
          "Apply cable labels at both ends and accessible points",
        ],
        hazardsAddressed: ["electrical_fire"],
        controlsApplied: ["cable_protection"],
      },
      {
        stepNumber: 5,
        activity: "Make terminations",
        keyPoints: [
          "Strip cable using appropriate tools (avoid damage to conductors)",
          "Use correct size terminals and glands",
          "Ensure proper torque on connections",
          "Fit cable glands correctly maintaining IP rating",
          "Terminate earth conductors to correct point",
        ],
        hazardsAddressed: ["electric_shock_indirect", "electrical_fire"],
        controlsApplied: ["competent_persons", "earthing_bonding"],
      },
    ],
    postWorkChecks: [
      "Visual inspection of installed cables",
      "Check all connections are tight",
      "Verify correct labelling",
      "Test cable insulation resistance before energisation",
      "Update as-built drawings",
    ],
    competencyRequired: [
      "Qualified electrician or cable jointer",
      "Training in specific cable type if specialist",
      "Working at height trained (if applicable)",
    ],
    equipmentRequired: [
      "Cable drum stand and rollers",
      "Pulling equipment (winch, rope)",
      "Cable stripper and crimping tools",
      "Torque screwdriver",
      "Cable glands and accessories",
      "CAT scanner for concealed routes",
    ],
    ppeRequired: [
      "Safety boots",
      "Safety glasses",
      "Gloves (manual handling)",
      "Hi-vis vest",
    ],
    emergencyProcedures: [
      "If existing live cable struck: Evacuate area, isolate supply, report",
      "Manual handling injury: First aid, report to supervisor",
    ],
    regulatoryReferences: [
      "BS 7671 Section 521, 522, 523, 524",
      "Electricity at Work Regulations 1989 Reg 7",
    ],
    isActive: true,
    sortOrder: 3,
  },

  // ============================================
  // DISTRIBUTION BOARD INSTALLATION
  // ============================================
  {
    id: "method-db-installation",
    code: "distribution_board",
    name: "Distribution Board Installation",
    description: "Installation and modification of electrical distribution boards",
    applicableWorkTypes: [
      "installation",
      "modification",
      "upgrade",
    ],
    preWorkChecks: [
      "Confirm incoming supply is isolated and locked off",
      "Verify correct DB type and rating for application",
      "Check mounting location is suitable (height, ventilation, access)",
      "Review circuit schedule and labelling requirements",
      "Ensure all circuit protective devices are available",
      "Confirm max Zs values for circuits to be connected",
    ],
    steps: [
      {
        stepNumber: 1,
        activity: "Install distribution board enclosure",
        keyPoints: [
          "Mount at correct height (1.2-1.4m to switches typically)",
          "Ensure secure fixing to solid structure",
          "Level and plumb the enclosure",
          "Make cable entries maintaining IP rating",
        ],
        hazardsAddressed: [],
        controlsApplied: ["competent_persons"],
      },
      {
        stepNumber: 2,
        activity: "Install busbars and main switch",
        keyPoints: [
          "Follow manufacturer assembly instructions",
          "Torque all busbar connections to specification",
          "Verify main switch rating is adequate",
          "Install surge protection device if specified",
        ],
        hazardsAddressed: ["arc_flash", "electrical_fire"],
        controlsApplied: ["circuit_protection"],
      },
      {
        stepNumber: 3,
        activity: "Install circuit protective devices",
        keyPoints: [
          "Install MCBs, RCBOs as per circuit schedule",
          "Verify correct rating and type for each circuit",
          "Snap devices firmly onto DIN rail",
          "Install RCDs protecting correct circuits",
          "Maintain correct busbar connections",
        ],
        hazardsAddressed: ["electrical_fire", "electric_shock_indirect"],
        controlsApplied: ["circuit_protection", "rcd_protection"],
      },
      {
        stepNumber: 4,
        activity: "Connect circuits",
        keyPoints: [
          "Terminate cables neatly using correct entry points",
          "Use appropriate cable management",
          "Torque all connections to specification",
          "Connect earth bars with correct sized conductors",
          "Maintain clear separation between sections",
        ],
        hazardsAddressed: ["electrical_fire", "electric_shock_indirect"],
        controlsApplied: ["earthing_bonding", "competent_persons"],
      },
      {
        stepNumber: 5,
        activity: "Connect incoming supply",
        keyPoints: [
          "Verify isolation before connecting",
          "Size and terminate main cables correctly",
          "Install main earth connection",
          "Verify tails are to correct specification",
        ],
        hazardsAddressed: ["electric_shock_direct", "arc_flash"],
        controlsApplied: ["isolation", "lockout_tagout"],
      },
      {
        stepNumber: 6,
        activity: "Complete labelling",
        keyPoints: [
          "Label all circuits clearly on schedule",
          "Add warning labels as required",
          "Include installer details and date",
          "Display hazard warnings for isolation requirements",
        ],
        hazardsAddressed: [],
        controlsApplied: ["safe_system_of_work"],
      },
    ],
    postWorkChecks: [
      "Carry out full initial verification tests",
      "Verify all connections are tight (torque check)",
      "Confirm RCD operation",
      "Complete and issue installation certificate",
      "Provide user with circuit schedule",
      "Close and secure covers",
    ],
    competencyRequired: [
      "Qualified electrician with current 18th Edition",
      "Experience in distribution board installation",
      "Understanding of protective device coordination",
    ],
    equipmentRequired: [
      "Torque screwdriver set",
      "Installation tester",
      "Cable preparation tools",
      "Spirit level",
      "Labelling system",
    ],
    ppeRequired: [
      "Safety boots",
      "Safety glasses",
      "Insulated gloves (if working near live parts)",
    ],
    emergencyProcedures: [
      "Electric shock: Isolate supply, call emergency services",
      "Arc flash: Evacuate, provide first aid, call 999",
    ],
    regulatoryReferences: [
      "BS 7671 Part 5, Part 6",
      "BS EN 61439 (Assemblies for power distribution)",
      "Electricity at Work Regulations 1989",
    ],
    isActive: true,
    sortOrder: 4,
  },

  // ============================================
  // WORKING NEAR OVERHEAD LINES
  // ============================================
  {
    id: "method-overhead-lines",
    code: "overhead_lines",
    name: "Working Near Overhead Power Lines",
    description: "Safe system of work for construction activities near overhead electricity lines",
    applicableWorkTypes: [
      "construction",
      "groundworks",
      "scaffolding",
      "crane_operations",
    ],
    preWorkChecks: [
      "Identify all overhead lines on site (survey and DNO records)",
      "Determine voltage level and safe clearance distances",
      "Assess if work can be carried out without entering exclusion zones",
      "Contact DNO if lines need to be diverted, isolated, or protected",
      "Establish physical barriers marking exclusion zones",
      "Brief all site personnel on risks and exclusion zones",
    ],
    steps: [
      {
        stepNumber: 1,
        activity: "Establish exclusion zone",
        keyPoints: [
          "Minimum safe distance depends on voltage (6m for 400kV, 3m for 11kV)",
          "Mark zone with goal posts, barriers, and signage",
          "Use physical barriers that will not blow over",
          "Do not rely on bunting alone",
        ],
        hazardsAddressed: ["overhead_line_contact"],
        controlsApplied: ["exclusion_zones"],
      },
      {
        stepNumber: 2,
        activity: "Assess plant and equipment",
        keyPoints: [
          "Identify all plant that could breach exclusion zone",
          "Cranes, MEWPs, tipper lorries, excavators with extended arms",
          "Consider scaffolding and long materials (ladders, pipes)",
          "Fit height restrictors where possible",
        ],
        hazardsAddressed: ["overhead_line_contact"],
        controlsApplied: ["risk_assessment", "exclusion_zones"],
      },
      {
        stepNumber: 3,
        activity: "Implement crossing arrangements",
        keyPoints: [
          "Define safe crossing points if vehicles must pass under lines",
          "Install physical height barriers (goal posts) at crossings",
          "Consider buried cable alternative for temporary supplies",
          "Brief all drivers on crossing procedures",
        ],
        hazardsAddressed: ["overhead_line_contact"],
        controlsApplied: ["barriers_enclosures", "safe_system_of_work"],
      },
      {
        stepNumber: 4,
        activity: "Supervise high-risk activities",
        keyPoints: [
          "Banksman required for crane/MEWP near lines",
          "No lifting over lines without DNO authorisation",
          "Tipper bodies must be lowered before movement",
          "Scaffold erection sequenced away from lines",
        ],
        hazardsAddressed: ["overhead_line_contact"],
        controlsApplied: ["supervision", "permit_to_work"],
      },
      {
        stepNumber: 5,
        activity: "Emergency response",
        keyPoints: [
          "If contact occurs: Stay in vehicle/machine if possible",
          "If must exit: Jump clear, land with feet together, shuffle away",
          "Do NOT touch vehicle and ground simultaneously",
          "Keep others 10m away until DNO confirms line isolated",
        ],
        hazardsAddressed: ["overhead_line_contact"],
        controlsApplied: ["emergency_procedures"],
      },
    ],
    postWorkChecks: [
      "Confirm all barriers and signage remain in place",
      "Review exclusion zone effectiveness regularly",
      "Debrief any incidents or near misses",
      "Maintain barriers until completion of works",
    ],
    competencyRequired: [
      "Site manager trained in overhead line risks",
      "Crane/MEWP operators briefed on specific risks",
      "Banksmen trained in overhead line proximity procedures",
    ],
    equipmentRequired: [
      "Goal posts and barriers for exclusion zone",
      "Warning signs",
      "Height restrictors for vehicles",
      "Two-way radios for banksmen",
    ],
    ppeRequired: [
      "Standard site PPE",
      "Hi-vis essential near traffic routes",
    ],
    emergencyProcedures: [
      "Contact with lines: Keep 10m away, call DNO and 999 immediately",
      "If in vehicle that contacts line: Stay inside, warn others away, wait for DNO",
      "If must exit: Jump clear keeping feet together, shuffle away",
      "Fire from contact: Evacuate area, call fire brigade",
    ],
    regulatoryReferences: [
      "HSE GS6 Avoiding Danger from Overhead Power Lines",
      "Electricity at Work Regulations 1989 Reg 14",
      "CDM Regulations 2015",
    ],
    isActive: true,
    sortOrder: 5,
  },
];

export function getMethodByCode(code: string): ElectricalMethodTemplate | undefined {
  return ELECTRICAL_METHOD_TEMPLATES.find((m) => m.code === code);
}

export function getMethodsForWorkType(workType: string): ElectricalMethodTemplate[] {
  return ELECTRICAL_METHOD_TEMPLATES.filter((m) =>
    m.applicableWorkTypes.includes(workType)
  );
}

export function getActiveMethods(): ElectricalMethodTemplate[] {
  return ELECTRICAL_METHOD_TEMPLATES.filter((m) => m.isActive);
}
