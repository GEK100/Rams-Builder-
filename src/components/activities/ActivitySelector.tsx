"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import {
  ELECTRICAL_ACTIVITIES,
  ACTIVITY_CATEGORIES,
  type WorkActivity,
  type WorkActivityCategory,
} from "@/constants/electrical";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  AlertTriangle,
} from "lucide-react";

interface ActivitySelectorProps {
  selectedActivities: string[];
  onSelectionChange: (activities: string[]) => void;
  className?: string;
}

export function ActivitySelector({
  selectedActivities,
  onSelectionChange,
  className,
}: ActivitySelectorProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["power_distribution", "containment", "cabling"]) // Default expanded
  );

  // Group activities by category
  const activitiesByCategory = useMemo(() => {
    const grouped: Record<WorkActivityCategory, WorkActivity[]> = {} as Record<
      WorkActivityCategory,
      WorkActivity[]
    >;
    ELECTRICAL_ACTIVITIES.filter((a) => a.isActive).forEach((activity) => {
      if (!grouped[activity.category]) {
        grouped[activity.category] = [];
      }
      grouped[activity.category].push(activity);
    });
    return grouped;
  }, []);

  // Filter activities based on search
  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activitiesByCategory;

    const searchLower = search.toLowerCase();
    const filtered: Record<WorkActivityCategory, WorkActivity[]> = {} as Record<
      WorkActivityCategory,
      WorkActivity[]
    >;

    Object.entries(activitiesByCategory).forEach(([category, activities]) => {
      const matchingActivities = activities.filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower)
      );
      if (matchingActivities.length > 0) {
        filtered[category as WorkActivityCategory] = matchingActivities;
      }
    });

    return filtered;
  }, [search, activitiesByCategory]);

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

  const toggleActivity = (activityCode: string) => {
    const isSelected = selectedActivities.includes(activityCode);
    if (isSelected) {
      onSelectionChange(selectedActivities.filter((c) => c !== activityCode));
    } else {
      onSelectionChange([...selectedActivities, activityCode]);
    }
  };

  const toggleAllInCategory = (category: WorkActivityCategory) => {
    const categoryActivities = activitiesByCategory[category] || [];
    const activityCodes = categoryActivities.map((a) => a.code);
    const allSelected = activityCodes.every((code) =>
      selectedActivities.includes(code)
    );

    if (allSelected) {
      // Deselect all in category
      onSelectionChange(
        selectedActivities.filter((c) => !activityCodes.includes(c))
      );
    } else {
      // Select all in category
      const newSelection = new Set([...selectedActivities, ...activityCodes]);
      onSelectionChange(Array.from(newSelection));
    }
  };

  const getSelectedCountInCategory = (category: WorkActivityCategory) => {
    const categoryActivities = activitiesByCategory[category] || [];
    return categoryActivities.filter((a) =>
      selectedActivities.includes(a.code)
    ).length;
  };

  // Check if activity has high-risk indicators
  const isHighRisk = (activity: WorkActivity) => {
    return (
      activity.category === "high_risk" ||
      activity.permitsRequired?.length ||
      activity.hazardCodes.some((h) =>
        ["arc_flash", "electric_shock_direct", "hv_switching"].includes(h)
      )
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-muted-foreground">
            {selectedActivities.length} activities selected
          </p>
          {selectedActivities.length > 0 && (
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredActivities).map(([category, activities]) => {
          const categoryInfo =
            ACTIVITY_CATEGORIES[category as WorkActivityCategory];
          const isExpanded = expandedCategories.has(category);
          const selectedCount = getSelectedCountInCategory(
            category as WorkActivityCategory
          );
          const totalCount = activities.length;

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
                {/* Select All Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllInCategory(category as WorkActivityCategory);
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

              {/* Activities */}
              {isExpanded && (
                <div className="pb-2">
                  {activities.map((activity) => {
                    const isSelected = selectedActivities.includes(
                      activity.code
                    );
                    const highRisk = isHighRisk(activity);

                    return (
                      <button
                        key={activity.id}
                        onClick={() => toggleActivity(activity.code)}
                        className={cn(
                          "w-full flex items-start gap-4 px-5 py-4 text-left transition-colors",
                          // Larger touch target for mobile
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
                              {activity.name}
                            </span>
                            {highRisk && (
                              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                          {/* Quick info badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {activity.hazardCodes.length > 0 && (
                              <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/10 text-red-400">
                                {activity.hazardCodes.length} hazards
                              </span>
                            )}
                            {activity.permitsRequired &&
                              activity.permitsRequired.length > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-amber-500/10 text-amber-400">
                                  Permit required
                                </span>
                              )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filteredActivities).length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No activities found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
