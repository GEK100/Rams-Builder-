"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { SUBSCRIPTION_TIERS, getDisplayTiers, type TierDefinition } from "@/lib/stripe/client";
import type { SubscriptionTier } from "@/types/subscription";
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  CreditCard,
  Loader2,
  ExternalLink,
  Users,
  FileText,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionData {
  tier: SubscriptionTier;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  ramsUsedThisMonth: number;
  ramsLimit: number | null;
  templateCount: number;
  templateLimit: number | null;
  teamMembers: number;
  teamLimit: number;
  credits: number;
  isAdmin?: boolean;
}

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          tier: data.subscription?.tier || "free",
          status: data.subscription?.status || "active",
          ramsUsedThisMonth: data.dataSummary?.ramsDocuments || 0,
          ramsLimit: data.subscription?.rams_limit ?? 1,
          templateCount: data.dataSummary?.templates || 0,
          templateLimit: data.subscription?.template_limit ?? 0,
          teamMembers: data.dataSummary?.teamMembers || 1,
          teamLimit: data.subscription?.user_limit || 1,
          credits: data.subscription?.credits || 0,
          isAdmin: data.isAdmin || false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      // Set default free tier data
      setSubscription({
        tier: "free",
        status: "active",
        ramsUsedThisMonth: 0,
        ramsLimit: 1,
        templateCount: 0,
        templateLimit: 0,
        teamMembers: 1,
        teamLimit: 1,
        credits: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (tier: SubscriptionTier) => {
    setCheckoutLoading(tier);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const displayTiers = getDisplayTiers(isAnnual);

  const getTierIcon = (tier: TierDefinition) => {
    switch (tier.id) {
      case "free":
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case "pay_per_use":
        return <Zap className="h-5 w-5 text-amber-400" />;
      case "starter_monthly":
      case "starter_annual":
        return <Shield className="h-5 w-5 text-blue-400" />;
      case "professional_monthly":
      case "professional_annual":
        return <Star className="h-5 w-5 text-primary" />;
      case "team_monthly":
      case "team_annual":
        return <Users className="h-5 w-5 text-purple-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const isCurrentTier = (tier: TierDefinition) => {
    if (!subscription) return false;
    // Check if this is the current tier or annual/monthly equivalent
    if (subscription.tier === tier.id) return true;
    // Check annual/monthly equivalents
    if (subscription.tier === "starter_monthly" && tier.id === "starter_annual") return false;
    if (subscription.tier === "starter_annual" && tier.id === "starter_monthly") return false;
    return false;
  };

  const formatLimit = (limit: number | null) => {
    return limit === null ? "Unlimited" : limit.toString();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Subscription" subtitle="Manage your plan and billing" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Subscription" subtitle="Manage your plan and billing" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Admin Badge */}
        {subscription?.isAdmin && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-400">Admin Mode Active</p>
              <p className="text-sm text-muted-foreground">
                You have unlimited access to all features for testing purposes.
              </p>
            </div>
          </div>
        )}

        {/* Current Plan */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  {subscription?.tier === "free"
                    ? "You are on the free tier"
                    : `You are subscribed to the ${SUBSCRIPTION_TIERS[subscription?.tier as SubscriptionTier]?.name || subscription?.tier} plan`}
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="text-xl font-bold">
                  {SUBSCRIPTION_TIERS[subscription?.tier as SubscriptionTier]?.name || "Free"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">RAMS This Month</p>
                <p className="text-xl font-bold">
                  {subscription?.ramsUsedThisMonth} / {formatLimit(subscription?.ramsLimit ?? 1)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">Templates</p>
                <p className="text-xl font-bold">
                  {subscription?.templateCount} / {formatLimit(subscription?.templateLimit ?? 0)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                <p className="text-xl font-bold">
                  {subscription?.teamMembers} / {subscription?.teamLimit}
                </p>
              </div>
            </div>

            {/* Credits for pay-per-use */}
            {subscription?.tier === "pay_per_use" && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <p className="text-sm text-amber-400 mb-1">Available Credits</p>
                <p className="text-2xl font-bold text-amber-400">
                  {subscription?.credits} RAMS
                </p>
              </div>
            )}

            {subscription?.tier !== "free" && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                loading={portalLoading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm", !isAnnual && "text-primary font-medium")}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              "relative w-14 h-7 rounded-full transition-colors",
              isAnnual ? "bg-primary" : "bg-white/20"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
                isAnnual ? "translate-x-8" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-sm", isAnnual && "text-primary font-medium")}>
            Annual <span className="text-primary">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {displayTiers.map((tier) => {
            const isCurrent = isCurrentTier(tier);
            const isPopular = tier.popular;

            return (
              <Card
                key={tier.id}
                variant="glass"
                className={cn(
                  "relative",
                  isCurrent && "border-primary ring-2 ring-primary",
                  isPopular && !isCurrent && "border-primary"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                {tier.savings && (
                  <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {tier.savings}
                  </div>
                )}
                <CardHeader className={cn(isPopular && "pt-8")}>
                  <div className="flex items-center gap-2">
                    {getTierIcon(tier)}
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{tier.description}</CardDescription>
                  <div className="mt-4">
                    {tier.billingPeriod === "free" ? (
                      <span className="text-3xl font-bold">£0</span>
                    ) : tier.billingPeriod === "one-time" ? (
                      <>
                        <span className="text-3xl font-bold">£{tier.price}</span>
                        <span className="text-muted-foreground text-sm">/RAMS</span>
                      </>
                    ) : tier.billingPeriod === "annual" ? (
                      <>
                        <span className="text-3xl font-bold">
                          £{Math.round(tier.price / 12)}
                        </span>
                        <span className="text-muted-foreground text-sm">/mo</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Billed annually (£{tier.price})
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">£{tier.price}</span>
                        <span className="text-muted-foreground text-sm">/mo</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Limits summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-lg font-bold">
                        {tier.limits.ramsPerMonth === null ? "∞" : tier.limits.ramsPerMonth}
                      </p>
                      <p className="text-xs text-muted-foreground">RAMS/mo</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-lg font-bold">
                        {tier.limits.templates === null ? "∞" : tier.limits.templates}
                      </p>
                      <p className="text-xs text-muted-foreground">Templates</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-lg font-bold">{tier.limits.users}</p>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </div>
                  </div>

                  {isCurrent ? (
                    <div className="w-full mb-4 py-2 text-center text-sm text-primary border border-primary rounded-lg">
                      Current Plan
                    </div>
                  ) : tier.id === "free" ? (
                    <Button variant="outline" className="w-full mb-4" disabled>
                      Free Plan
                    </Button>
                  ) : (
                    <Button
                      variant={isPopular ? "default" : "outline"}
                      className="w-full mb-4"
                      onClick={() => handleCheckout(tier.id)}
                      loading={checkoutLoading === tier.id}
                    >
                      {tier.billingPeriod === "one-time" ? "Buy Credits" : "Upgrade"}
                    </Button>
                  )}

                  <ul className="space-y-1.5">
                    {tier.features.slice(0, 6).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.features.length > 6 && (
                      <li className="text-xs text-muted-foreground pl-5">
                        +{tier.features.length - 6} more features
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ / Help */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">What counts as a RAMS generation?</h4>
              <p className="text-sm text-muted-foreground">
                Each time you use AI to generate a new RAMS document counts as one generation.
                AI edits to existing documents are unlimited on all paid plans.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Can I change my plan later?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately, and we&apos;ll prorate any charges.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit and debit cards through our secure payment processor, Stripe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
