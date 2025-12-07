"use client";

import { useState, useMemo } from "react";
import { useRAMSStore } from "@/stores/ramsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  QUESTION_CATEGORIES,
  getQuestionsForContractorType,
  getQuestionsByCategoryAndContractorType
} from "@/constants/questions";
import type { ContextualQuestion, ContractorType } from "@/types/rams";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, AlertCircle, Building2, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

type AnswerValue = boolean | string | string[] | number;

interface CategorySectionProps {
  categoryKey: keyof typeof QUESTION_CATEGORIES;
  questions: ContextualQuestion[];
  answers: Record<string, AnswerValue | undefined>;
  onAnswer: (questionId: string, answer: AnswerValue) => void;
}

// Check if a question should be visible based on its dependsOn condition
function shouldShowQuestion(question: ContextualQuestion, answers: Record<string, AnswerValue | undefined>): boolean {
  if (!question.dependsOn) return true;

  const dependentAnswer = answers[question.dependsOn.questionId];
  if (dependentAnswer === undefined) return false;

  // Check if the dependent answer matches the required value
  if (Array.isArray(question.dependsOn.value)) {
    return question.dependsOn.value.includes(dependentAnswer as string);
  }
  return dependentAnswer === question.dependsOn.value;
}

function CategorySection({ categoryKey, questions, answers, onAnswer }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(categoryKey === "site_conditions" || categoryKey === "emergency");
  const category = QUESTION_CATEGORIES[categoryKey];

  // Filter questions that should be visible based on dependsOn
  const visibleQuestions = questions.filter(q => shouldShowQuestion(q, answers));

  const answeredCount = visibleQuestions.filter(q => answers[q.id] !== undefined && answers[q.id] !== "").length;
  const requiredCount = visibleQuestions.filter(q => q.isRequired).length;
  const answeredRequiredCount = visibleQuestions.filter(q => q.isRequired && answers[q.id] !== undefined && answers[q.id] !== "").length;

  const isComplete = answeredRequiredCount === requiredCount;

  return (
    <Card variant="glass">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : requiredCount > 0 ? (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              ) : null}
            </div>
            <CardDescription>{category.description}</CardDescription>
            <div className="mt-2 text-xs text-muted-foreground">
              {answeredCount} / {visibleQuestions.length} answered
              {requiredCount > 0 && ` (${answeredRequiredCount}/${requiredCount} required)`}
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CardHeader>
      </button>
      {isOpen && (
        <CardContent className="space-y-6">
          {visibleQuestions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => onAnswer(question.id, value)}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

interface QuestionFieldProps {
  question: ContextualQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const renderInput = () => {
    switch (question.questionType) {
      case "boolean":
        return (
          <div className="flex gap-4">
            <button
              onClick={() => onChange(true)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                value === true
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              Yes
            </button>
            <button
              onClick={() => onChange(false)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                value === false
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              No
            </button>
          </div>
        );

      case "select":
        return (
          <select
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-10 w-full rounded-xl border bg-transparent px-4 py-2 text-sm transition-colors border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="" className="bg-card">Select an option...</option>
            {question.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card">
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        const selectedValues = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedValues.filter((v) => v !== opt.value));
                    } else {
                      onChange([...selectedValues, opt.value]);
                    }
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm transition-colors flex items-center gap-2",
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        );

      case "text":
        // Use textarea for questions with long placeholders (like rescue plan details)
        if (question.placeholder && question.placeholder.length > 50) {
          return (
            <textarea
              value={value as string || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder || "Enter your answer..."}
              className="flex min-h-[100px] w-full rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors border-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          );
        }
        return (
          <Input
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Enter your answer..."}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value as number || ""}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            placeholder="Enter a number..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Label className="flex-1">
          {question.questionText}
          {question.isRequired && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
      </div>
      {renderInput()}
      {question.triggersWidgets && question.triggersWidgets.length > 0 && !!value && (
        <p className="text-xs text-muted-foreground">
          This may trigger: {question.triggersWidgets.join(", ")}
        </p>
      )}
    </div>
  );
}

export function ContextualQuestionsForm() {
  const { currentRAMS, contextualAnswers, setContextualAnswer } = useRAMSStore();

  // Get contractor type from current RAMS, default to main_contractor
  const contractorType: ContractorType = currentRAMS?.contractorType?.type || "main_contractor";

  // Convert contextualAnswers array to a lookup object
  const answersMap: Record<string, AnswerValue | undefined> = {};
  contextualAnswers.forEach((a) => {
    answersMap[a.questionId] = a.answer;
  });

  const handleAnswer = (questionId: string, answer: boolean | string | string[] | number) => {
    setContextualAnswer(questionId, answer);
  };

  // Group questions by category
  const categories = Object.keys(QUESTION_CATEGORIES) as (keyof typeof QUESTION_CATEGORIES)[];

  // Get filtered questions based on contractor type
  const filteredQuestions = useMemo(() => {
    return getQuestionsForContractorType(contractorType);
  }, [contractorType]);

  // Calculate overall progress for filtered questions
  const totalQuestions = filteredQuestions.length;
  const answeredQuestions = filteredQuestions.filter(
    q => answersMap[q.id] !== undefined && answersMap[q.id] !== ""
  ).length;
  const requiredQuestions = filteredQuestions.filter(q => q.isRequired).length;
  const answeredRequired = filteredQuestions.filter(
    q => q.isRequired && answersMap[q.id] !== undefined && answersMap[q.id] !== ""
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Contextual Questions</h2>
        <p className="text-muted-foreground">
          Answer these questions to help generate a comprehensive RAMS document
        </p>

        {/* Contractor Type Indicator */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          {contractorType === "main_contractor" ? (
            <>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Main Contractor</p>
                <p className="text-xs text-muted-foreground">
                  Questions include welfare and first aid provisions
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Hammer className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Subcontractor</p>
                <p className="text-xs text-muted-foreground">
                  Welfare provided by Main Contractor - questions about MC coordination included
                </p>
              </div>
            </>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 p-4 rounded-xl bg-white/5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span>{answeredQuestions} / {totalQuestions} questions</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Required: {answeredRequired} / {requiredQuestions}</span>
            {answeredRequired === requiredQuestions ? (
              <span className="text-primary flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                All required complete
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {requiredQuestions - answeredRequired} required remaining
              </span>
            )}
          </div>
        </div>
      </div>

      {categories.map((categoryKey) => {
        const questions = getQuestionsByCategoryAndContractorType(categoryKey, contractorType);
        if (questions.length === 0) return null;

        return (
          <CategorySection
            key={categoryKey}
            categoryKey={categoryKey}
            questions={questions}
            answers={answersMap}
            onAnswer={handleAnswer}
          />
        );
      })}
    </div>
  );
}
