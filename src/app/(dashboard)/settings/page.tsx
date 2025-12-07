"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  User,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  Database,
  Lock,
} from "lucide-react";

interface UserProfile {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    lastSignIn: string;
  };
  profile: {
    full_name?: string;
    company_name?: string;
    marketing_consent?: boolean;
  } | null;
  dataSummary: {
    ramsDocuments: number;
    widgets: number;
    riskAssessments: number;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFullName(data.profile?.full_name || data.user?.email?.split("@")[0] || "");
        setCompanyName(data.profile?.company_name || "");
        setMarketingConsent(data.profile?.marketing_consent || false);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyName,
          marketingConsent,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully" });
        fetchProfile();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/data-export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rams-builder-data-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage({ type: "success", text: "Data exported successfully" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to export data" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      setMessage({ type: "error", text: "Please type 'DELETE MY ACCOUNT' to confirm" });
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmEmail: deleteConfirmEmail,
          confirmText: deleteConfirmText,
        }),
      });

      if (response.ok) {
        // Sign out and redirect
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/?deleted=true");
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to delete account" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete account" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, privacy settings, and data
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.user.email || ""}
                disabled
                className="bg-white/5"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="marketing"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="h-4 w-4 rounded border-white/20"
            />
            <Label htmlFor="marketing" className="text-sm">
              I agree to receive marketing communications about RAMS Builder
            </Label>
          </div>
          <div className="pt-4">
            <Button onClick={handleSaveProfile} loading={saving}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle>Your Data</CardTitle>
              <CardDescription>Summary of data we store about you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{profile?.dataSummary.ramsDocuments || 0}</p>
              <p className="text-sm text-muted-foreground">RAMS Documents</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-center">
              <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">⚡</div>
              <p className="text-2xl font-bold">{profile?.dataSummary.widgets || 0}</p>
              <p className="text-sm text-muted-foreground">Widgets</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{profile?.dataSummary.riskAssessments || 0}</p>
              <p className="text-sm text-muted-foreground">Risk Assessments</p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/5">
            <p className="text-sm text-muted-foreground">
              <strong>Account created:</strong>{" "}
              {profile?.user.createdAt
                ? new Date(profile.user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GDPR Rights Section */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle>Your Privacy Rights (GDPR)</CardTitle>
              <CardDescription>Exercise your data protection rights</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 space-y-3">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Right to Data Portability (Article 20)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Download all your personal data in a machine-readable format (JSON).
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                loading={exporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Right of Access (Article 15)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You can view all the data we hold about you on this page and through the data
                  export feature.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Right to Rectification (Article 16)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You can update your personal information using the profile form above.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <a
              href="/privacy"
              className="text-sm text-primary hover:underline"
            >
              Read our full Privacy Policy →
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card variant="glass" className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-red-400">Delete Account</CardTitle>
              <CardDescription>
                Right to Erasure (GDPR Article 17) - Permanently delete your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-400">This action is irreversible</p>
                    <p className="text-muted-foreground mt-1">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Your profile and personal information</li>
                      <li>All RAMS documents you&apos;ve created</li>
                      <li>All risk assessments and widgets</li>
                      <li>Your subscription and payment history</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                I want to delete my account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-medium">
                  To confirm deletion, please enter your email and type &quot;DELETE MY ACCOUNT&quot;
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Your Email</Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    placeholder={profile?.user.email || "your@email.com"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmText">Type &quot;DELETE MY ACCOUNT&quot;</Label>
                  <Input
                    id="confirmText"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmEmail("");
                      setDeleteConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteAccount}
                    loading={deleting}
                    disabled={deleteConfirmText !== "DELETE MY ACCOUNT"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Permanently Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
