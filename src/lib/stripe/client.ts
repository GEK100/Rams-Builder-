// Client-safe subscription tier definitions
// This file can be imported in both client and server components

import type { SubscriptionTier } from "@/types/subscription";

export interface TierDefinition {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: number; // In pounds for display
  priceId?: string; // Stripe price ID (set in env)
  billingPeriod: "monthly" | "annual" | "one-time" | "free";
  features: string[];
  limits: {
    ramsPerMonth: number | null; // null = unlimited
    templates: number | null; // null = unlimited, 0 = none
    users: number;
    aiEdits: "unlimited" | number;
  };
  popular?: boolean;
  savings?: string;
}

// Subscription tiers with full details
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierDefinition> = {
  free: {
    id: "free",
    name: "Free",
    description: "Try RAMS Builder with limited features",
    price: 0,
    billingPeriod: "free",
    features: [
      "1 RAMS document per month",
      "Unlimited AI edits",
      "Basic trade widgets",
      "Standard risk matrix",
      "PDF export only",
    ],
    limits: {
      ramsPerMonth: 1,
      templates: 0,
      users: 1,
      aiEdits: "unlimited",
    },
  },
  pay_per_use: {
    id: "pay_per_use",
    name: "Pay Per Use",
    description: "Pay only for what you need",
    price: 20,
    billingPeriod: "one-time",
    features: [
      "£20 per RAMS document",
      "Unlimited AI edits per document",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Process library access",
    ],
    limits: {
      ramsPerMonth: null, // Credit-based
      templates: 0,
      users: 1,
      aiEdits: "unlimited",
    },
  },
  starter_monthly: {
    id: "starter_monthly",
    name: "Starter",
    description: "For individual contractors",
    price: 59,
    billingPeriod: "monthly",
    features: [
      "10 RAMS documents per month",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Save up to 10 templates",
      "Process library access",
      "5 team members",
    ],
    limits: {
      ramsPerMonth: 10,
      templates: 10,
      users: 5,
      aiEdits: "unlimited",
    },
    popular: true,
  },
  starter_annual: {
    id: "starter_annual",
    name: "Starter Annual",
    description: "For individual contractors - save 20%",
    price: 566,
    billingPeriod: "annual",
    features: [
      "10 RAMS documents per month",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Save up to 10 templates",
      "Process library access",
      "5 team members",
      "Save 20% vs monthly",
    ],
    limits: {
      ramsPerMonth: 10,
      templates: 10,
      users: 5,
      aiEdits: "unlimited",
    },
    savings: "Save £142/year",
  },
  professional_monthly: {
    id: "professional_monthly",
    name: "Professional",
    description: "For growing businesses",
    price: 119,
    billingPeriod: "monthly",
    features: [
      "30 RAMS documents per month",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Unlimited custom templates",
      "Process library + custom processes",
      "3 team members",
      "Priority support",
    ],
    limits: {
      ramsPerMonth: 30,
      templates: null, // Unlimited
      users: 3,
      aiEdits: "unlimited",
    },
  },
  professional_annual: {
    id: "professional_annual",
    name: "Professional Annual",
    description: "For growing businesses - save 20%",
    price: 1142,
    billingPeriod: "annual",
    features: [
      "30 RAMS documents per month",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Unlimited custom templates",
      "Process library + custom processes",
      "3 team members",
      "Priority support",
      "Save 20% vs monthly",
    ],
    limits: {
      ramsPerMonth: 30,
      templates: null,
      users: 3,
      aiEdits: "unlimited",
    },
    savings: "Save £286/year",
  },
  team_monthly: {
    id: "team_monthly",
    name: "Team",
    description: "For larger teams with high volume",
    price: 199,
    billingPeriod: "monthly",
    features: [
      "Unlimited RAMS documents",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Unlimited custom templates",
      "Process library + custom processes",
      "10 team members",
      "Priority support",
      "Dedicated account manager",
    ],
    limits: {
      ramsPerMonth: null, // Unlimited
      templates: null,
      users: 10,
      aiEdits: "unlimited",
    },
  },
  team_annual: {
    id: "team_annual",
    name: "Team Annual",
    description: "For larger teams - save 20%",
    price: 1910,
    billingPeriod: "annual",
    features: [
      "Unlimited RAMS documents",
      "Unlimited AI edits",
      "All trade widgets",
      "AI-powered content generation",
      "Word & PDF export",
      "Unlimited custom templates",
      "Process library + custom processes",
      "10 team members",
      "Priority support",
      "Dedicated account manager",
      "Save 20% vs monthly",
    ],
    limits: {
      ramsPerMonth: null,
      templates: null,
      users: 10,
      aiEdits: "unlimited",
    },
    savings: "Save £478/year",
  },
} as const;

// Helper to get tiers for display (monthly vs annual grouped)
export function getDisplayTiers(showAnnual: boolean = false): TierDefinition[] {
  if (showAnnual) {
    return [
      SUBSCRIPTION_TIERS.free,
      SUBSCRIPTION_TIERS.pay_per_use,
      SUBSCRIPTION_TIERS.starter_annual,
      SUBSCRIPTION_TIERS.professional_annual,
      SUBSCRIPTION_TIERS.team_annual,
    ];
  }
  return [
    SUBSCRIPTION_TIERS.free,
    SUBSCRIPTION_TIERS.pay_per_use,
    SUBSCRIPTION_TIERS.starter_monthly,
    SUBSCRIPTION_TIERS.professional_monthly,
    SUBSCRIPTION_TIERS.team_monthly,
  ];
}

// Get tier by ID
export function getTierById(id: SubscriptionTier): TierDefinition {
  return SUBSCRIPTION_TIERS[id];
}

// Check if tier is unlimited
export function hasUnlimitedRams(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].limits.ramsPerMonth === null;
}

// Check if tier allows custom templates
export function allowsTemplates(tier: SubscriptionTier): boolean {
  const limits = SUBSCRIPTION_TIERS[tier].limits;
  return limits.templates === null || limits.templates > 0;
}

// Get the annual equivalent of a monthly tier
export function getAnnualEquivalent(tier: SubscriptionTier): SubscriptionTier | null {
  const mapping: Partial<Record<SubscriptionTier, SubscriptionTier>> = {
    starter_monthly: "starter_annual",
    professional_monthly: "professional_annual",
    team_monthly: "team_annual",
  };
  return mapping[tier] || null;
}

// Get the monthly equivalent of an annual tier
export function getMonthlyEquivalent(tier: SubscriptionTier): SubscriptionTier | null {
  const mapping: Partial<Record<SubscriptionTier, SubscriptionTier>> = {
    starter_annual: "starter_monthly",
    professional_annual: "professional_monthly",
    team_annual: "team_monthly",
  };
  return mapping[tier] || null;
}
