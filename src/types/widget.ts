export type WidgetCategory = "core_building" | "specialist" | "finishing" | "safety" | "equipment";

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface WidgetType {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: WidgetCategory;
  defaultHazards: string[]; // Hazard codes
  defaultMitigations: string[]; // Mitigation codes
  isActive: boolean;
  sortOrder: number;
}

export interface Widget {
  id: string;
  ramsId: string;
  typeId: string;
  type: WidgetType;
  position: Position;
  dimensions: Dimensions;
  zIndex: number;
  parentWidgetId?: string;
  config: Record<string, unknown>;
  notes?: string;
  /** Selected work activity codes for this widget */
  selectedActivities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WidgetSuggestion {
  widgetType: WidgetType;
  reason: string;
  strength: number; // 0.0 to 1.0
  source: "context" | "relationship" | "ai";
}

export interface WidgetRelationship {
  id: string;
  sourceWidgetTypeId: string;
  suggestedWidgetTypeId: string;
  relationshipType: "requires" | "suggests" | "conflicts";
  strength: number;
  reason?: string;
}

// Canvas state for persistence
export interface CanvasState {
  zoom: number;
  position: Position;
  selectedWidgetIds: string[];
}
