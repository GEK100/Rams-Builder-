"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, FileCheck, X } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  ramsTitle: string;
  isLoading?: boolean;
}

export function DisclaimerModal({
  isOpen,
  onClose,
  onAccept,
  ramsTitle,
  isLoading = false,
}: DisclaimerModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hasCheckedBox, setHasCheckedBox] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 20;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const canAccept = hasScrolledToBottom && hasCheckedBox;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Important Disclaimer</h2>
              <p className="text-sm text-muted-foreground">Please read carefully before downloading</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4"
          onScroll={handleScroll}
        >
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-400 font-medium">
              You are about to download: <span className="text-foreground">{ramsTitle}</span>
            </p>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">Terms of Responsibility</h3>

            <p>
              By downloading this Risk Assessment and Method Statement (RAMS) document, you acknowledge and agree to the following terms and conditions:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">1. AI-Generated Content</h4>
                <p>
                  This RAMS document has been generated using artificial intelligence (Claude AI) based on the information you have provided. While the AI has been trained on UK health and safety regulations and best practices, it is not a substitute for professional judgement and site-specific assessment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">2. Your Responsibility</h4>
                <p>
                  You accept <strong className="text-foreground">full responsibility</strong> for reviewing, verifying, and ensuring the accuracy of all content within this document before use. This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All hazard identifications and risk assessments</li>
                  <li>Control measures and mitigation strategies</li>
                  <li>Method statement procedures</li>
                  <li>Safe isolation procedures</li>
                  <li>Emergency procedures</li>
                  <li>Regulatory compliance statements</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">3. Professional Review Required</h4>
                <p>
                  You must ensure that a competent person reviews this document before it is used on any project. The reviewer should have appropriate qualifications and experience in health and safety for the type of work being undertaken.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">4. Site-Specific Assessment</h4>
                <p>
                  This document must be adapted for the specific site conditions, circumstances, and requirements of your project. Generic content must be replaced with site-specific information where applicable.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">5. No Liability</h4>
                <p>
                  RAMS Builder (Ictus Flow Ltd) accepts no liability for any loss, damage, injury, or death arising from the use of this document. The user assumes all risk and responsibility associated with the implementation of this RAMS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">6. Regulatory Compliance</h4>
                <p>
                  It is your responsibility to ensure that the final document complies with all applicable UK legislation including, but not limited to, the Health and Safety at Work Act 1974, CDM Regulations 2015, Electricity at Work Regulations 1989, and BS 7671.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium text-foreground mb-2">7. Updates and Revisions</h4>
                <p>
                  You are responsible for maintaining and updating this document as project conditions change, and for ensuring all personnel are briefed on its contents.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-foreground font-medium">
                By clicking "I Accept & Download", you confirm that you have read, understood, and agree to these terms, and that you accept full responsibility for the content and use of this document.
              </p>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-center text-sm text-muted-foreground animate-pulse">
              ↓ Please scroll down to read the full disclaimer ↓
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasCheckedBox}
              onChange={(e) => setHasCheckedBox(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5"
              disabled={!hasScrolledToBottom}
            />
            <span className={`text-sm ${hasScrolledToBottom ? "" : "text-muted-foreground"}`}>
              I confirm that I have read and understood the above disclaimer. I accept <strong>full responsibility</strong> for reviewing, verifying, and ensuring the accuracy of this RAMS document before use. I understand that RAMS Builder accepts no liability for the content or use of this document.
            </span>
          </label>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={onAccept}
              disabled={!canAccept || isLoading}
              loading={isLoading}
              className="flex-1"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              I Accept & Download
            </Button>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-center text-xs text-muted-foreground">
              You must read the full disclaimer before accepting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
