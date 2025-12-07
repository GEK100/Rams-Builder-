"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { Widget, WidgetType } from "@/types/widget";
import { Zap, Droplets, Wind, Hammer, Home, Boxes, Trash2, AlertTriangle, Grid3x3, Container, Paintbrush, Square, PanelTop, Layers, CheckCircle2 } from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Zap,
  Droplets,
  Wind,
  Hammer,
  Home,
  Boxes,
  Trash2,
  AlertTriangle,
  Grid3x3,
  Container,
  Paintbrush,
  Square,
  PanelTop,
  Layers,
};

interface WidgetNodeData {
  widget: Widget;
  widgetType?: WidgetType;
}

function WidgetNodeComponent({ data, selected }: NodeProps<WidgetNodeData>) {
  const { widget, widgetType } = data;
  const Icon = widgetType ? iconMap[widgetType.icon] || Boxes : Boxes;
  const color = widgetType?.color || "#10b981";

  // Get activity count from selected activities
  const selectedActivities = widget.selectedActivities || [];
  const activityCount = selectedActivities.length;

  return (
    <div
      className={`
        relative min-w-[180px] rounded-xl border-2 transition-all
        ${selected ? "border-primary shadow-lg shadow-primary/20" : "border-white/20"}
      `}
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 p-3 rounded-t-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{widgetType?.name || "Widget"}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        {activityCount > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <CheckCircle2 className="h-3 w-3" />
            <span>{activityCount} activities selected</span>
          </div>
        ) : (
          <p className="text-xs text-amber-400">
            Click to select activities
          </p>
        )}
      </div>

      {/* Notes indicator */}
      {widget.notes && (
        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">!</span>
        </div>
      )}

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
    </div>
  );
}

export const WidgetNode = memo(WidgetNodeComponent);
