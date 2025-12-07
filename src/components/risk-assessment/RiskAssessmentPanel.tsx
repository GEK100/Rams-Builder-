"use client";

import { useState, useMemo, useEffect } from "react";
import { useRAMSStore } from "@/stores/ramsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  ELECTRICAL_HAZARDS,
  ELECTRICAL_CONTROLS,
  getHazardsForActivities,
  getControlsForActivities,
  getHazardByCode,
  getControlByCode,
} from "@/constants/electrical";
import type { ElectricalHazard, ElectricalControl } from "@/constants/electrical";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
  RefreshCw,
  Sparkles,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Risk score calculation
type LikelihoodScore = 1 | 2 | 3 | 4 | 5;
type SeverityScore = 1 | 2 | 3 | 4 | 5;
type RiskLevel = "low" | "medium" | "high" | "very_high";

const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  very_high: "#ef4444",
};

const LIKELIHOOD_LABELS: Record<LikelihoodScore, string> = {
  1: "Very Unlikely",
  2: "Unlikely",
  3: "Possible",
  4: "Likely",
  5: "Very Likely",
};

const SEVERITY_LABELS: Record<SeverityScore, string> = {
  1: "Negligible",
  2: "Minor",
  3: "Moderate",
  4: "Major",
  5: "Catastrophic",
};

function calculateRiskScore(likelihood: LikelihoodScore, severity: SeverityScore): number {
  return likelihood * severity;
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "very_high";
}

// Auto-generated risk assessment type
interface AutoRiskAssessment {
  id: string;
  hazard: ElectricalHazard;
  controls: ElectricalControl[];
  initialLikelihood: LikelihoodScore;
  initialSeverity: SeverityScore;
  residualLikelihood: LikelihoodScore;
  residualSeverity: SeverityScore;
  additionalControls: string[];
  notes: string;
  isCustom: boolean;
}

// Risk Assessment Card Component
function RiskCard({
  risk,
  onUpdate,
  onRemove,
}: {
  risk: AutoRiskAssessment;
  onUpdate: (updates: Partial<AutoRiskAssessment>) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newControl, setNewControl] = useState("");

  const initialScore = calculateRiskScore(risk.initialLikelihood, risk.initialSeverity);
  const residualScore = calculateRiskScore(risk.residualLikelihood, risk.residualSeverity);
  const initialLevel = getRiskLevel(initialScore);
  const residualLevel = getRiskLevel(residualScore);

  const addCustomControl = () => {
    if (newControl.trim()) {
      onUpdate({
        additionalControls: [...risk.additionalControls, newControl.trim()],
      });
      setNewControl("");
    }
  };

  const removeCustomControl = (index: number) => {
    onUpdate({
      additionalControls: risk.additionalControls.filter((_, i) => i !== index),
    });
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="p-4 flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${RISK_LEVEL_COLORS[initialLevel]}20` }}
          >
            <AlertTriangle
              className="h-5 w-5"
              style={{ color: RISK_LEVEL_COLORS[initialLevel] }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{risk.hazard.name}</h3>
              {risk.isCustom && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                  Custom
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {risk.hazard.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Risk score badges */}
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: RISK_LEVEL_COLORS[initialLevel] }}
              >
                {initialScore}
              </span>
              <span className="text-muted-foreground">→</span>
              <span
                className="px-2.5 py-1 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: RISK_LEVEL_COLORS[residualLevel] }}
              >
                {residualScore}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <CardContent className="border-t border-white/10 space-y-6">
          {/* Hazard Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <p className="text-sm text-muted-foreground capitalize">
                {risk.hazard.category.replace(/_/g, " ")}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Severity Level</Label>
              <p className="text-sm text-muted-foreground capitalize">
                {risk.hazard.severity}
              </p>
            </div>
          </div>

          {/* Persons at Risk */}
          {risk.hazard.atRiskPersons && risk.hazard.atRiskPersons.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Persons at Risk</Label>
              <div className="flex flex-wrap gap-2">
                {risk.hazard.atRiskPersons.map((person) => (
                  <span
                    key={person}
                    className="px-2 py-1 text-xs rounded-lg bg-white/10"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Risk */}
            <div className="p-4 rounded-xl bg-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <h4 className="font-medium text-sm">Initial Risk</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Likelihood</Label>
                  <select
                    value={risk.initialLikelihood}
                    onChange={(e) =>
                      onUpdate({ initialLikelihood: parseInt(e.target.value) as LikelihoodScore })
                    }
                    className="w-full mt-1 rounded-lg border bg-transparent px-3 py-2 text-sm border-white/10"
                  >
                    {([1, 2, 3, 4, 5] as LikelihoodScore[]).map((l) => (
                      <option key={l} value={l} className="bg-card">
                        {l} - {LIKELIHOOD_LABELS[l]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Severity</Label>
                  <select
                    value={risk.initialSeverity}
                    onChange={(e) =>
                      onUpdate({ initialSeverity: parseInt(e.target.value) as SeverityScore })
                    }
                    className="w-full mt-1 rounded-lg border bg-transparent px-3 py-2 text-sm border-white/10"
                  >
                    {([1, 2, 3, 4, 5] as SeverityScore[]).map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s} - {SEVERITY_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="text-center py-2 rounded-lg font-bold"
                style={{ backgroundColor: RISK_LEVEL_COLORS[initialLevel] }}
              >
                Score: {initialScore} ({initialLevel.replace("_", " ").toUpperCase()})
              </div>
            </div>

            {/* Residual Risk */}
            <div className="p-4 rounded-xl bg-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-sm">Residual Risk</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Likelihood</Label>
                  <select
                    value={risk.residualLikelihood}
                    onChange={(e) =>
                      onUpdate({ residualLikelihood: parseInt(e.target.value) as LikelihoodScore })
                    }
                    className="w-full mt-1 rounded-lg border bg-transparent px-3 py-2 text-sm border-white/10"
                  >
                    {([1, 2, 3, 4, 5] as LikelihoodScore[]).map((l) => (
                      <option key={l} value={l} className="bg-card">
                        {l} - {LIKELIHOOD_LABELS[l]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Severity</Label>
                  <select
                    value={risk.residualSeverity}
                    onChange={(e) =>
                      onUpdate({ residualSeverity: parseInt(e.target.value) as SeverityScore })
                    }
                    className="w-full mt-1 rounded-lg border bg-transparent px-3 py-2 text-sm border-white/10"
                  >
                    {([1, 2, 3, 4, 5] as SeverityScore[]).map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s} - {SEVERITY_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="text-center py-2 rounded-lg font-bold"
                style={{ backgroundColor: RISK_LEVEL_COLORS[residualLevel] }}
              >
                Score: {residualScore} ({residualLevel.replace("_", " ").toUpperCase()})
              </div>
            </div>
          </div>

          {/* Control Measures */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Control Measures</h4>
            </div>

            {/* Auto-generated controls */}
            <div className="space-y-2">
              {risk.controls.map((control) => (
                <div
                  key={control.code}
                  className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{control.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {control.description}
                    </p>
                    {control.implementationNotes && (
                      <p className="text-xs text-green-400/70 mt-1 italic">
                        {control.implementationNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional custom controls */}
            {risk.additionalControls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Additional Controls:</p>
                {risk.additionalControls.map((control, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
                  >
                    <Edit3 className="h-4 w-4 text-blue-400 shrink-0" />
                    <p className="flex-1 text-sm">{control}</p>
                    <button
                      onClick={() => removeCustomControl(index)}
                      className="p-1 rounded hover:bg-white/10 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add custom control */}
            <div className="flex gap-2">
              <Input
                value={newControl}
                onChange={(e) => setNewControl(e.target.value)}
                placeholder="Add additional control measure..."
                onKeyDown={(e) => e.key === "Enter" && addCustomControl()}
              />
              <Button variant="outline" size="sm" onClick={addCustomControl}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <textarea
              value={risk.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Add any additional notes..."
              className="flex min-h-[80px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Remove Button */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={onRemove}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remove Risk
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function RiskAssessmentPanel() {
  const { widgets, contextualAnswers } = useRAMSStore();
  const [risks, setRisks] = useState<AutoRiskAssessment[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Get all selected activities from widgets
  const allSelectedActivities = useMemo(() => {
    const activities: string[] = [];
    widgets.forEach((w) => {
      if (w.selectedActivities) {
        activities.push(...w.selectedActivities);
      }
    });
    return [...new Set(activities)];
  }, [widgets]);

  // Get hazards and controls from selected activities
  const activityHazardCodes = useMemo(() => {
    return getHazardsForActivities(allSelectedActivities);
  }, [allSelectedActivities]);

  const activityControlCodes = useMemo(() => {
    return getControlsForActivities(allSelectedActivities);
  }, [allSelectedActivities]);

  // Auto-generate risks when activities change
  useEffect(() => {
    if (activityHazardCodes.length === 0) {
      setRisks([]);
      return;
    }

    const newRisks: AutoRiskAssessment[] = [];

    activityHazardCodes.forEach((hazardCode) => {
      const hazard = getHazardByCode(hazardCode);
      if (!hazard) return;

      // Check if risk already exists
      const existingRisk = risks.find((r) => r.hazard.code === hazardCode && !r.isCustom);
      if (existingRisk) {
        // Keep existing risk with user modifications
        newRisks.push(existingRisk);
        return;
      }

      // Get controls for this hazard
      const hazardControls: ElectricalControl[] = [];
      activityControlCodes.forEach((controlCode) => {
        const control = getControlByCode(controlCode);
        if (control && control.applicableHazardCodes.includes(hazardCode)) {
          hazardControls.push(control);
        }
      });

      // Determine initial risk scores based on hazard severity
      let initialLikelihood: LikelihoodScore = 3;
      let initialSeverity: SeverityScore = 3;

      switch (hazard.severity) {
        case "critical":
          initialSeverity = 5;
          initialLikelihood = 3;
          break;
        case "high":
          initialSeverity = 4;
          initialLikelihood = 3;
          break;
        case "medium":
          initialSeverity = 3;
          initialLikelihood = 3;
          break;
        case "low":
          initialSeverity = 2;
          initialLikelihood = 2;
          break;
      }

      // Residual risk is lower with controls in place
      const residualReduction = Math.min(hazardControls.length, 2);
      const residualLikelihood = Math.max(1, initialLikelihood - residualReduction) as LikelihoodScore;
      const residualSeverity = Math.max(1, initialSeverity - 1) as SeverityScore;

      newRisks.push({
        id: crypto.randomUUID(),
        hazard,
        controls: hazardControls,
        initialLikelihood,
        initialSeverity,
        residualLikelihood,
        residualSeverity,
        additionalControls: [],
        notes: "",
        isCustom: false,
      });
    });

    // Keep custom risks
    const customRisks = risks.filter((r) => r.isCustom);
    setRisks([...newRisks, ...customRisks]);
  }, [activityHazardCodes.join(","), activityControlCodes.join(",")]);

  // Update a risk
  const updateRisk = (id: string, updates: Partial<AutoRiskAssessment>) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Remove a risk
  const removeRisk = (id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  };

  // Add custom risk
  const addCustomRisk = (hazardCode: string) => {
    const hazard = getHazardByCode(hazardCode);
    if (!hazard) return;

    const newRisk: AutoRiskAssessment = {
      id: crypto.randomUUID(),
      hazard,
      controls: [],
      initialLikelihood: 3,
      initialSeverity: 3,
      residualLikelihood: 2,
      residualSeverity: 2,
      additionalControls: [],
      notes: "",
      isCustom: true,
    };

    setRisks((prev) => [...prev, newRisk]);
    setShowAddCustom(false);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = risks.length;
    const highRisk = risks.filter((r) => {
      const score = calculateRiskScore(r.residualLikelihood, r.residualSeverity);
      return getRiskLevel(score) === "high" || getRiskLevel(score) === "very_high";
    }).length;
    const mediumRisk = risks.filter((r) => {
      const score = calculateRiskScore(r.residualLikelihood, r.residualSeverity);
      return getRiskLevel(score) === "medium";
    }).length;
    const lowRisk = risks.filter((r) => {
      const score = calculateRiskScore(r.residualLikelihood, r.residualSeverity);
      return getRiskLevel(score) === "low";
    }).length;

    return { total, highRisk, mediumRisk, lowRisk };
  }, [risks]);

  // Available hazards for custom addition
  const availableHazards = ELECTRICAL_HAZARDS.filter(
    (h) => h.isActive && !risks.some((r) => r.hazard.code === h.code)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Risk Assessment</h2>
        <p className="text-muted-foreground">
          Risks are automatically generated from your selected activities. You can adjust scores and add additional controls.
        </p>
      </div>

      {/* Activity Count Info */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">
            {allSelectedActivities.length} activities selected
          </p>
          <p className="text-sm text-muted-foreground">
            {activityHazardCodes.length} hazards identified with {activityControlCodes.length} control measures
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Force regenerate
            setRisks([]);
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Risks</div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="text-2xl font-bold" style={{ color: RISK_LEVEL_COLORS.very_high }}>
            {stats.highRisk}
          </div>
          <div className="text-sm text-muted-foreground">High/Very High</div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="text-2xl font-bold" style={{ color: RISK_LEVEL_COLORS.medium }}>
            {stats.mediumRisk}
          </div>
          <div className="text-sm text-muted-foreground">Medium</div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="text-2xl font-bold" style={{ color: RISK_LEVEL_COLORS.low }}>
            {stats.lowRisk}
          </div>
          <div className="text-sm text-muted-foreground">Low</div>
        </Card>
      </div>

      {/* Add Custom Risk Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddCustom(!showAddCustom)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Risk
        </Button>
      </div>

      {/* Custom Risk Picker */}
      {showAddCustom && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Add Custom Risk</CardTitle>
            <CardDescription>
              Select a hazard to add as a custom risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {availableHazards.map((hazard) => (
                <button
                  key={hazard.code}
                  onClick={() => addCustomRisk(hazard.code)}
                  className="text-left p-3 rounded-xl border border-white/10 hover:border-primary transition-colors"
                >
                  <p className="font-medium text-sm">{hazard.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {hazard.description}
                  </p>
                </button>
              ))}
            </div>
            {availableHazards.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                All hazards have been added
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Risk List */}
      <div className="space-y-4">
        {risks.length > 0 ? (
          risks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              onUpdate={(updates) => updateRisk(risk.id, updates)}
              onRemove={() => removeRisk(risk.id)}
            />
          ))
        ) : (
          <Card variant="glass" className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Risk Assessments</h3>
            <p className="text-muted-foreground mb-4">
              Select activities in your widgets on the Canvas tab to automatically generate risk assessments.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
