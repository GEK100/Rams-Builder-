"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  AlertTriangle,
  Lock,
  Flame,
  Box,
  Shovel,
  ArrowUp,
  Package,
  Heart,
  Power,
  ClipboardCheck,
  AlertOctagon,
  Loader2,
} from "lucide-react";

// Process type definition
export interface StandardProcess {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  content: {
    summary: string;
    steps: string[];
    hazards: Array<{ name: string; severity: number; likelihood: number }>;
    controls: string[];
    ppe: string[];
    training: string[];
    legislation: string[];
  };
  display_order: number;
}

// Category info
const PROCESS_CATEGORIES: Record<string, { name: string; color: string }> = {
  Isolation: { name: "Isolation Procedures", color: "#f59e0b" },
  Permits: { name: "Permits to Work", color: "#ef4444" },
  General: { name: "General Safety", color: "#10b981" },
  Emergency: { name: "Emergency Response", color: "#8b5cf6" },
};

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  Lock: <Lock className="h-5 w-5" />,
  Power: <Power className="h-5 w-5" />,
  ClipboardCheck: <ClipboardCheck className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  Box: <Box className="h-5 w-5" />,
  Shovel: <Shovel className="h-5 w-5" />,
  ArrowUp: <ArrowUp className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  AlertOctagon: <AlertOctagon className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
};

interface ProcessSelectorProps {
  selectedProcesses: string[]; // Array of process codes
  onSelectionChange: (processes: string[]) => void;
  className?: string;
}

export function ProcessSelector({
  selectedProcesses,
  onSelectionChange,
  className,
}: ProcessSelectorProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Isolation", "Permits"])
  );
  const [processes, setProcesses] = useState<StandardProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);

  // Fetch standard processes on mount
  useEffect(() => {
    async function fetchProcesses() {
      try {
        const response = await fetch("/api/processes");
        if (!response.ok) throw new Error("Failed to fetch processes");
        const data = await response.json();
        setProcesses(data.processes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load processes");
      } finally {
        setLoading(false);
      }
    }
    fetchProcesses();
  }, []);

  // Group processes by category
  const processesByCategory = useMemo(() => {
    const grouped: Record<string, StandardProcess[]> = {};
    processes.forEach((process) => {
      if (!grouped[process.category]) {
        grouped[process.category] = [];
      }
      grouped[process.category].push(process);
    });
    // Sort each category by display_order
    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => a.display_order - b.display_order);
    });
    return grouped;
  }, [processes]);

  // Filter based on search
  const filteredProcesses = useMemo(() => {
    if (!search.trim()) return processesByCategory;

    const searchLower = search.toLowerCase();
    const filtered: Record<string, StandardProcess[]> = {};

    Object.entries(processesByCategory).forEach(([category, procs]) => {
      const matching = procs.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.code.toLowerCase().includes(searchLower)
      );
      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });

    return filtered;
  }, [search, processesByCategory]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleProcess = (processCode: string) => {
    const isSelected = selectedProcesses.includes(processCode);
    if (isSelected) {
      onSelectionChange(selectedProcesses.filter((c) => c !== processCode));
    } else {
      onSelectionChange([...selectedProcesses, processCode]);
    }
  };

  const toggleAllInCategory = (category: string) => {
    const categoryProcesses = processesByCategory[category] || [];
    const processCodes = categoryProcesses.map((p) => p.code);
    const allSelected = processCodes.every((code) =>
      selectedProcesses.includes(code)
    );

    if (allSelected) {
      onSelectionChange(
        selectedProcesses.filter((c) => !processCodes.includes(c))
      );
    } else {
      const newSelection = new Set([...selectedProcesses, ...processCodes]);
      onSelectionChange(Array.from(newSelection));
    }
  };

  const getSelectedCountInCategory = (category: string) => {
    const categoryProcesses = processesByCategory[category] || [];
    return categoryProcesses.filter((p) =>
      selectedProcesses.includes(p.code)
    ).length;
  };

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || <AlertTriangle className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading processes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
        <p className="text-red-400">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search processes (e.g., LOTO, Hot Works)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-muted-foreground">
            {selectedProcesses.length} process{selectedProcesses.length !== 1 ? "es" : ""} selected
          </p>
          {selectedProcesses.length > 0 && (
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredProcesses).map(([category, procs]) => {
          const categoryInfo = PROCESS_CATEGORIES[category] || {
            name: category,
            color: "#6b7280",
          };
          const isExpanded = expandedCategories.has(category);
          const selectedCount = getSelectedCountInCategory(category);
          const totalCount = procs.length;

          return (
            <div key={category} className="border-b border-white/5">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: categoryInfo.color }}
                />
                <span className="flex-1 text-left text-base font-medium">
                  {categoryInfo.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {selectedCount}/{totalCount}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllInCategory(category);
                  }}
                  className={cn(
                    "px-3 py-1 text-sm rounded-lg transition-colors",
                    selectedCount === totalCount
                      ? "bg-primary/20 text-primary"
                      : "bg-white/10 text-muted-foreground hover:bg-white/20"
                  )}
                >
                  {selectedCount === totalCount ? "Clear" : "All"}
                </button>
              </button>

              {/* Processes */}
              {isExpanded && (
                <div className="pb-2">
                  {procs.map((process) => {
                    const isSelected = selectedProcesses.includes(process.code);
                    const isProcessExpanded = expandedProcess === process.code;

                    return (
                      <div key={process.id}>
                        <button
                          onClick={() => toggleProcess(process.code)}
                          className={cn(
                            "w-full flex items-start gap-4 px-5 py-4 text-left transition-colors",
                            "min-h-[64px]",
                            isSelected
                              ? "bg-primary/10"
                              : "hover:bg-white/5 active:bg-white/10"
                          )}
                        >
                          {/* Checkbox */}
                          <div
                            className={cn(
                              "mt-0.5 h-6 w-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-white/30 bg-white/5"
                            )}
                          >
                            {isSelected && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>

                          {/* Icon */}
                          <div
                            className={cn(
                              "mt-0.5 shrink-0",
                              isSelected ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {getIcon(process.icon)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-base font-medium",
                                  isSelected
                                    ? "text-foreground"
                                    : "text-foreground/80"
                                )}
                              >
                                {process.name}
                              </span>
                              <span className="text-xs text-muted-foreground bg-white/10 px-2 py-0.5 rounded">
                                {process.code}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {process.description}
                            </p>
                            {/* Info badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {process.content.hazards.length > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/10 text-red-400">
                                  {process.content.hazards.length} hazards
                                </span>
                              )}
                              {process.content.ppe.length > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400">
                                  {process.content.ppe.length} PPE items
                                </span>
                              )}
                              {process.content.steps.length > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-emerald-500/10 text-emerald-400">
                                  {process.content.steps.length} steps
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expand details button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProcess(
                                isProcessExpanded ? null : process.code
                              );
                            }}
                            className="shrink-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            {isProcessExpanded ? "Hide" : "Details"}
                          </button>
                        </button>

                        {/* Expanded process details */}
                        {isProcessExpanded && (
                          <div className="mx-5 mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="font-medium mb-2">{process.content.summary}</h4>

                            {/* Steps */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-primary mb-1">Key Steps:</h5>
                              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                                {process.content.steps.slice(0, 5).map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                                {process.content.steps.length > 5 && (
                                  <li className="text-muted-foreground/60">
                                    ...and {process.content.steps.length - 5} more steps
                                  </li>
                                )}
                              </ol>
                            </div>

                            {/* PPE */}
                            {process.content.ppe.length > 0 && (
                              <div className="mb-3">
                                <h5 className="text-sm font-medium text-blue-400 mb-1">PPE Required:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {process.content.ppe.map((item, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Legislation */}
                            {process.content.legislation.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-amber-400 mb-1">Legislation:</h5>
                                <p className="text-xs text-muted-foreground">
                                  {process.content.legislation.join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filteredProcesses).length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No processes found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
