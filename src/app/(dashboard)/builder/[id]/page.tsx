"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { WidgetPalette } from "@/components/canvas/WidgetPalette";
import { Button } from "@/components/ui/Button";
import { useRAMSStore } from "@/stores/ramsStore";
import type { Widget, WidgetType } from "@/types/widget";
import { createEmptyRAMS } from "@/types/rams";
import { FileText, Settings2, HelpCircle, Sparkles, Download, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for React Flow (needs client-side only)
const Canvas = dynamic(
  () => import("@/components/canvas/Canvas").then((mod) => mod.Canvas),
  { ssr: false, loading: () => <CanvasLoading /> }
);

// Dynamic imports for other tabs
const SubcontractorInfoForm = dynamic(
  () => import("@/components/forms/SubcontractorInfoForm").then((mod) => mod.SubcontractorInfoForm),
  { ssr: false, loading: () => <TabLoading /> }
);

const ContextualQuestionsForm = dynamic(
  () => import("@/components/forms/ContextualQuestionsForm").then((mod) => mod.ContextualQuestionsForm),
  { ssr: false, loading: () => <TabLoading /> }
);

const RiskAssessmentPanel = dynamic(
  () => import("@/components/risk-assessment/RiskAssessmentPanel").then((mod) => mod.RiskAssessmentPanel),
  { ssr: false, loading: () => <TabLoading /> }
);

const GeneratePanel = dynamic(
  () => import("@/components/generate/GeneratePanel").then((mod) => mod.GeneratePanel),
  { ssr: false, loading: () => <TabLoading /> }
);

const WidgetConfigPanel = dynamic(
  () => import("@/components/canvas/WidgetConfigPanel").then((mod) => mod.WidgetConfigPanel),
  { ssr: false }
);

function CanvasLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl gradient-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Loading canvas...</p>
      </div>
    </div>
  );
}

function TabLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-8 w-8 rounded-lg gradient-primary animate-pulse" />
    </div>
  );
}

const tabs = [
  { id: "canvas", label: "Canvas", icon: Settings2 },
  { id: "cdm", label: "Project Info", icon: FileText },
  { id: "questions", label: "Questions", icon: HelpCircle },
  { id: "risks", label: "Risks", icon: Settings2 },
  { id: "generate", label: "Generate", icon: Sparkles },
] as const;

export default function BuilderPage() {
  const params = useParams();
  const ramsId = params.id as string;

  const {
    currentRAMS,
    widgets,
    activeTab,
    setActiveTab,
    addWidget,
    updateWidget,
    setSelectedWidget,
    setCurrentRAMS,
    isDirty,
    isSaving,
  } = useRAMSStore();

  const [draggingWidget, setDraggingWidget] = useState<WidgetType | null>(null);

  // Initialize RAMS if not already set (always as subcontractor)
  useEffect(() => {
    if (!currentRAMS) {
      const newRAMS = {
        id: ramsId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...createEmptyRAMS("temp-user-id", "subcontractor"),
      };
      setCurrentRAMS(newRAMS);
    }
  }, [currentRAMS, ramsId, setCurrentRAMS]);

  const handleDragStart = useCallback((widget: WidgetType) => {
    setDraggingWidget(widget);
  }, []);

  const handleWidgetAdd = useCallback((widget: Widget) => {
    addWidget({ ...widget, ramsId });
    setDraggingWidget(null);
  }, [addWidget, ramsId]);

  const handleWidgetUpdate = useCallback((id: string, updates: Partial<Widget>) => {
    updateWidget(id, updates);
  }, [updateWidget]);

  const handleWidgetSelect = useCallback((id: string | null) => {
    setSelectedWidget(id);
  }, [setSelectedWidget]);

  const handleSave = async () => {
    // TODO: Implement save to Supabase
    // Actual save implementation will be added here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-white/10 glass flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold">RAMS Builder</h1>
          {isDirty && (
            <span className="text-xs text-amber-400">Unsaved changes</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} loading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "canvas" && (
          <>
            <WidgetPalette onDragStart={handleDragStart} />
            <Canvas
              widgets={widgets}
              onWidgetAdd={handleWidgetAdd}
              onWidgetUpdate={handleWidgetUpdate}
              onWidgetSelect={handleWidgetSelect}
            />
            <WidgetConfigPanel />
          </>
        )}

        {activeTab === "cdm" && (
          <div className="flex-1 overflow-auto p-6">
            <SubcontractorInfoForm />
          </div>
        )}

        {activeTab === "questions" && (
          <div className="flex-1 overflow-auto p-6">
            <ContextualQuestionsForm />
          </div>
        )}

        {activeTab === "risks" && (
          <div className="flex-1 overflow-auto p-6">
            <RiskAssessmentPanel />
          </div>
        )}

        {activeTab === "generate" && (
          <div className="flex-1 overflow-auto p-6">
            <GeneratePanel />
          </div>
        )}
      </div>
    </div>
  );
}
