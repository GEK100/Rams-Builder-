"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { getDisplayTiers } from "@/lib/stripe/client";
import { Check, Zap, FileText, Shield, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const displayTiers = getDisplayTiers(isAnnual);

  const handleCheckout = async (tierId: string) => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
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
    }
  };

  const getTierIcon = (tierId: string) => {
    if (tierId === "free") return <FileText className="h-5 w-5 text-muted-foreground" />;
    if (tierId === "pay_per_use") return <Zap className="h-5 w-5 text-amber-400" />;
    if (tierId.startsWith("starter")) return <Shield className="h-5 w-5 text-blue-400" />;
    if (tierId.startsWith("professional")) return <Star className="h-5 w-5 text-primary" />;
    if (tierId.startsWith("team")) return <Users className="h-5 w-5 text-purple-400" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary" />
            <span className="font-bold text-xl">RAMS Builder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple pricing. No per-user nonsense.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that works best for you. Start free and upgrade as you grow.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm font-medium", !isAnnual && "text-primary")}>Monthly</span>
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
            <span className={cn("text-sm font-medium", isAnnual && "text-primary")}>
              Annual <span className="text-emerald-400">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {displayTiers.map((tier) => (
              <Card
                key={tier.id}
                variant="glass"
                className={cn(
                  "relative",
                  tier.popular && "border-primary ring-2 ring-primary"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                {tier.savings && (
                  <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {tier.savings}
                  </div>
                )}
                <CardHeader className={cn(tier.popular && "pt-8")}>
                  <div className="flex items-center gap-2">
                    {getTierIcon(tier.id)}
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
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

                  {tier.id === "free" ? (
                    <Link href="/register">
                      <Button variant="outline" className="w-full mb-4">
                        Get Started
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant={tier.popular ? "default" : "outline"}
                      className="w-full mb-4"
                      onClick={() => handleCheckout(tier.id)}
                    >
                      {tier.billingPeriod === "one-time" ? "Buy Credits" : "Start Free Trial"}
                    </Button>
                  )}

                  <ul className="space-y-2">
                    {tier.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.features.length > 5 && (
                      <li className="text-xs text-muted-foreground pl-6">
                        +{tier.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center mt-8 text-muted-foreground">
            All paid plans include unlimited edits and full access to the activity checklist.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit and debit cards through our secure payment provider,
                Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 14-day money-back guarantee on all subscription plans. Pay-per-use
                purchases are non-refundable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I switch plans?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately and we&apos;ll prorate any charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} RAMS Builder by Ictus Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
