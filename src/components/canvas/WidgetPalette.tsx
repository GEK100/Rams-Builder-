"use client";

import { useState, useRef } from "react";
import { TRADE_WIDGETS, WIDGET_CATEGORIES } from "@/constants/trades";
import type { WidgetType } from "@/types/widget";
import { cn } from "@/lib/utils";
import { Search, Zap, Droplets, Wind, Hammer, Home, Boxes, Trash2, AlertTriangle, Grid3x3, Container, Paintbrush, Square, PanelTop, Layers, Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useRAMSStore } from "@/stores/ramsStore";

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

interface WidgetPaletteProps {
  onDragStart: (widget: WidgetType) => void;
}

export function WidgetPalette({ onDragStart }: WidgetPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentRAMS, updateRAMS } = useRAMSStore();

  const hasScope = !!currentRAMS?.projectScope;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, or text file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to extract text");

      updateRAMS({
        projectScope: data.text,
        projectScopeFileName: file.name,
      });

      // Try to extract project info
      try {
        const extractResponse = await fetch("/api/extract-project-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scopeText: data.text }),
        });
        // Auto-apply extracted info is handled in Project Info tab
      } catch {
        // Non-fatal
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredWidgets = TRADE_WIDGETS.filter((widget) => {
    const matchesSearch = widget.name.toLowerCase().includes(search.toLowerCase()) ||
      widget.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || widget.category === selectedCategory;
    return matchesSearch && matchesCategory && widget.isActive;
  });

  const categories = Object.entries(WIDGET_CATEGORIES);

  return (
    <div className="w-64 h-full glass border-r border-white/10 flex flex-col">
      {/* Quick Start Upload Banner */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      {!hasScope ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="m-3 p-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/20 transition-all text-left group"
        >
          {isUploading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div>
                <p className="font-medium text-primary text-sm">Uploading...</p>
                <p className="text-xs text-muted-foreground">Extracting text</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Upload Scope</p>
                <p className="text-xs text-muted-foreground">PDF, Word, or text</p>
              </div>
            </div>
          )}
        </button>
      ) : (
        <div className="m-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-emerald-400">Scope uploaded</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentRAMS?.projectScopeFileName || "Document"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold mb-2">Trade Widgets</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Drag widgets onto the canvas to add them to your RAMS
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b border-white/10">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-2 py-1 text-xs rounded-lg transition-colors",
              !selectedCategory
                ? "bg-primary/20 text-primary"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            )}
          >
            All
          </button>
          {categories.map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "px-2 py-1 text-xs rounded-lg transition-colors",
                selectedCategory === key
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredWidgets.map((widget) => {
          const Icon = iconMap[widget.icon] || Boxes;
          return (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("widget", JSON.stringify(widget));
                onDragStart(widget);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors group"
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${widget.color}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: widget.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{widget.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {widget.description}
                </p>
              </div>
            </div>
          );
        })}

        {filteredWidgets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No widgets found
          </div>
        )}
      </div>

    </div>
  );
}
