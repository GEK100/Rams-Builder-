/**
 * Electrical Work Activities
 * Users select which activities are included in their RAMS
 * Each activity links to relevant hazards and controls
 */

import type { ElectricalHazard, ElectricalControl } from "./types";

export interface WorkActivity {
  id: string;
  code: string;
  name: string;
  description: string;
  category: WorkActivityCategory;
  /** Hazard codes that apply to this activity */
  hazardCodes: string[];
  /** Control codes that should be applied for this activity */
  controlCodes: string[];
  /** Key method statement points for this activity */
  methodPoints: string[];
  /** Competency requirements specific to this activity */
  competencyNotes?: string;
  /** Any permits typically required */
  permitsRequired?: string[];
  /** Typical PPE for this activity */
  typicalPPE: string[];
  isActive: boolean;
  sortOrder: number;
}

export type WorkActivityCategory =
  | "power_distribution"
  | "containment"
  | "cabling"
  | "lighting"
  | "controls_automation"
  | "fire_life_safety"
  | "security_access"
  | "data_comms"
  | "renewable_ev"
  | "earthing_protection"
  | "testing_commissioning"
  | "maintenance"
  | "high_risk"
  | "specialist"; // New category for specialist electrical work

export const ACTIVITY_CATEGORIES: Record<WorkActivityCategory, { name: string; description: string; color: string }> = {
  power_distribution: {
    name: "Power Distribution",
    description: "Switchgear, distribution boards, generators, UPS",
    color: "#f59e0b", // Amber
  },
  containment: {
    name: "Containment",
    description: "Cable tray, trunking, conduit, basket",
    color: "#3b82f6", // Blue
  },
  cabling: {
    name: "Cabling",
    description: "LV, HV, data, fire, control cables",
    color: "#10b981", // Emerald
  },
  lighting: {
    name: "Lighting",
    description: "General, emergency, external, controls",
    color: "#eab308", // Yellow
  },
  controls_automation: {
    name: "Controls & Automation",
    description: "BMS, DDC, PLC, VSD, motor controls, protocols",
    color: "#8b5cf6", // Purple
  },
  fire_life_safety: {
    name: "Fire & Life Safety",
    description: "Fire alarm, voice alarm, emergency systems",
    color: "#ef4444", // Red
  },
  security_access: {
    name: "Security & Access",
    description: "CCTV, access control, intruder alarms",
    color: "#6366f1", // Indigo
  },
  data_comms: {
    name: "Data & Comms",
    description: "Structured cabling, fibre, comms rooms",
    color: "#06b6d4", // Cyan
  },
  renewable_ev: {
    name: "Renewable & EV",
    description: "Solar PV, battery storage, EV chargers",
    color: "#22c55e", // Green
  },
  earthing_protection: {
    name: "Earthing & Protection",
    description: "Earthing, bonding, lightning, surge protection",
    color: "#78716c", // Stone
  },
  testing_commissioning: {
    name: "Testing & Commissioning",
    description: "Initial verification, EICR, PAT, commissioning",
    color: "#0ea5e9", // Sky
  },
  maintenance: {
    name: "Maintenance",
    description: "PPM, reactive, fault finding, repairs",
    color: "#f97316", // Orange
  },
  high_risk: {
    name: "High Risk Activities",
    description: "Live work, HV, confined space, working at height",
    color: "#dc2626", // Red
  },
  specialist: {
    name: "Specialist",
    description: "Trace heating, ATEX, cold rooms, PFC, instrumentation",
    color: "#a855f7", // Purple
  },
};

export const ELECTRICAL_ACTIVITIES: WorkActivity[] = [
  // ============================================
  // POWER DISTRIBUTION
  // ============================================
  {
    id: "act-db-installation",
    code: "distribution_board",
    name: "Distribution Board Installation",
    description: "Installation of consumer units, DB boards, and panel boards",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "arc_flash", "electrical_fire"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons", "circuit_protection"],
    methodPoints: [
      "Confirm incoming supply is isolated and locked off",
      "Mount board at correct height (switches 1.2-1.4m)",
      "Install protective devices per circuit schedule",
      "Torque all connections to specification",
      "Complete labelling and circuit chart",
      "Carry out initial verification tests before energisation",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves"],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "act-switchgear",
    code: "switchgear",
    name: "Switchgear Installation",
    description: "Installation of LV switchgear, isolators, and switches",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "arc_flash", "electrical_fire", "stored_energy"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "arc_flash_ppe", "competent_persons"],
    methodPoints: [
      "Review switchgear specification and single line diagram",
      "Ensure adequate access for installation and future maintenance",
      "Install on level, secure foundation",
      "Make cable terminations per manufacturer instructions",
      "Commission and test protection settings",
    ],
    competencyNotes: "Switchgear installation requires manufacturer training",
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE", "Insulated gloves"],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "act-generator",
    code: "generator",
    name: "Generator Installation",
    description: "Standby generators, changeover systems, and ATS",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "arc_flash", "electrical_fire"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons", "permit_to_work"],
    methodPoints: [
      "Coordinate with mechanical contractor for fuel and exhaust",
      "Install on anti-vibration mounts",
      "Connect control and power cables",
      "Commission ATS/changeover system",
      "Test under load conditions",
      "Provide operational training to client",
    ],
    permitsRequired: ["Hot work permit if welding required"],
    typicalPPE: ["Safety boots", "Safety glasses", "Hearing protection"],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "act-ups",
    code: "ups",
    name: "UPS Installation",
    description: "Uninterruptible power supplies and battery systems",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "stored_energy", "electric_burn"],
    controlCodes: ["dead_working", "isolation", "competent_persons", "emergency_procedures"],
    methodPoints: [
      "Ensure adequate ventilation for battery room",
      "Install UPS on level surface with clearance for airflow",
      "Connect battery strings per manufacturer diagram",
      "Commission and test battery capacity",
      "Set up monitoring and alarms",
    ],
    competencyNotes: "Battery handling training required - stored energy hazard",
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves", "Chemical resistant gloves for batteries"],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "act-temporary-supply",
    code: "temporary_supply",
    name: "Temporary Supply Installation",
    description: "Site electrics, temporary distribution, 110V systems",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "electric_shock_indirect", "electrical_fire", "wet_conditions"],
    controlCodes: ["reduced_voltage", "rcd_protection", "competent_persons", "maintenance_regime"],
    methodPoints: [
      "Assess site conditions and power requirements",
      "Use 110V CTE system for portable equipment",
      "Position distribution boards in dry, accessible locations",
      "Install RCD protection on all circuits",
      "Implement daily visual inspection regime",
      "Protect cables from damage and trip hazards",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Hi-vis"],
    isActive: true,
    sortOrder: 5,
  },

  // ============================================
  // CONTAINMENT
  // ============================================
  {
    id: "act-cable-tray",
    code: "cable_tray",
    name: "Cable Tray Installation",
    description: "Cable tray, ladder rack, and perforated tray systems",
    category: "containment",
    hazardCodes: ["falls_from_shock", "electric_shock_indirect"],
    controlCodes: ["dead_working", "isolation", "earthing_bonding", "competent_persons"],
    methodPoints: [
      "Survey route and mark fixing positions",
      "Install supports at maximum 1.5m centres (or per spec)",
      "Maintain 50mm clearance from other services",
      "Install earth continuity straps at joints",
      "Fire stop at compartment penetrations",
      "Label tray with circuit identification",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves", "Hard hat"],
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "act-cable-basket",
    code: "cable_basket",
    name: "Cable Basket Installation",
    description: "Wire mesh cable basket systems",
    category: "containment",
    hazardCodes: ["falls_from_shock"],
    controlCodes: ["competent_persons", "earthing_bonding"],
    methodPoints: [
      "Select basket size for cable fill capacity",
      "Install supports at maximum 1.2m centres",
      "Use appropriate couplers and connectors",
      "Maintain separation from other services",
      "Install covers where protection required",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves", "Hard hat"],
    isActive: true,
    sortOrder: 11,
  },
  {
    id: "act-trunking",
    code: "trunking",
    name: "Trunking Installation",
    description: "Metal and PVC trunking, dado trunking, floor trunking",
    category: "containment",
    hazardCodes: ["electric_shock_indirect"],
    controlCodes: ["earthing_bonding", "competent_persons"],
    methodPoints: [
      "Set out and mark trunking route",
      "Install at correct height for application",
      "Maintain continuity of earth via bonding links",
      "Install accessories (bends, tees) correctly",
      "Fire stop at compartment boundaries",
      "Segregate circuits per BS 7671 Chapter 52",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves"],
    isActive: true,
    sortOrder: 12,
  },
  {
    id: "act-conduit",
    code: "conduit",
    name: "Conduit Installation",
    description: "Steel conduit, PVC conduit, flexible conduit",
    category: "containment",
    hazardCodes: ["electric_shock_indirect"],
    controlCodes: ["earthing_bonding", "competent_persons"],
    methodPoints: [
      "Plan conduit route avoiding obstructions",
      "Use correct bending techniques (no kinks)",
      "Install draw wires during installation",
      "Ensure joints are mechanically and electrically sound",
      "Use appropriate boxes and accessories",
      "Maximum 10m between draw points",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves"],
    isActive: true,
    sortOrder: 13,
  },

  // ============================================
  // CABLING
  // ============================================
  {
    id: "act-lv-cabling",
    code: "lv_cabling",
    name: "LV Cable Installation",
    description: "Low voltage power cables (230V/400V), singles, SWA",
    category: "cabling",
    hazardCodes: ["electric_shock_direct", "electric_shock_indirect", "electrical_fire"],
    controlCodes: ["dead_working", "isolation", "cable_protection", "competent_persons"],
    methodPoints: [
      "Verify cable size matches design specification",
      "Calculate pulling tension - do not exceed limits",
      "Observe minimum bending radii",
      "Use cable lubricant for long pulls",
      "Support cables at appropriate intervals",
      "Label cables at both ends and accessible points",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves"],
    isActive: true,
    sortOrder: 20,
  },
  {
    id: "act-hv-cabling",
    code: "hv_cabling",
    name: "HV Cable Installation",
    description: "High voltage cables (11kV, 33kV)",
    category: "cabling",
    hazardCodes: ["electric_shock_direct", "arc_flash", "stored_energy"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "permit_to_work", "competent_persons"],
    methodPoints: [
      "HV authorised persons only",
      "Obtain permit to work before any activity",
      "Verify isolation at both ends",
      "Handle cables carefully - no sharp bends",
      "Install per manufacturer jointing instructions",
      "Pressure/soak test before energisation",
    ],
    competencyNotes: "HV Authorised Person status required",
    permitsRequired: ["HV Permit to Work"],
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE", "Insulated gloves (HV rated)"],
    isActive: true,
    sortOrder: 21,
  },
  {
    id: "act-fire-cable",
    code: "fire_cable",
    name: "Fire Performance Cable Installation",
    description: "FP200, MICC/Pyro, fire rated cables",
    category: "cabling",
    hazardCodes: ["electric_shock_direct", "electrical_fire"],
    controlCodes: ["dead_working", "isolation", "cable_protection", "competent_persons"],
    methodPoints: [
      "Use fire rated clips and fixings",
      "Maintain fire rating at penetrations",
      "MICC requires specialist termination skills",
      "Do not mix with standard cables in same containment",
      "Test insulation resistance after installation",
    ],
    competencyNotes: "MICC termination requires specific training",
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves"],
    isActive: true,
    sortOrder: 22,
  },
  {
    id: "act-control-cable",
    code: "control_cable",
    name: "Control & Instrumentation Cabling",
    description: "Multicore control cables, screened cables, signal cables",
    category: "cabling",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Segregate from power cables per EMC requirements",
      "Earth cable screens at one end only (typically panel end)",
      "Use appropriate glands maintaining screen continuity",
      "Avoid running parallel to power cables",
      "Label cores clearly at terminations",
      "Perform continuity and insulation tests",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 23,
  },
  {
    id: "act-data-cable",
    code: "data_cable",
    name: "Data Cable Installation",
    description: "Cat5e, Cat6, Cat6a structured cabling",
    category: "cabling",
    hazardCodes: [],
    controlCodes: ["competent_persons"],
    methodPoints: [
      "Handle cables carefully - do not exceed bend radius",
      "Do not exceed 25lb pulling tension",
      "Maintain separation from power cables",
      "Terminate per TIA/EIA standards",
      "Test and certify all links",
      "Maintain documentation and labelling",
    ],
    competencyNotes: "Manufacturer certification preferred for warranty",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 24,
  },
  {
    id: "act-fibre-cable",
    code: "fibre_cable",
    name: "Fibre Optic Installation",
    description: "Single mode, multimode fibre, splicing and termination",
    category: "cabling",
    hazardCodes: [],
    controlCodes: ["competent_persons"],
    methodPoints: [
      "Handle fibre carefully - very fragile",
      "Use fibre optic pulling grips",
      "Observe minimum bend radius (typically 30mm)",
      "Fusion splice or terminate in controlled environment",
      "Dispose of fibre offcuts safely (sharps hazard)",
      "Test with OTDR and power meter",
    ],
    competencyNotes: "Fibre splicing certification required",
    typicalPPE: ["Safety boots", "Safety glasses", "Dispose fibre safely"],
    isActive: true,
    sortOrder: 25,
  },

  // ============================================
  // LIGHTING
  // ============================================
  {
    id: "act-lighting-general",
    code: "lighting_general",
    name: "General Lighting Installation",
    description: "Commercial, industrial, and domestic lighting",
    category: "lighting",
    hazardCodes: ["electric_shock_direct", "falls_from_shock"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Confirm luminaire positions from drawings",
      "Install mounting accessories securely",
      "Make connections using appropriate connectors",
      "Aim and focus luminaires as required",
      "Test operation and dimming function",
      "Clean lenses before handover",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 30,
  },
  {
    id: "act-emergency-lighting",
    code: "emergency_lighting",
    name: "Emergency Lighting Installation",
    description: "Maintained, non-maintained, exit signs, central battery",
    category: "lighting",
    hazardCodes: ["electric_shock_direct", "falls_from_shock"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install per fire strategy and BS 5266",
      "Ensure coverage of escape routes and exits",
      "Position exit signs for clear visibility",
      "Connect to correct circuit (maintained vs non-maintained)",
      "Commission and perform 3-hour discharge test",
      "Provide log book and test schedule to client",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 31,
  },
  {
    id: "act-external-lighting",
    code: "external_lighting",
    name: "External Lighting Installation",
    description: "Floodlights, bollards, column lighting, festoon",
    category: "lighting",
    hazardCodes: ["electric_shock_direct", "wet_conditions", "falls_from_shock"],
    controlCodes: ["dead_working", "isolation", "rcd_protection", "competent_persons"],
    methodPoints: [
      "Verify IP rating suitable for location",
      "Install on secure foundations/brackets",
      "Use appropriate cable glands",
      "Ensure RCD protection for outdoor circuits",
      "Aim and adjust lighting as specified",
      "Consider light pollution and neighbours",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Waterproofs"],
    isActive: true,
    sortOrder: 32,
  },
  {
    id: "act-lighting-controls",
    code: "lighting_controls",
    name: "Lighting Controls Installation",
    description: "PIR sensors, daylight sensors, timers, scene controllers",
    category: "lighting",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Position sensors for optimal coverage",
      "Set time delays and lux levels",
      "Program scenes and schedules",
      "Test operation in various conditions",
      "Commission with end user",
      "Provide operating instructions",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 33,
  },
  {
    id: "act-dali",
    code: "dali_lighting",
    name: "DALI Lighting Systems",
    description: "Digital addressable lighting interface systems",
    category: "lighting",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install DALI bus wiring (polarity insensitive)",
      "Address all devices on the bus",
      "Configure groups and scenes in software",
      "Commission emergency lighting test function",
      "Test all scenarios and controls",
      "Provide system documentation and training",
    ],
    competencyNotes: "DALI commissioning software training required",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 34,
  },

  // ============================================
  // CONTROLS & AUTOMATION
  // ============================================
  {
    id: "act-bms-wiring",
    code: "bms_wiring",
    name: "BMS Wiring & Termination",
    description: "Building Management System field wiring, sensors, actuators",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install cables per BMS points schedule",
      "Segregate BMS cables from power",
      "Terminate sensors and actuators per manufacturer data",
      "Earth cable screens correctly",
      "Label all cables and terminations clearly",
      "Test loop resistance and polarity",
    ],
    competencyNotes: "BMS system training beneficial",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 40,
  },
  {
    id: "act-motor-installation",
    code: "motor_installation",
    name: "Motor Installation & Connection",
    description: "Motors, starters, DOL, star-delta, soft starts",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct", "arc_flash", "stored_energy"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons"],
    methodPoints: [
      "Check motor nameplate matches specification",
      "Verify starter type and settings",
      "Make power and control connections",
      "Check rotation direction before coupling",
      "Set overload protection correctly",
      "Perform insulation resistance test before energisation",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Hearing protection"],
    isActive: true,
    sortOrder: 41,
  },
  {
    id: "act-vsd",
    code: "vsd_installation",
    name: "VSD/VFD Installation",
    description: "Variable speed drives, frequency inverters",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct", "stored_energy", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons"],
    methodPoints: [
      "Install in ventilated location",
      "Use screened motor cable with correct gland",
      "Earth cable screen at both ends",
      "Program drive parameters per application",
      "Allow capacitor discharge time before access",
      "Commission and optimise performance",
    ],
    competencyNotes: "DC link capacitors retain charge - allow 10 mins after isolation",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 42,
  },
  {
    id: "act-control-panel",
    code: "control_panel",
    name: "Control Panel Wiring",
    description: "Panel building, control circuit wiring, terminations",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Follow panel layout and wiring diagrams",
      "Use correct ferrule sizes and labelling",
      "Route wires neatly in trunking/tray",
      "Torque terminals to specification",
      "Perform point-to-point continuity check",
      "Functional test before dispatch/energisation",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 43,
  },

  // ============================================
  // FIRE & LIFE SAFETY
  // ============================================
  {
    id: "act-fire-alarm",
    code: "fire_alarm",
    name: "Fire Alarm Installation",
    description: "Detection, sounders, call points, control panels",
    category: "fire_life_safety",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install devices per fire strategy layout",
      "Use fire rated cable and clips throughout",
      "Maintain loop integrity - no T-offs on addressable",
      "Commission panel and address all devices",
      "Perform cause and effect testing",
      "Issue commissioning certificate",
    ],
    competencyNotes: "Fire alarm competent person certification (FIA) recommended",
    permitsRequired: ["Hot work permit may be required for detector removal"],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 50,
  },
  {
    id: "act-voice-alarm",
    code: "voice_alarm",
    name: "Voice Alarm / PA-VA Systems",
    description: "Public address and voice alarm systems",
    category: "fire_life_safety",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install speakers per acoustic design",
      "Use fire rated cables for voice alarm function",
      "Configure zones and routing",
      "Commission speech intelligibility testing (STIPA)",
      "Integrate with fire alarm panel",
      "Test emergency announcements",
    ],
    competencyNotes: "Voice alarm competency required",
    typicalPPE: ["Safety boots", "Safety glasses", "Hearing protection"],
    isActive: true,
    sortOrder: 51,
  },
  {
    id: "act-emergency-systems",
    code: "emergency_systems",
    name: "Emergency Systems",
    description: "Disabled refuge, firefighter communication, AOVs",
    category: "fire_life_safety",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install per fire strategy requirements",
      "Test two-way communication at all outstations",
      "Verify AOV operation and reset",
      "Commission with fire alarm interface",
      "Provide handover documentation and training",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 52,
  },

  // ============================================
  // SECURITY & ACCESS
  // ============================================
  {
    id: "act-cctv",
    code: "cctv",
    name: "CCTV Installation",
    description: "Cameras, NVRs, monitors, analytics",
    category: "security_access",
    hazardCodes: ["electric_shock_direct", "falls_from_shock"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Position cameras per security consultant layout",
      "Ensure adequate lighting or use IR cameras",
      "Install cables with segregation from power",
      "Configure NVR recording and retention",
      "Set up analytics and alerts",
      "Commission with security team",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 60,
  },
  {
    id: "act-access-control",
    code: "access_control",
    name: "Access Control Installation",
    description: "Card readers, door controllers, turnstiles",
    category: "security_access",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Coordinate door hardware with architectural ironmongery",
      "Install readers at correct height",
      "Program access levels and time zones",
      "Test fail-safe/fail-secure operation",
      "Integrate with fire alarm for emergency release",
      "Commission with security and fire teams",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 61,
  },
  {
    id: "act-intruder-alarm",
    code: "intruder_alarm",
    name: "Intruder Alarm Installation",
    description: "PIRs, door contacts, control panels, monitoring",
    category: "security_access",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install devices per security specification",
      "Configure zones and partitions",
      "Set up ARC signalling",
      "Test all detectors and entry/exit routes",
      "Commission with police URN if applicable",
      "Provide user codes and training",
    ],
    competencyNotes: "NSI/SSAIB certification required for insurance compliance",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 62,
  },

  // ============================================
  // DATA & COMMS
  // ============================================
  {
    id: "act-structured-cabling",
    code: "structured_cabling",
    name: "Structured Cabling Systems",
    description: "Patch panels, racks, outlets, horizontal cabling",
    category: "data_comms",
    hazardCodes: [],
    controlCodes: ["competent_persons"],
    methodPoints: [
      "Install containment and outlets",
      "Pull cables observing bend radius and tension limits",
      "Terminate patch panels per colour code",
      "Test and certify all links",
      "Label as per naming convention",
      "Provide test results and warranty",
    ],
    competencyNotes: "Manufacturer certification for warranty",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 70,
  },
  {
    id: "act-comms-room",
    code: "comms_room",
    name: "Comms Room Fit-Out",
    description: "Server racks, PDUs, patch panels, earthing",
    category: "data_comms",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "earthing_bonding", "competent_persons"],
    methodPoints: [
      "Install racks per layout drawing",
      "Fit PDUs with correct load capacity",
      "Install structured cabling infrastructure",
      "Earth racks to building earth system",
      "Coordinate cooling requirements",
      "Test and commission all systems",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 71,
  },

  // ============================================
  // RENEWABLE & EV
  // ============================================
  {
    id: "act-solar-pv",
    code: "solar_pv",
    name: "Solar PV Installation",
    description: "Panels, inverters, DC/AC systems, grid connection",
    category: "renewable_ev",
    hazardCodes: ["electric_shock_direct", "falls_from_shock", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "competent_persons", "barriers_enclosures"],
    methodPoints: [
      "Install panels per structural engineer design",
      "DC cables cannot be made fully dead in daylight",
      "Install DC isolators at array and inverter",
      "Commission inverter and monitoring",
      "Apply G98/G99 notification",
      "Provide handover documentation",
    ],
    competencyNotes: "MCS certification required for FIT/SEG payments",
    permitsRequired: ["DNO application for G99 systems"],
    typicalPPE: ["Safety boots", "Safety glasses", "Fall protection", "Insulated gloves"],
    isActive: true,
    sortOrder: 80,
  },
  {
    id: "act-ev-charger",
    code: "ev_charger",
    name: "EV Charger Installation",
    description: "AC chargers, DC rapid chargers, load management",
    category: "renewable_ev",
    hazardCodes: ["electric_shock_direct", "electric_shock_indirect"],
    controlCodes: ["dead_working", "isolation", "rcd_protection", "competent_persons"],
    methodPoints: [
      "Install dedicated circuit from distribution board",
      "Use correct cable size for charge rate",
      "Install Type A RCD (or Type B for some DC units)",
      "Commission charger and set up user accounts",
      "Apply for OZEV grant if applicable",
      "Provide user guide and certification",
    ],
    competencyNotes: "EV charger specific training recommended",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 81,
  },

  // ============================================
  // EARTHING & PROTECTION
  // ============================================
  {
    id: "act-earthing",
    code: "earthing",
    name: "Earthing Systems",
    description: "Earth electrodes, main earthing terminal, bonding",
    category: "earthing_protection",
    hazardCodes: ["electric_shock_indirect"],
    controlCodes: ["earthing_bonding", "competent_persons"],
    methodPoints: [
      "Install earth electrode(s) per design",
      "Test electrode resistance (<200Ω for TT, or per spec)",
      "Connect main earthing terminal",
      "Install main protective bonding",
      "Install supplementary bonding where required",
      "Record all test results",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 90,
  },
  {
    id: "act-lightning-protection",
    code: "lightning_protection",
    name: "Lightning Protection",
    description: "Air terminals, down conductors, earth terminations",
    category: "earthing_protection",
    hazardCodes: ["electric_shock_direct", "falls_from_shock"],
    controlCodes: ["competent_persons", "earthing_bonding"],
    methodPoints: [
      "Install per BS EN 62305 risk assessment",
      "Position air terminals at highest points",
      "Route down conductors avoiding sharp bends",
      "Install test clamps at accessible height",
      "Bond to building steelwork and services",
      "Test and certify system",
    ],
    competencyNotes: "ATLAS certification recommended",
    typicalPPE: ["Safety boots", "Safety glasses", "Fall protection"],
    isActive: true,
    sortOrder: 91,
  },

  // ============================================
  // TESTING & COMMISSIONING
  // ============================================
  {
    id: "act-initial-verification",
    code: "initial_verification",
    name: "Initial Verification Testing",
    description: "New installation testing per BS 7671",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "testing_live_parts", "test_equipment_failure"],
    controlCodes: ["dead_working", "test_equipment_gs38", "test_equipment_inspection", "competent_persons"],
    methodPoints: [
      "Visual inspection before testing",
      "Dead tests: continuity, insulation resistance, polarity",
      "Live tests: Zs, RCD, prospective fault current",
      "Use GS38 compliant test equipment",
      "Complete all schedules and certificate",
      "Issue EIC to client",
    ],
    competencyNotes: "C&G 2391 or equivalent required",
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves"],
    isActive: true,
    sortOrder: 100,
  },
  {
    id: "act-eicr",
    code: "eicr",
    name: "Periodic Inspection & Testing",
    description: "EICR, condition reports, 5-yearly testing",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "testing_live_parts", "test_equipment_failure"],
    controlCodes: ["dead_working", "test_equipment_gs38", "test_equipment_inspection", "competent_persons"],
    methodPoints: [
      "Review previous reports and documentation",
      "Perform visual inspection of accessible parts",
      "Sample test circuits per guidance",
      "Identify and code observations (C1, C2, C3, FI)",
      "Issue EICR with recommendations",
      "Advise client on remedial works",
    ],
    competencyNotes: "C&G 2391 or equivalent required",
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves"],
    isActive: true,
    sortOrder: 101,
  },
  {
    id: "act-pat",
    code: "pat_testing",
    name: "PAT Testing",
    description: "Portable appliance testing, equipment inspection",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "test_equipment_failure"],
    controlCodes: ["test_equipment_inspection", "competent_persons"],
    methodPoints: [
      "Visual inspection for damage and defects",
      "Earth continuity test (Class I)",
      "Insulation resistance test",
      "Functional/operational checks",
      "Apply pass/fail labels with date",
      "Record results and issue report",
    ],
    competencyNotes: "PAT testing training required",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 102,
  },
  {
    id: "act-commissioning",
    code: "commissioning",
    name: "System Commissioning",
    description: "Full system commissioning, witnessed tests, handover",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "arc_flash"],
    controlCodes: ["safe_system_of_work", "permit_to_work", "competent_persons"],
    methodPoints: [
      "Prepare commissioning procedures",
      "Verify all installation works complete",
      "Energise systems in controlled sequence",
      "Perform functional testing",
      "Conduct witnessed tests with client",
      "Complete O&M manuals and handover",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 103,
  },
  {
    id: "act-thermal-imaging",
    code: "thermal_imaging",
    name: "Thermal Imaging Survey",
    description: "Infrared surveys of electrical systems",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "arc_flash"],
    controlCodes: ["competent_persons", "barriers_enclosures"],
    methodPoints: [
      "Survey under normal load conditions",
      "Remove covers with system energised (risk assess)",
      "Scan all connections and equipment",
      "Record thermal anomalies",
      "Provide report with images and recommendations",
      "Re-survey after remedial works",
    ],
    competencyNotes: "Thermography certification (Level 1+) required",
    permitsRequired: ["Permit may be required for cover removal"],
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE"],
    isActive: true,
    sortOrder: 104,
  },

  // ============================================
  // MAINTENANCE
  // ============================================
  {
    id: "act-ppm",
    code: "planned_maintenance",
    name: "Planned Preventive Maintenance",
    description: "Scheduled maintenance, cleaning, checks",
    category: "maintenance",
    hazardCodes: ["electric_shock_direct", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "safe_system_of_work"],
    methodPoints: [
      "Follow PPM schedule and procedures",
      "Isolate and lock off before work",
      "Clean equipment and check connections",
      "Replace consumables (filters, lamps)",
      "Record findings and update asset register",
      "Report any defects requiring repair",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 110,
  },
  {
    id: "act-fault-finding",
    code: "fault_finding",
    name: "Fault Finding & Diagnosis",
    description: "Tracing and diagnosing electrical faults",
    category: "maintenance",
    hazardCodes: ["electric_shock_direct", "testing_live_parts", "arc_flash"],
    controlCodes: ["safe_system_of_work", "test_equipment_gs38", "competent_persons"],
    methodPoints: [
      "Gather information on symptoms and history",
      "Isolate where possible for initial checks",
      "Use systematic approach to locate fault",
      "Live testing only if dead testing impractical",
      "Use approved test equipment (GS38)",
      "Document findings and repair actions",
    ],
    competencyNotes: "Experienced electrician - may require live working",
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves"],
    isActive: true,
    sortOrder: 111,
  },
  {
    id: "act-reactive-repair",
    code: "reactive_repair",
    name: "Reactive Maintenance & Repairs",
    description: "Breakdown repairs, emergency call-outs",
    category: "maintenance",
    hazardCodes: ["electric_shock_direct", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons"],
    methodPoints: [
      "Assess fault and make area safe",
      "Isolate and lock off before repair",
      "Replace faulty components",
      "Test before returning to service",
      "Document repair and parts used",
      "Advise client if further work needed",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 112,
  },

  // ============================================
  // HIGH RISK ACTIVITIES
  // ============================================
  {
    id: "act-safe-isolation",
    code: "safe_isolation",
    name: "Safe Isolation",
    description: "Core isolation procedure for all electrical work",
    category: "high_risk",
    hazardCodes: ["electric_shock_direct", "stored_energy", "test_equipment_failure"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "test_equipment_gs38", "test_equipment_inspection"],
    methodPoints: [
      "Identify circuit and all sources of supply",
      "Switch off and isolate",
      "Lock off with personal lock and tag",
      "Prove voltage indicator on known live source",
      "Test for dead at point of work",
      "Re-prove voltage indicator",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Insulated gloves (if risk of flashover)"],
    isActive: true,
    sortOrder: 120,
  },
  {
    id: "act-live-working",
    code: "live_working",
    name: "Live Working",
    description: "Work on or near energised systems (when unavoidable)",
    category: "high_risk",
    hazardCodes: ["electric_shock_direct", "arc_flash", "electric_burn"],
    controlCodes: ["safe_system_of_work", "permit_to_work", "competent_persons", "insulating_gloves", "arc_flash_ppe", "barriers_enclosures"],
    methodPoints: [
      "Confirm live work is justified (unreasonable to work dead)",
      "Complete live working risk assessment",
      "Obtain permit to work",
      "Use insulated tools and PPE",
      "Install barriers to protect others",
      "Work with accompaniment where required",
    ],
    competencyNotes: "Only experienced, competent persons. Must be justified per Reg 14",
    permitsRequired: ["Live Working Permit"],
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE", "Insulating gloves", "Insulated tools"],
    isActive: true,
    sortOrder: 121,
  },
  {
    id: "act-hv-switching",
    code: "hv_switching",
    name: "HV Switching Operations",
    description: "High voltage switching, isolation, earthing",
    category: "high_risk",
    hazardCodes: ["electric_shock_direct", "arc_flash", "stored_energy"],
    controlCodes: ["permit_to_work", "competent_persons", "lockout_tagout", "arc_flash_ppe"],
    methodPoints: [
      "HV Authorised Person only",
      "Obtain HV switching permit",
      "Follow switching schedule exactly",
      "Apply earths where required",
      "Confirm isolation before work",
      "Log all switching operations",
    ],
    competencyNotes: "HV Authorised Person status required",
    permitsRequired: ["HV Switching Permit", "Sanction for Work"],
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash suit", "HV insulating gloves", "Face shield"],
    isActive: true,
    sortOrder: 122,
  },
  {
    id: "act-working-at-height",
    code: "working_at_height",
    name: "Working at Height",
    description: "Electrical work from ladders, scaffolds, MEWPs",
    category: "high_risk",
    hazardCodes: ["falls_from_shock", "electric_shock_direct"],
    controlCodes: ["competent_persons", "safe_system_of_work"],
    methodPoints: [
      "Can the work be done at ground level?",
      "Select appropriate access equipment",
      "Inspect equipment before use",
      "Set up on stable, level ground",
      "Maintain 3 points of contact on ladders",
      "Consider rescue plan if fall occurs",
    ],
    competencyNotes: "Working at height training required. IPAF for MEWPs",
    typicalPPE: ["Safety boots", "Hard hat", "Fall arrest harness if required"],
    isActive: true,
    sortOrder: 123,
  },
  {
    id: "act-confined-space",
    code: "confined_space",
    name: "Electrical Work in Confined Spaces",
    description: "Work in tanks, chambers, ducts, risers",
    category: "high_risk",
    hazardCodes: ["electric_shock_direct", "confined_space_electrical"],
    controlCodes: ["reduced_voltage", "selv_pelv", "permit_to_work", "competent_persons"],
    methodPoints: [
      "Complete confined space risk assessment",
      "Obtain confined space permit",
      "Use reduced voltage or SELV/PELV",
      "Ensure adequate ventilation",
      "Station top person at entry point",
      "Have rescue plan and equipment ready",
    ],
    competencyNotes: "Confined space training required",
    permitsRequired: ["Confined Space Entry Permit"],
    typicalPPE: ["Safety boots", "Hard hat", "Harness", "Gas monitor"],
    isActive: true,
    sortOrder: 124,
  },
  {
    id: "act-overhead-lines",
    code: "overhead_lines",
    name: "Work Near Overhead Lines",
    description: "Construction activities near overhead power lines",
    category: "high_risk",
    hazardCodes: ["overhead_line_contact"],
    controlCodes: ["exclusion_zones", "safe_system_of_work", "competent_persons"],
    methodPoints: [
      "Identify all overhead lines on site",
      "Determine voltage and safe distances",
      "Establish physical exclusion zones",
      "Brief all personnel and plant operators",
      "Use goal posts at crossing points",
      "Contact DNO if work within exclusion zone",
    ],
    typicalPPE: ["Safety boots", "Hard hat", "Hi-vis"],
    isActive: true,
    sortOrder: 125,
  },
  {
    id: "act-underground-cables",
    code: "underground_cables",
    name: "Excavation Near Underground Cables",
    description: "Cable avoidance, hand digging, cable protection",
    category: "high_risk",
    hazardCodes: ["underground_cable_strike"],
    controlCodes: ["cable_avoidance_tools", "safe_system_of_work", "competent_persons"],
    methodPoints: [
      "Obtain utility records and plans",
      "Scan with CAT and Genny before digging",
      "Mark cable positions on ground",
      "Hand dig within 500mm of indicated cables",
      "Use insulated tools near cables",
      "Report any cable strikes immediately",
    ],
    typicalPPE: ["Safety boots", "Hard hat", "Hi-vis", "Gloves"],
    isActive: true,
    sortOrder: 126,
  },

  // ============================================
  // ACCESSORIES & FINAL FIX
  // ============================================
  {
    id: "act-socket-installation",
    code: "socket_installation",
    name: "Socket & Accessory Installation",
    description: "Sockets, switches, FCUs, connection units",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Confirm correct circuit and isolation",
      "Install back boxes at correct height",
      "Make connections - ensure correct polarity",
      "Secure faceplates without overtightening",
      "Test operation and polarity",
      "Apply blanking plates to unused knockouts",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 6,
  },

  // ============================================
  // SPECIALIST - BMS EXPANDED
  // ============================================
  {
    id: "act-bms-head-end",
    code: "bms_head_end",
    name: "BMS Head End / Supervisory System",
    description: "Server installation, Niagara/Trend/Desigo software, graphics configuration",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install server hardware in comms room rack",
      "Configure network connectivity (static IP)",
      "Install and license supervisory software",
      "Import site graphics and floor plans",
      "Configure user access levels and permissions",
      "Set up alarm routing and email notifications",
      "Commission trends and data logging",
    ],
    competencyNotes: "Manufacturer certification required (Tridium Niagara, Trend, Siemens)",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 44,
  },
  {
    id: "act-bms-outstation",
    code: "bms_outstation",
    name: "BMS Outstation / JACE Installation",
    description: "Network controllers, DDC controllers, IO modules in plant rooms",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install controller enclosure in plant room",
      "Mount DDC controller and I/O modules on DIN rail",
      "Install 24V AC/DC power supplies",
      "Wire interposing relays for 230V loads",
      "Configure controller IP address and protocol",
      "Download application programme",
      "Test all I/O points before going live",
    ],
    competencyNotes: "BMS manufacturer training essential",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 45,
  },
  {
    id: "act-bacnet-mstp",
    code: "bacnet_mstp",
    name: "BACnet MS/TP Network Wiring",
    description: "Shielded twisted pair field bus wiring (Belden 9841), daisy chain topology",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["competent_persons"],
    methodPoints: [
      "Use Belden 9841 or equivalent shielded twisted pair",
      "Wire in daisy chain topology (In-Out-In-Out)",
      "Maintain polarity throughout (+to+, -to-)",
      "Install end-of-line (EOL) resistor at last device",
      "Earth cable screen at one end only (controller end)",
      "Maximum segment length 1200m at 76.8kbps",
      "Test network with BACnet diagnostic tool",
    ],
    competencyNotes: "Understanding of BACnet protocol essential",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 46,
  },
  {
    id: "act-modbus",
    code: "modbus_wiring",
    name: "Modbus RTU/RS485 Wiring",
    description: "Serial communication wiring for meters, generators, chillers",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["competent_persons"],
    methodPoints: [
      "Use 3-wire connection: Data+, Data-, Ground/Shield",
      "Wire in daisy chain (multi-drop) configuration",
      "Install 120Ω termination resistors at both ends",
      "Configure unique device addresses (1-247)",
      "Set matching baud rate on all devices",
      "Keep cable runs short and away from power cables",
      "Test communication with Modbus poll software",
    ],
    competencyNotes: "RS485 very sensitive to noise - routing critical",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 47,
  },
  {
    id: "act-bms-sensors",
    code: "bms_sensors",
    name: "BMS Sensor Installation",
    description: "Temperature sensors, humidity, CO2, pressure switches, flow switches",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install immersion sensors in brass pockets (pipe temp)",
      "Position duct sensors for representative air sample",
      "Install DPS tubes for air flow proving",
      "Mount CO2 sensors at breathing height (1.5m)",
      "Wire to correct controller input type (NTC, 0-10V, 4-20mA)",
      "Label all sensors with point reference",
      "Calibrate sensors per manufacturer data",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 48,
  },
  {
    id: "act-bms-actuators",
    code: "bms_actuators",
    name: "Actuator & Control Valve Installation",
    description: "Damper actuators, modulating valves, Belimo actuators",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Match actuator torque to damper/valve size",
      "Install actuator with correct rotation direction",
      "Wire control signal (0-10V or floating point)",
      "Wire auxiliary feedback contact if required",
      "Set actuator end stops and stroke",
      "Test full travel open to close",
      "Verify failsafe position (spring return)",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 49,
  },

  // ============================================
  // SPECIALIST - INDUSTRIAL & PROCESS
  // ============================================
  {
    id: "act-instrumentation",
    code: "instrumentation",
    name: "Instrumentation & 4-20mA Loops",
    description: "Process instrumentation, transmitters, 4-20mA current loops",
    category: "specialist",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Use instrumentation cable (individually screened pairs)",
      "Install 4-20mA transmitters per P&ID",
      "Wire loop from transmitter to controller (2-wire or 4-wire)",
      "Earth screens at one end only (panel end)",
      "Install isolators/barriers where required",
      "Calibrate loop: 4mA = 0%, 20mA = 100%",
      "Document loop sheets with tag numbers",
    ],
    competencyNotes: "CompEx or similar for hazardous areas",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 130,
  },
  {
    id: "act-flow-meters",
    code: "flow_meters",
    name: "Flow Meter Installation",
    description: "Electromagnetic (Magflow), ultrasonic, turbine flow meters",
    category: "specialist",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Ensure correct upstream/downstream straight pipe lengths",
      "Install grounding rings for Magflow meters",
      "Wire power supply and signal cables separately",
      "Configure meter for pipe size and fluid type",
      "Commission and verify reading against known flow",
      "Integrate output to BMS/SCADA (4-20mA or pulse)",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 131,
  },
  {
    id: "act-trace-heating",
    code: "trace_heating",
    name: "Trace Heating Installation",
    description: "Pipe frost protection and process temperature maintenance heating cables",
    category: "specialist",
    hazardCodes: ["electric_shock_direct", "electric_burn", "electrical_fire"],
    controlCodes: ["dead_working", "isolation", "competent_persons", "circuit_protection"],
    methodPoints: [
      "Select correct wattage per metre for application",
      "Tape heating cable to pipe with aluminium tape",
      "Install at specified spacing/pattern",
      "Terminate into cold-lead junction boxes",
      "Install capillary thermostat under insulation",
      "Connect to dedicated RCD-protected circuit",
      "Test insulation resistance before energisation",
      "Insulate after testing - coordinate with laggers",
    ],
    permitsRequired: ["Hot work permit if using heat shrink near combustibles"],
    typicalPPE: ["Safety boots", "Safety glasses", "Gloves"],
    isActive: true,
    sortOrder: 132,
  },
  {
    id: "act-atex",
    code: "atex_hazardous",
    name: "ATEX / Hazardous Area Installation",
    description: "Electrical work in explosive atmospheres (Zone 1, 2, 21, 22)",
    category: "specialist",
    hazardCodes: ["electric_shock_direct", "electrical_explosion"],
    controlCodes: ["permit_to_work", "competent_persons", "safe_system_of_work"],
    methodPoints: [
      "Verify zone classification from hazardous area drawing",
      "Select equipment with correct Ex rating for zone",
      "Use barrier glands filled with compound/putty",
      "Maintain IP rating of enclosures",
      "Use blue sheath cable for IS circuits",
      "Install Zener barriers for intrinsically safe circuits",
      "Complete IEC 60079-14 inspection checklist",
      "Issue Ex inspection certificate",
    ],
    competencyNotes: "CompEx certification essential (Ex01-Ex04)",
    permitsRequired: ["Hot work permit", "ATEX work permit"],
    typicalPPE: ["Safety boots", "Safety glasses", "Antistatic clothing"],
    isActive: true,
    sortOrder: 133,
  },
  {
    id: "act-pfc",
    code: "power_factor_correction",
    name: "Power Factor Correction",
    description: "Capacitor bank installation for power factor improvement",
    category: "specialist",
    hazardCodes: ["electric_shock_direct", "stored_energy", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "competent_persons"],
    methodPoints: [
      "Install PFC panel near main intake",
      "Connect to dedicated circuit with HRC fuses",
      "Install contactors for capacitor switching",
      "Configure automatic PFC controller (target PF 0.95+)",
      "Allow discharge time before accessing capacitors",
      "Commission and verify power factor improvement",
      "Monitor for harmonic resonance issues",
    ],
    competencyNotes: "Capacitors retain lethal charge - allow 5+ minutes discharge time",
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE", "Insulated gloves"],
    isActive: true,
    sortOrder: 134,
  },
  {
    id: "act-harmonic-filter",
    code: "harmonic_filter",
    name: "Harmonic Filter Installation",
    description: "Active and passive harmonic filters for power quality",
    category: "specialist",
    hazardCodes: ["electric_shock_direct", "stored_energy"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Perform power quality survey before installation",
      "Select filter type (active/passive) for harmonic profile",
      "Install filter panel at point of common coupling",
      "Configure filter for target harmonics (5th, 7th, etc.)",
      "Commission and verify harmonic reduction",
      "Monitor neutral current reduction",
    ],
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 135,
  },
  {
    id: "act-cold-room",
    code: "cold_room_electrics",
    name: "Cold Room & Refrigeration Electrics",
    description: "Freezer door heaters, man-trap alarms, compressor wiring",
    category: "specialist",
    hazardCodes: ["electric_shock_direct", "electric_shock_indirect"],
    controlCodes: ["dead_working", "isolation", "competent_persons", "rcd_protection"],
    methodPoints: [
      "Wire door heater mats to prevent seal freeze",
      "Install man-trap alarm button inside cold room",
      "Connect alarm to sounder and building BMS",
      "Wire defrost heaters to controller",
      "Install temperature monitoring sensors",
      "Ensure emergency door release is functional",
      "Test all safety systems before handover",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Warm clothing for cold room entry"],
    isActive: true,
    sortOrder: 136,
  },
  {
    id: "act-exothermic-weld",
    code: "exothermic_weld",
    name: "Exothermic Welding (Cadweld)",
    description: "Permanent copper-to-copper joints for earthing systems",
    category: "specialist",
    hazardCodes: ["electric_burn", "electrical_fire"],
    controlCodes: ["competent_persons", "safe_system_of_work"],
    methodPoints: [
      "Clean copper conductors thoroughly",
      "Select correct mould size for conductor combination",
      "Assemble mould and position conductors",
      "Add welding compound and ignition powder",
      "Ignite using flint gun - stand clear",
      "Allow joint to cool before handling",
      "Inspect joint for voids or cold joints",
      "Dispose of slag safely",
    ],
    competencyNotes: "Exothermic welding training required - controlled explosion",
    permitsRequired: ["Hot work permit"],
    typicalPPE: ["Safety boots", "Safety glasses", "Face shield", "Heat resistant gloves", "Fire extinguisher nearby"],
    isActive: true,
    sortOrder: 137,
  },
  {
    id: "act-ats-changeover",
    code: "ats_changeover",
    name: "ATS / Automatic Transfer Switch",
    description: "Generator changeover systems, automatic and manual transfer switches",
    category: "power_distribution",
    hazardCodes: ["electric_shock_direct", "arc_flash"],
    controlCodes: ["dead_working", "isolation", "lockout_tagout", "permit_to_work", "competent_persons"],
    methodPoints: [
      "Install ATS panel between mains and generator feeds",
      "Wire control circuits for mains sensing",
      "Configure transfer time delays",
      "Test changeover sequence: mains fail > gen start > transfer",
      "Test retransfer: mains restore > delay > transfer back",
      "Verify mechanical interlock prevents paralleling",
      "Commission full load transfer test",
    ],
    permitsRequired: ["Permit to work for energised changeover testing"],
    typicalPPE: ["Safety boots", "Safety glasses", "Arc flash PPE"],
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "act-load-bank",
    code: "load_bank_testing",
    name: "Generator Load Bank Testing",
    description: "Full load testing of standby generators using resistive load banks",
    category: "testing_commissioning",
    hazardCodes: ["electric_shock_direct", "electric_burn"],
    controlCodes: ["permit_to_work", "competent_persons", "safe_system_of_work"],
    methodPoints: [
      "Connect load bank to generator output",
      "Ensure adequate ventilation - load banks generate heat",
      "Start generator and allow to stabilise",
      "Apply load in steps (25%, 50%, 75%, 100%)",
      "Monitor voltage, frequency, oil pressure, temperature",
      "Run at full load for specified duration",
      "Record all readings for O&M documentation",
    ],
    permitsRequired: ["Hot work permit (heat generation)"],
    typicalPPE: ["Safety boots", "Safety glasses", "Hearing protection"],
    isActive: true,
    sortOrder: 105,
  },
  {
    id: "act-temporary-festoon",
    code: "temporary_festoon",
    name: "Temporary Festoon Lighting",
    description: "Construction site temporary lighting installations",
    category: "lighting",
    hazardCodes: ["electric_shock_direct", "electric_shock_indirect", "electrical_fire"],
    controlCodes: ["reduced_voltage", "rcd_protection", "maintenance_regime", "competent_persons"],
    methodPoints: [
      "Use 110V CTE festoon system on construction sites",
      "Suspend cables clear of work areas and traffic",
      "Use cable catenary systems, not conduit clips",
      "Install at height to prevent vandalism/damage",
      "Space luminaires per task lighting requirements",
      "Implement daily visual inspection regime",
      "Protect all joints and connections from water",
    ],
    typicalPPE: ["Safety boots", "Safety glasses", "Hard hat"],
    isActive: true,
    sortOrder: 35,
  },
  {
    id: "act-knx",
    code: "knx_system",
    name: "KNX System Installation",
    description: "KNX bus wiring for integrated building automation",
    category: "controls_automation",
    hazardCodes: ["electric_shock_direct"],
    controlCodes: ["dead_working", "isolation", "competent_persons"],
    methodPoints: [
      "Install green KNX bus cable (twisted pair)",
      "Wire in tree or line topology with line couplers",
      "Install bus power supply (max 64 devices per line)",
      "Address all devices using ETS software",
      "Download application programmes to devices",
      "Commission scene and schedule functions",
      "Provide client with project backup and documentation",
    ],
    competencyNotes: "KNX Partner certification recommended",
    typicalPPE: ["Safety boots", "Safety glasses"],
    isActive: true,
    sortOrder: 50,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getActivityByCode(code: string): WorkActivity | undefined {
  return ELECTRICAL_ACTIVITIES.find((a) => a.code === code);
}

export function getActivitiesByCategory(category: WorkActivityCategory): WorkActivity[] {
  return ELECTRICAL_ACTIVITIES.filter((a) => a.category === category && a.isActive);
}

export function getActiveActivities(): WorkActivity[] {
  return ELECTRICAL_ACTIVITIES.filter((a) => a.isActive);
}

export function getAllCategories(): WorkActivityCategory[] {
  return Object.keys(ACTIVITY_CATEGORIES) as WorkActivityCategory[];
}

/**
 * Get combined unique hazard codes for selected activities
 */
export function getHazardsForActivities(activityCodes: string[]): string[] {
  const hazards = new Set<string>();
  activityCodes.forEach((code) => {
    const activity = getActivityByCode(code);
    if (activity) {
      activity.hazardCodes.forEach((h) => hazards.add(h));
    }
  });
  return Array.from(hazards);
}

/**
 * Get combined unique control codes for selected activities
 */
export function getControlsForActivities(activityCodes: string[]): string[] {
  const controls = new Set<string>();
  activityCodes.forEach((code) => {
    const activity = getActivityByCode(code);
    if (activity) {
      activity.controlCodes.forEach((c) => controls.add(c));
    }
  });
  return Array.from(controls);
}

/**
 * Get combined PPE requirements for selected activities
 */
export function getPPEForActivities(activityCodes: string[]): string[] {
  const ppe = new Set<string>();
  activityCodes.forEach((code) => {
    const activity = getActivityByCode(code);
    if (activity) {
      activity.typicalPPE.forEach((p) => ppe.add(p));
    }
  });
  return Array.from(ppe);
}

/**
 * Get all permits required for selected activities
 */
export function getPermitsForActivities(activityCodes: string[]): string[] {
  const permits = new Set<string>();
  activityCodes.forEach((code) => {
    const activity = getActivityByCode(code);
    if (activity?.permitsRequired) {
      activity.permitsRequired.forEach((p) => permits.add(p));
    }
  });
  return Array.from(permits);
}
