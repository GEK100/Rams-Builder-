export type SubscriptionTier =
  | "free"
  | "pay_per_use"
  | "starter_monthly"
  | "starter_annual"
  | "professional_monthly"
  | "professional_annual"
  | "team_monthly"
  | "team_annual";

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
  templateLimit: number | null; // null = unlimited, 0 = none
  userLimit: number;
  credits: number; // For pay-per-use
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

// Tier limits configuration
export interface TierLimits {
  ramsPerMonth: number | null; // null = unlimited
  templates: number | null; // null = unlimited, 0 = none
  users: number;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: { ramsPerMonth: 1, templates: 0, users: 1 },
  pay_per_use: { ramsPerMonth: null, templates: 0, users: 1 }, // Credit-based
  starter_monthly: { ramsPerMonth: 10, templates: 10, users: 5 },
  starter_annual: { ramsPerMonth: 10, templates: 10, users: 5 },
  professional_monthly: { ramsPerMonth: 30, templates: null, users: 3 },
  professional_annual: { ramsPerMonth: 30, templates: null, users: 3 },
  team_monthly: { ramsPerMonth: null, templates: null, users: 10 },
  team_annual: { ramsPerMonth: null, templates: null, users: 10 },
};

// Prices in pence (for Stripe)
export const SUBSCRIPTION_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  pay_per_use: 2000, // £20 per RAMS
  starter_monthly: 5900, // £59/month
  starter_annual: 56600, // £566/year (20% off)
  professional_monthly: 11900, // £119/month
  professional_annual: 114200, // £1,142/year (20% off)
  team_monthly: 19900, // £199/month
  team_annual: 191000, // £1,910/year (20% off)
};

// Display prices in pounds
export const SUBSCRIPTION_DISPLAY_PRICES: Record<SubscriptionTier, string> = {
  free: "£0",
  pay_per_use: "£20/RAMS",
  starter_monthly: "£59/mo",
  starter_annual: "£566/yr",
  professional_monthly: "£119/mo",
  professional_annual: "£1,142/yr",
  team_monthly: "£199/mo",
  team_annual: "£1,910/yr",
};

// Helper to check if tier is paid
export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier !== "free";
}

// Helper to check if tier allows templates
export function canUseTemplates(tier: SubscriptionTier): boolean {
  const limits = SUBSCRIPTION_LIMITS[tier];
  return limits.templates === null || limits.templates > 0;
}

// Helper to get monthly equivalent price for annual tiers
export function getMonthlyEquivalent(tier: SubscriptionTier): number {
  const yearlyTiers: SubscriptionTier[] = ["starter_annual", "professional_annual", "team_annual"];
  if (yearlyTiers.includes(tier)) {
    return SUBSCRIPTION_PRICES[tier] / 12 / 100; // Convert pence to pounds and divide by 12
  }
  return SUBSCRIPTION_PRICES[tier] / 100;
}
