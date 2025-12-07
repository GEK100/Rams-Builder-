import type { WidgetType } from "@/types/widget";

/**
 * Trade Widgets for RAMS Builder
 *
 * CURRENT STATUS: Electrical-only focus
 * Other trades are defined but marked as isActive: false
 * This allows future expansion without code changes
 */

export const TRADE_WIDGETS: WidgetType[] = [
  // ============================================
  // ACTIVE TRADE - Electrical (Phase 1)
  // ============================================
  {
    id: "electrical",
    code: "electrical",
    name: "Electrical",
    description: "Electrical installation, wiring, and power distribution works",
    icon: "Zap",
    color: "#fbbf24", // Amber
    category: "core_building",
    defaultHazards: ["electric_shock_direct", "arc_flash", "electrical_fire", "testing_live_parts"],
    defaultMitigations: ["dead_working", "isolation", "lockout_tagout", "test_equipment_gs38"],
    isActive: true, // ACTIVE - Full knowledge base available
    sortOrder: 1,
  },

  // ============================================
  // INACTIVE TRADES - Future Phases
  // Code retained for future expansion
  // ============================================
  {
    id: "plumbing",
    code: "plumbing",
    name: "Plumbing",
    description: "Plumbing, pipework, and water system installation",
    icon: "Droplets",
    color: "#3b82f6", // Blue
    category: "core_building",
    defaultHazards: ["manual_handling", "hot_works", "confined_space", "slips_trips"],
    defaultMitigations: ["manual_handling_training", "hot_work_permit", "confined_space_entry"],
    isActive: false, // INACTIVE - Coming in future phase
    sortOrder: 2,
  },
  {
    id: "hvac",
    code: "hvac",
    name: "HVAC",
    description: "Heating, ventilation, and air conditioning installation",
    icon: "Wind",
    color: "#06b6d4", // Cyan
    category: "core_building",
    defaultHazards: ["working_at_height", "manual_handling", "refrigerant_exposure", "electrical"],
    defaultMitigations: ["access_equipment", "lifting_aids", "ppe_respiratory", "isolation"],
    isActive: false, // INACTIVE
    sortOrder: 3,
  },
  {
    id: "carpentry",
    code: "carpentry",
    name: "Carpentry",
    description: "Timber framing, joinery, and woodwork installation",
    icon: "Hammer",
    color: "#a16207", // Amber dark
    category: "core_building",
    defaultHazards: ["power_tools", "manual_handling", "dust", "cuts_abrasions"],
    defaultMitigations: ["tool_guards", "ppe_dust", "manual_handling_training", "first_aid"],
    isActive: false, // INACTIVE
    sortOrder: 4,
  },
  {
    id: "roofing",
    code: "roofing",
    name: "Roofing",
    description: "Roof installation, repair, and waterproofing works",
    icon: "Home",
    color: "#dc2626", // Red
    category: "core_building",
    defaultHazards: ["working_at_height", "falls", "weather", "manual_handling", "hot_works"],
    defaultMitigations: ["edge_protection", "harness", "weather_monitoring", "hot_work_permit"],
    isActive: false, // INACTIVE
    sortOrder: 5,
  },
  {
    id: "masonry",
    code: "masonry",
    name: "Masonry",
    description: "Brickwork, blockwork, and stonework construction",
    icon: "Boxes",
    color: "#78716c", // Stone
    category: "core_building",
    defaultHazards: ["manual_handling", "falling_objects", "dust", "scaffold_collapse"],
    defaultMitigations: ["lifting_aids", "exclusion_zones", "ppe_dust", "scaffold_inspection"],
    isActive: false, // INACTIVE
    sortOrder: 6,
  },

  // Specialist
  {
    id: "demolition",
    code: "demolition",
    name: "Demolition",
    description: "Structural demolition and strip-out works",
    icon: "Trash2",
    color: "#ef4444", // Red
    category: "specialist",
    defaultHazards: ["structural_collapse", "falling_objects", "dust", "asbestos", "noise"],
    defaultMitigations: ["structural_survey", "exclusion_zones", "dust_suppression", "asbestos_survey"],
    isActive: false, // INACTIVE
    sortOrder: 7,
  },
  {
    id: "asbestos",
    code: "asbestos",
    name: "Asbestos",
    description: "Licensed asbestos removal and encapsulation",
    icon: "AlertTriangle",
    color: "#7c3aed", // Purple
    category: "specialist",
    defaultHazards: ["asbestos_exposure", "respiratory", "contamination"],
    defaultMitigations: ["licensed_contractor", "enclosure", "decontamination", "air_monitoring"],
    isActive: false, // INACTIVE
    sortOrder: 8,
  },
  {
    id: "scaffolding",
    code: "scaffolding",
    name: "Scaffolding",
    description: "Scaffold erection, modification, and dismantling",
    icon: "Grid3x3",
    color: "#f97316", // Orange
    category: "specialist",
    defaultHazards: ["working_at_height", "falling_objects", "manual_handling", "scaffold_collapse"],
    defaultMitigations: ["cisrs_trained", "inspection_regime", "edge_protection", "loading_limits"],
    isActive: false, // INACTIVE
    sortOrder: 9,
  },
  {
    id: "crane_lifting",
    code: "crane_lifting",
    name: "Crane/Lifting",
    description: "Crane operations and heavy lifting activities",
    icon: "Container",
    color: "#eab308", // Yellow
    category: "specialist",
    defaultHazards: ["struck_by", "crush", "overturning", "power_lines"],
    defaultMitigations: ["lift_plan", "appointed_person", "slinger_signaller", "exclusion_zones"],
    isActive: false, // INACTIVE
    sortOrder: 10,
  },

  // Finishing
  {
    id: "painting",
    code: "painting",
    name: "Painting",
    description: "Painting, decorating, and surface coating works",
    icon: "Paintbrush",
    color: "#ec4899", // Pink
    category: "finishing",
    defaultHazards: ["solvent_exposure", "working_at_height", "slips", "dermatitis"],
    defaultMitigations: ["ventilation", "access_equipment", "ppe_respiratory", "ppe_skin"],
    isActive: false, // INACTIVE
    sortOrder: 11,
  },
  {
    id: "flooring",
    code: "flooring",
    name: "Flooring",
    description: "Floor covering installation and finishing",
    icon: "Square",
    color: "#84cc16", // Lime
    category: "finishing",
    defaultHazards: ["manual_handling", "adhesive_exposure", "slips_trips", "knee_injuries"],
    defaultMitigations: ["lifting_aids", "ventilation", "housekeeping", "knee_pads"],
    isActive: false, // INACTIVE
    sortOrder: 12,
  },
  {
    id: "glazing",
    code: "glazing",
    name: "Glazing",
    description: "Glass installation, curtain walling, and fenestration",
    icon: "PanelTop",
    color: "#0ea5e9", // Sky
    category: "finishing",
    defaultHazards: ["manual_handling", "cuts", "falling_glass", "working_at_height"],
    defaultMitigations: ["lifting_equipment", "ppe_cut_resistant", "exclusion_zones", "access_equipment"],
    isActive: false, // INACTIVE
    sortOrder: 13,
  },
  {
    id: "plastering",
    code: "plastering",
    name: "Plastering",
    description: "Plastering, rendering, and dry lining works",
    icon: "Layers",
    color: "#f5f5f4", // Stone light
    category: "finishing",
    defaultHazards: ["manual_handling", "dust", "working_at_height", "dermatitis"],
    defaultMitigations: ["lifting_aids", "ppe_dust", "access_equipment", "ppe_skin"],
    isActive: false, // INACTIVE
    sortOrder: 14,
  },
];

export const WIDGET_CATEGORIES = {
  core_building: {
    name: "Core Building",
    description: "Primary construction trades",
    color: "#10b981",
  },
  specialist: {
    name: "Specialist",
    description: "Specialist and high-risk activities",
    color: "#f97316",
  },
  finishing: {
    name: "Finishing",
    description: "Finishing and fit-out trades",
    color: "#8b5cf6",
  },
} as const;

export function getWidgetByCode(code: string): WidgetType | undefined {
  return TRADE_WIDGETS.find((w) => w.code === code);
}

export function getWidgetsByCategory(category: string): WidgetType[] {
  return TRADE_WIDGETS.filter((w) => w.category === category);
}

/**
 * Get only active trade widgets (currently Electrical only)
 */
export function getActiveWidgets(): WidgetType[] {
  return TRADE_WIDGETS.filter((w) => w.isActive);
}

/**
 * Get active widgets by category
 */
export function getActiveWidgetsByCategory(category: string): WidgetType[] {
  return TRADE_WIDGETS.filter((w) => w.category === category && w.isActive);
}

// Alias for backwards compatibility
export const WIDGET_TYPES = TRADE_WIDGETS;

// Export active-only list for UI components
export const ACTIVE_TRADE_WIDGETS = TRADE_WIDGETS.filter((w) => w.isActive);
