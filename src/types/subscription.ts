export type SubscriptionTier = "free" | "pay_per_use" | "monthly" | "annual";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  ramsLimit: number | null; // null = unlimited
  ramsUsedThisPeriod: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  action: "rams_created" | "rams_exported" | "ai_generation";
  ramsId?: string;
  creditsUsed: number;
  createdAt: string;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, number | null> = {
  free: 2,
  pay_per_use: null, // Credit-based
  monthly: null, // Unlimited
  annual: null, // Unlimited
};

export const SUBSCRIPTION_PRICES = {
  free: 0,
  pay_per_use: 5, // Per RAMS
  monthly: 29,
  annual: 290, // ~17% discount
} as const;
