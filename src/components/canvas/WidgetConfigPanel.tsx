"use client";

import { useRAMSStore } from "@/stores/ramsStore";
import { TRADE_WIDGETS } from "@/constants/trades";
import { ActivitySelector } from "@/components/activities/ActivitySelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { X, Trash2, Zap, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getHazardsForActivities,
  getControlsForActivities,
} from "@/constants/electrical";

interface WidgetConfigPanelProps {
  className?: string;
}

export function WidgetConfigPanel({ className }: WidgetConfigPanelProps) {
  const { widgets, selectedWidgetId, setSelectedWidget, updateWidget, removeWidget } = useRAMSStore();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);
  const widgetType = selectedWidget
    ? TRADE_WIDGETS.find((t) => t.id === selectedWidget.typeId)
    : null;

  if (!selectedWidget || !widgetType) {
    return (
      <div className={cn("w-80 lg:w-96 border-l border-white/10 bg-card/50 flex flex-col", className)}>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <div className="h-12 w-12 rounded-xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a widget on the canvas to configure work activities
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedActivities = selectedWidget.selectedActivities || [];

  // Get aggregated data from selected activities
  const hazards = getHazardsForActivities(selectedActivities);
  const controls = getControlsForActivities(selectedActivities);

  const handleActivitiesChange = (activities: string[]) => {
    updateWidget(selectedWidget.id, { selectedActivities: activities });
  };

  const handleNotesChange = (notes: string) => {
    updateWidget(selectedWidget.id, { notes });
  };

  const handleDelete = () => {
    removeWidget(selectedWidget.id);
  };

  return (
    <div className={cn("w-[420px] lg:w-[480px] border-l border-white/10 bg-card/50 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${widgetType.color}30` }}
            >
              <Zap className="h-5 w-5" style={{ color: widgetType.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-base">{widgetType.name}</h3>
              <p className="text-sm text-muted-foreground">Configure work activities</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedWidget(null)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mx-auto mb-1" />
            <p className="text-sm text-red-400 font-semibold">{hazards.length}</p>
            <p className="text-xs text-muted-foreground">Hazards</p>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 text-center">
            <Shield className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <p className="text-sm text-green-400 font-semibold">{controls.length}</p>
            <p className="text-xs text-muted-foreground">Controls</p>
          </div>
        </div>
      </div>

      {/* Activity Selector - Takes most of the space */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-[400px]">
        <div className="px-4 py-3 border-b border-white/10">
          <h4 className="text-base font-medium">Work Activities</h4>
          <p className="text-sm text-muted-foreground">
            Select the activities included in this RAMS
          </p>
        </div>
        <ActivitySelector
          selectedActivities={selectedActivities}
          onSelectionChange={handleActivitiesChange}
          className="flex-1 overflow-y-auto"
        />
      </div>

      {/* Notes */}
      <div className="border-t border-white/10 p-4">
        <Label htmlFor="widget-notes" className="text-xs">
          Additional Notes
        </Label>
        <textarea
          id="widget-notes"
          value={selectedWidget.notes || ""}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Add any specific notes for this work..."
          className="mt-1.5 flex min-h-[60px] w-full rounded-xl border bg-transparent px-3 py-2 text-xs transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
        />
      </div>

      {/* Delete Button */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 transition-colors font-medium"
        >
          <Trash2 className="h-5 w-5" />
          Remove Widget
        </button>
      </div>
    </div>
  );
}
