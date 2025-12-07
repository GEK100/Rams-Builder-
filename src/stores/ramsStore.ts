import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { RAMS, ContextualAnswer, ContractorTypeInfo } from "@/types/rams";
import type { Widget, CanvasState } from "@/types/widget";
import type { RiskAssessment } from "@/types/risk";
import type { CDMInfo } from "@/types/cdm";
import { emptyCDMInfo } from "@/types/cdm";

interface RAMSState {
  // Current RAMS being edited
  currentRAMS: RAMS | null;
  widgets: Widget[];
  riskAssessments: RiskAssessment[];
  contextualAnswers: ContextualAnswer[];

  // Canvas state
  canvasState: CanvasState;

  // UI state
  isDirty: boolean;
  isSaving: boolean;
  selectedWidgetId: string | null;
  activeTab: "canvas" | "cdm" | "questions" | "risks" | "generate";

  // Actions
  setCurrentRAMS: (rams: RAMS | null) => void;
  updateRAMS: (updates: Partial<RAMS>) => void;
  updateCDMInfo: (updates: Partial<CDMInfo>) => void;
  updateContractorType: (updates: Partial<ContractorTypeInfo>) => void;

  // Widget actions
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  setSelectedWidget: (id: string | null) => void;

  // Canvas actions
  updateCanvasState: (updates: Partial<CanvasState>) => void;

  // Risk assessment actions
  addRiskAssessment: (risk: RiskAssessment) => void;
  updateRiskAssessment: (id: string, updates: Partial<RiskAssessment>) => void;
  removeRiskAssessment: (id: string) => void;

  // Contextual answer actions
  setContextualAnswer: (questionId: string, answer: ContextualAnswer["answer"]) => void;

  // UI actions
  setActiveTab: (tab: RAMSState["activeTab"]) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;

  // Reset
  reset: () => void;
}

const initialCanvasState: CanvasState = {
  zoom: 1,
  position: { x: 0, y: 0 },
  selectedWidgetIds: [],
};

export const useRAMSStore = create<RAMSState>()(
  immer((set) => ({
    currentRAMS: null,
    widgets: [],
    riskAssessments: [],
    contextualAnswers: [],
    canvasState: initialCanvasState,
    isDirty: false,
    isSaving: false,
    selectedWidgetId: null,
    activeTab: "canvas",

    setCurrentRAMS: (rams) =>
      set((state) => {
        state.currentRAMS = rams;
        state.widgets = rams?.widgets || [];
        state.riskAssessments = rams?.riskAssessments || [];
        state.contextualAnswers = rams?.contextualAnswers || [];
        state.canvasState = rams?.canvasData || initialCanvasState;
        state.isDirty = false;
      }),

    updateRAMS: (updates) =>
      set((state) => {
        if (state.currentRAMS) {
          Object.assign(state.currentRAMS, updates);
          state.isDirty = true;
        }
      }),

    updateCDMInfo: (updates) =>
      set((state) => {
        if (state.currentRAMS) {
          state.currentRAMS.cdmInfo = {
            ...state.currentRAMS.cdmInfo,
            ...updates,
          };
          state.isDirty = true;
        }
      }),

    updateContractorType: (updates) =>
      set((state) => {
        if (state.currentRAMS) {
          state.currentRAMS.contractorType = {
            ...state.currentRAMS.contractorType,
            ...updates,
          };
          state.isDirty = true;
        }
      }),

    addWidget: (widget) =>
      set((state) => {
        state.widgets.push(widget);
        state.isDirty = true;
      }),

    updateWidget: (id, updates) =>
      set((state) => {
        const index = state.widgets.findIndex((w) => w.id === id);
        if (index !== -1) {
          Object.assign(state.widgets[index], updates);
          state.isDirty = true;
        }
      }),

    removeWidget: (id) =>
      set((state) => {
        state.widgets = state.widgets.filter((w) => w.id !== id);
        state.riskAssessments = state.riskAssessments.filter((r) => r.widgetId !== id);
        if (state.selectedWidgetId === id) {
          state.selectedWidgetId = null;
        }
        state.isDirty = true;
      }),

    setSelectedWidget: (id) =>
      set((state) => {
        state.selectedWidgetId = id;
      }),

    updateCanvasState: (updates) =>
      set((state) => {
        Object.assign(state.canvasState, updates);
      }),

    addRiskAssessment: (risk) =>
      set((state) => {
        state.riskAssessments.push(risk);
        state.isDirty = true;
      }),

    updateRiskAssessment: (id, updates) =>
      set((state) => {
        const index = state.riskAssessments.findIndex((r) => r.id === id);
        if (index !== -1) {
          Object.assign(state.riskAssessments[index], updates);
          state.isDirty = true;
        }
      }),

    removeRiskAssessment: (id) =>
      set((state) => {
        state.riskAssessments = state.riskAssessments.filter((r) => r.id !== id);
        state.isDirty = true;
      }),

    setContextualAnswer: (questionId, answer) =>
      set((state) => {
        const existing = state.contextualAnswers.find((a) => a.questionId === questionId);
        if (existing) {
          existing.answer = answer;
        } else {
          state.contextualAnswers.push({
            id: crypto.randomUUID(),
            ramsId: state.currentRAMS?.id || "",
            questionId,
            answer,
            createdAt: new Date().toISOString(),
          });
        }
        state.isDirty = true;
      }),

    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab;
      }),

    setIsDirty: (dirty) =>
      set((state) => {
        state.isDirty = dirty;
      }),

    setIsSaving: (saving) =>
      set((state) => {
        state.isSaving = saving;
      }),

    reset: () =>
      set((state) => {
        state.currentRAMS = null;
        state.widgets = [];
        state.riskAssessments = [];
        state.contextualAnswers = [];
        state.canvasState = initialCanvasState;
        state.isDirty = false;
        state.isSaving = false;
        state.selectedWidgetId = null;
        state.activeTab = "canvas";
      }),
  }))
);
