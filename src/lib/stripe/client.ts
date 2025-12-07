// Client-safe subscription tier definitions
// This file can be imported in both client and server components

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    id: "free",
    name: "Free",
    description: "Get started with basic RAMS creation",
    price: 0,
    features: [
      "1-2 RAMS documents per month",
      "Basic trade widgets",
      "Standard risk matrix",
      "PDF export only",
    ],
    limits: {
      monthlyRams: 2,
      customTemplates: false,
      aiGeneration: false,
      wordExport: false,
      revisionHistory: false,
    },
  },
  pay_per_use: {
    id: "pay_per_use",
    name: "Pay Per Use",
    description: "Pay only for what you use",
    price: 4.99,
    features: [
      "£4.99 per RAMS document",
      "All trade widgets",
      "AI-powered content generation",
      "Word document export",
      "Email support",
    ],
    limits: {
      monthlyRams: null, // Unlimited
      customTemplates: false,
      aiGeneration: true,
      wordExport: true,
      revisionHistory: false,
    },
  },
  monthly: {
    id: "monthly",
    name: "Professional Monthly",
    description: "Perfect for regular users",
    price: 29.99,
    features: [
      "Unlimited RAMS documents",
      "All trade widgets",
      "AI-powered content generation",
      "Word document export",
      "Custom templates",
      "Full revision history",
      "Priority support",
    ],
    limits: {
      monthlyRams: null,
      customTemplates: true,
      aiGeneration: true,
      wordExport: true,
      revisionHistory: true,
    },
  },
  annual: {
    id: "annual",
    name: "Professional Annual",
    description: "Best value - save 20%",
    price: 287.88, // £23.99/month billed annually
    features: [
      "Unlimited RAMS documents",
      "All trade widgets",
      "AI-powered content generation",
      "Word document export",
      "Custom templates",
      "Full revision history",
      "Priority support",
      "Save 20% vs monthly",
    ],
    limits: {
      monthlyRams: null,
      customTemplates: true,
      aiGeneration: true,
      wordExport: true,
      revisionHistory: true,
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
