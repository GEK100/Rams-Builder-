"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { SUBSCRIPTION_TIERS } from "@/lib/stripe/client";
import { Check, Zap, FileText, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCheckout = async (tier: string) => {
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
    }
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that works best for you. Start free and upgrade as you grow.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm", !isAnnual && "text-primary")}>Monthly</span>
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
            <span className={cn("text-sm", isAnnual && "text-primary")}>
              Annual <span className="text-primary">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card variant="glass" className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Get started with basic features</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/register">
                  <Button variant="outline" className="w-full mb-6">
                    Get Started
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {SUBSCRIPTION_TIERS.free.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pay Per Use */}
            <Card variant="glass" className="relative">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <CardTitle className="text-2xl">Pay Per Use</CardTitle>
                </div>
                <CardDescription>Pay only for what you use</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£4.99</span>
                  <span className="text-muted-foreground">/document</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full mb-6"
                  onClick={() => handleCheckout("pay_per_use")}
                >
                  Buy Credits
                </Button>
                <ul className="space-y-3">
                  {SUBSCRIPTION_TIERS.pay_per_use.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Monthly - Most Popular */}
            <Card variant="glass" className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Professional</CardTitle>
                </div>
                <CardDescription>For regular users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    £{isAnnual ? "23.99" : "29.99"}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {isAnnual && (
                    <p className="text-sm text-primary mt-1">Billed annually (£287.88)</p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full mb-6"
                  onClick={() => handleCheckout(isAnnual ? "annual" : "monthly")}
                >
                  Start Free Trial
                </Button>
                <ul className="space-y-3">
                  {SUBSCRIPTION_TIERS.monthly.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card variant="glass" className="relative">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                </div>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-6">
                  Contact Sales
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>SLA guarantee</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>On-premise deployment option</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
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
                Yes, you can cancel your subscription at any time. You'll continue to have access
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
                immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 RAMS Builder by Ictus Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
