"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 shrink-0 rounded border-2 border-white/20 bg-white/5",
              "transition-all duration-150",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:border-primary peer-checked:bg-primary",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              // Mobile touch target - larger hit area
              "after:absolute after:-inset-2 after:content-['']",
              className
            )}
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "opacity-0 scale-0 transition-all duration-150",
                "peer-checked:opacity-100 peer-checked:scale-100"
              )}
            />
          </div>
          {/* Invisible larger touch target for mobile */}
          <label
            htmlFor={inputId}
            className="absolute -inset-2 cursor-pointer"
            aria-hidden="true"
          />
        </div>
        {(label || description) && (
          <label htmlFor={inputId} className="flex-1 cursor-pointer select-none">
            {label && (
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-muted-foreground mt-0.5">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
