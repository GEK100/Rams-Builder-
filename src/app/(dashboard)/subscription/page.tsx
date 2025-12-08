"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { SUBSCRIPTION_TIERS } from "@/lib/stripe/client";
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  CreditCard,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionData {
  tier: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  ramsUsedThisMonth: number;
  ramsLimit: number;
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
        // For now, set default free tier data
        setSubscription({
          tier: "free",
          status: "active",
          ramsUsedThisMonth: data.dataSummary?.ramsDocuments || 0,
          ramsLimit: 2,
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (tier: string) => {
    setCheckoutLoading(tier);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, isAnnual }),
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
        {/* Current Plan */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  {subscription?.tier === "free"
                    ? "You are on the free tier"
                    : `You are subscribed to the ${subscription?.tier} plan`}
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="text-xl font-bold capitalize">{subscription?.tier || "Free"}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">RAMS This Month</p>
                <p className="text-xl font-bold">
                  {subscription?.ramsUsedThisMonth} / {subscription?.ramsLimit === -1 ? "∞" : subscription?.ramsLimit}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-xl font-bold capitalize text-emerald-400">
                  {subscription?.status || "Active"}
                </p>
              </div>
            </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Free */}
          <Card variant="glass" className={cn(subscription?.tier === "free" && "border-primary")}>
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Get started with basic features</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">£0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              {subscription?.tier === "free" ? (
                <div className="w-full mb-4 py-2 text-center text-sm text-primary border border-primary rounded-lg">
                  Current Plan
                </div>
              ) : (
                <Button variant="outline" className="w-full mb-4" disabled>
                  Downgrade
                </Button>
              )}
              <ul className="space-y-2">
                {SUBSCRIPTION_TIERS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pay Per Use */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-xl">Pay Per Use</CardTitle>
              </div>
              <CardDescription>Pay only for what you use</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">£4.99</span>
                <span className="text-muted-foreground">/document</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => handleCheckout("pay_per_use")}
                loading={checkoutLoading === "pay_per_use"}
              >
                Buy Credits
              </Button>
              <ul className="space-y-2">
                {SUBSCRIPTION_TIERS.pay_per_use.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Professional - Most Popular */}
          <Card variant="glass" className={cn("border-primary", subscription?.tier === "monthly" && "ring-2 ring-primary")}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <CardHeader className="pt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Professional</CardTitle>
              </div>
              <CardDescription>For regular users</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  £{isAnnual ? "23.99" : "29.99"}
                </span>
                <span className="text-muted-foreground">/month</span>
                {isAnnual && (
                  <p className="text-xs text-primary mt-1">Billed annually (£287.88)</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {subscription?.tier === "monthly" || subscription?.tier === "annual" ? (
                <div className="w-full mb-4 py-2 text-center text-sm text-primary border border-primary rounded-lg">
                  Current Plan
                </div>
              ) : (
                <Button
                  className="w-full mb-4"
                  onClick={() => handleCheckout(isAnnual ? "annual" : "monthly")}
                  loading={checkoutLoading === "monthly" || checkoutLoading === "annual"}
                >
                  Upgrade Now
                </Button>
              )}
              <ul className="space-y-2">
                {SUBSCRIPTION_TIERS.monthly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-xl">Enterprise</CardTitle>
              </div>
              <CardDescription>For large organizations</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-4">
                Contact Sales
              </Button>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
