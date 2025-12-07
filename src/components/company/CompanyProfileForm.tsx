"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import type { CompanyProfile, GuestCompanyInfo } from "@/types/company";
import { Building2, Upload, X, Image as ImageIcon } from "lucide-react";

interface CompanyProfileFormProps {
  /** For registered users - full profile */
  profile?: CompanyProfile;
  /** For guest users - minimal info */
  guestInfo?: GuestCompanyInfo;
  /** Called when profile is updated */
  onProfileChange?: (profile: Partial<CompanyProfile>) => void;
  /** Called when guest info is updated */
  onGuestInfoChange?: (info: GuestCompanyInfo) => void;
  /** Show full form or compact guest form */
  mode: "full" | "guest";
  className?: string;
}

export function CompanyProfileForm({
  profile,
  guestInfo,
  onProfileChange,
  onGuestInfoChange,
  mode,
  className,
}: CompanyProfileFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile?.logoUrl || profile?.logoBase64 || guestInfo?.logoBase64 || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo must be less than 2MB");
        return;
      }

      // Convert to base64 for storage and preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setLogoPreview(base64);

        if (mode === "full" && onProfileChange) {
          onProfileChange({ logoBase64: base64 });
        } else if (mode === "guest" && onGuestInfoChange) {
          onGuestInfoChange({
            ...guestInfo,
            companyName: guestInfo?.companyName || "",
            logoBase64: base64,
          });
        }
      };
      reader.readAsDataURL(file);
    },
    [mode, guestInfo, onProfileChange, onGuestInfoChange]
  );

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (mode === "full" && onProfileChange) {
      onProfileChange({ logoBase64: undefined, logoUrl: undefined });
    } else if (mode === "guest" && onGuestInfoChange) {
      onGuestInfoChange({
        ...guestInfo,
        companyName: guestInfo?.companyName || "",
        logoBase64: undefined,
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (mode === "full" && onProfileChange) {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const profileRecord = profile as unknown as Record<string, Record<string, unknown>>;
        onProfileChange({
          [parent]: {
            ...profileRecord?.[parent],
            [child]: value,
          },
        });
      } else {
        onProfileChange({ [field]: value });
      }
    } else if (mode === "guest" && onGuestInfoChange) {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const guestRecord = guestInfo as unknown as Record<string, Record<string, unknown>>;
        onGuestInfoChange({
          ...guestInfo,
          companyName: guestInfo?.companyName || "",
          [parent]: {
            ...guestRecord?.[parent],
            [child]: value,
          },
        });
      } else {
        onGuestInfoChange({
          ...guestInfo,
          companyName: guestInfo?.companyName || "",
          [field]: value,
        });
      }
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Logo Upload Section */}
      <div className="space-y-3">
        <Label>Company Logo</Label>
        <p className="text-xs text-muted-foreground">
          {mode === "full"
            ? "Your logo will appear on all generated RAMS documents"
            : "Add your logo to this RAMS (optional)"}
        </p>

        <div className="flex items-start gap-4">
          {/* Logo Preview / Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
              logoPreview
                ? "border-primary/50 bg-primary/5"
                : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
            )}
          >
            {logoPreview ? (
              <>
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-full h-full object-contain rounded-lg p-1"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLogo();
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Upload
                </span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          <div className="flex-1 space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {logoPreview ? "Change Logo" : "Upload Logo"}
            </Button>
            <p className="text-[10px] text-muted-foreground">
              PNG, JPG or SVG. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="Your Company Ltd"
          value={
            mode === "full" ? profile?.companyName : guestInfo?.companyName
          }
          onChange={(e) => handleFieldChange("companyName", e.target.value)}
        />
      </div>

      {/* Guest Mode - Simplified Fields */}
      {mode === "guest" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01onal234 567890"
                value={guestInfo?.phone || ""}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@company.com"
                value={guestInfo?.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.line1">Address (optional)</Label>
            <Input
              id="address.line1"
              placeholder="Street address"
              value={guestInfo?.address?.line1 || ""}
              onChange={(e) =>
                handleFieldChange("address.line1", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                placeholder="City"
                value={guestInfo?.address?.city || ""}
                onChange={(e) =>
                  handleFieldChange("address.city", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.postcode">Postcode</Label>
              <Input
                id="address.postcode"
                placeholder="AB1 2CD"
                value={guestInfo?.address?.postcode || ""}
                onChange={(e) =>
                  handleFieldChange("address.postcode", e.target.value)
                }
              />
            </div>
          </div>
        </>
      )}

      {/* Full Mode - Complete Profile */}
      {mode === "full" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="tradingName">Trading Name (if different)</Label>
            <Input
              id="tradingName"
              placeholder="Trading as..."
              value={profile?.tradingName || ""}
              onChange={(e) => handleFieldChange("tradingName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">
                Company Registration No.
              </Label>
              <Input
                id="registrationNumber"
                placeholder="12345678"
                value={profile?.registrationNumber || ""}
                onChange={(e) =>
                  handleFieldChange("registrationNumber", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input
                id="vatNumber"
                placeholder="GB 123 4567 89"
                value={profile?.vatNumber || ""}
                onChange={(e) => handleFieldChange("vatNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              placeholder="Street address"
              value={profile?.address.line1 || ""}
              onChange={(e) =>
                handleFieldChange("address.line1", e.target.value)
              }
              className="mb-2"
            />
            <Input
              placeholder="Address line 2 (optional)"
              value={profile?.address.line2 || ""}
              onChange={(e) =>
                handleFieldChange("address.line2", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                value={profile?.address.city || ""}
                onChange={(e) =>
                  handleFieldChange("address.city", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.county">County</Label>
              <Input
                id="address.county"
                value={profile?.address.county || ""}
                onChange={(e) =>
                  handleFieldChange("address.county", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.postcode">Postcode</Label>
              <Input
                id="address.postcode"
                value={profile?.address.postcode || ""}
                onChange={(e) =>
                  handleFieldChange("address.postcode", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile?.phone || ""}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.yourcompany.com"
              value={profile?.website || ""}
              onChange={(e) => handleFieldChange("website", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Info text */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex gap-2">
          <Building2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            {mode === "full" ? (
              <>
                <strong className="text-foreground">Saved automatically</strong>
                <br />
                Your company details will be added to all RAMS you create.
              </>
            ) : (
              <>
                <strong className="text-foreground">One-time use</strong>
                <br />
                These details will only be used for this RAMS. Create an account
                to save your company profile.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
