import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUBSCRIPTION_LIMITS, type SubscriptionTier } from "@/types/subscription";

// Admin emails that bypass all limits
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  isAdmin?: boolean;
  remainingGenerations?: number;
  tier?: SubscriptionTier;
  credits?: number;
}

export interface TemplateCheckResult {
  allowed: boolean;
  reason?: string;
  isAdmin?: boolean;
  remainingTemplates?: number;
  tier?: SubscriptionTier;
}

export interface TeamCheckResult {
  allowed: boolean;
  reason?: string;
  isAdmin?: boolean;
  remainingSeats?: number;
  tier?: SubscriptionTier;
}

/**
 * Check if user email is an admin (bypasses all limits)
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get Supabase client for server-side usage checking
 */
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Check if user can generate a new RAMS document
 * Checks: admin bypass, tier limits, monthly usage, credits (pay-per-use)
 */
export async function canGenerateRAMS(userId: string, userEmail?: string): Promise<UsageCheckResult> {
  // Admin bypass
  if (isAdminEmail(userEmail)) {
    return {
      allowed: true,
      isAdmin: true,
      reason: "Admin account - unlimited access",
    };
  }

  const supabase = await getSupabaseClient();

  // Get subscription
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !subscription) {
    return {
      allowed: false,
      reason: "No subscription found",
    };
  }

  const tier = subscription.tier as SubscriptionTier;
  const limits = SUBSCRIPTION_LIMITS[tier];

  // Check if period has ended and reset if needed
  const now = new Date();
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;

  if (periodEnd && now > periodEnd) {
    // Reset usage for new period
    const newPeriodStart = now.toISOString();
    const newPeriodEnd = new Date(now);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

    await supabase
      .from("subscriptions")
      .update({
        rams_used_this_period: 0,
        current_period_start: newPeriodStart,
        current_period_end: newPeriodEnd.toISOString(),
      })
      .eq("user_id", userId);

    subscription.rams_used_this_period = 0;
  }

  // Pay-per-use: Check credits
  if (tier === "pay_per_use") {
    const credits = subscription.credits || 0;
    if (credits <= 0) {
      return {
        allowed: false,
        reason: "No credits remaining. Purchase more credits to continue.",
        tier,
        credits: 0,
      };
    }
    return {
      allowed: true,
      tier,
      credits,
      remainingGenerations: credits,
    };
  }

  // Check monthly limit
  if (limits.ramsPerMonth !== null) {
    const used = subscription.rams_used_this_period || 0;
    const remaining = limits.ramsPerMonth - used;

    if (remaining <= 0) {
      return {
        allowed: false,
        reason: `Monthly limit reached (${limits.ramsPerMonth} RAMS). Upgrade your plan or wait for next month.`,
        tier,
        remainingGenerations: 0,
      };
    }

    return {
      allowed: true,
      tier,
      remainingGenerations: remaining,
    };
  }

  // Unlimited tier
  return {
    allowed: true,
    tier,
    remainingGenerations: undefined, // Unlimited
  };
}

/**
 * Record a RAMS generation and update usage
 */
export async function recordRAMSGeneration(userId: string, ramsId: string): Promise<boolean> {
  const supabase = await getSupabaseClient();

  // Get subscription
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("tier, credits, rams_used_this_period")
    .eq("user_id", userId)
    .single();

  if (error || !subscription) {
    console.error("Failed to get subscription for recording:", error);
    return false;
  }

  const tier = subscription.tier as SubscriptionTier;

  // Pay-per-use: Deduct credit
  if (tier === "pay_per_use") {
    const newCredits = Math.max(0, (subscription.credits || 0) - 1);
    await supabase.from("subscriptions").update({ credits: newCredits }).eq("user_id", userId);
  } else {
    // Increment usage for monthly-limited tiers
    const newUsage = (subscription.rams_used_this_period || 0) + 1;
    await supabase.from("subscriptions").update({ rams_used_this_period: newUsage }).eq("user_id", userId);
  }

  // Log the usage
  await supabase.from("usage_logs").insert({
    user_id: userId,
    action: "ai_generation",
    rams_id: ramsId,
    credits_used: tier === "pay_per_use" ? 1 : 0,
  });

  return true;
}

/**
 * Check if user can save a template
 */
export async function canSaveTemplate(userId: string, userEmail?: string): Promise<TemplateCheckResult> {
  // Admin bypass
  if (isAdminEmail(userEmail)) {
    return {
      allowed: true,
      isAdmin: true,
      reason: "Admin account - unlimited access",
    };
  }

  const supabase = await getSupabaseClient();

  // Get subscription
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("tier, template_limit")
    .eq("user_id", userId)
    .single();

  if (error || !subscription) {
    return {
      allowed: false,
      reason: "No subscription found",
    };
  }

  const tier = subscription.tier as SubscriptionTier;
  const limits = SUBSCRIPTION_LIMITS[tier];

  // Check if templates are allowed
  if (limits.templates === 0) {
    return {
      allowed: false,
      reason: "Templates are not available on the free tier. Upgrade to save templates.",
      tier,
      remainingTemplates: 0,
    };
  }

  // Unlimited templates
  if (limits.templates === null) {
    return {
      allowed: true,
      tier,
      remainingTemplates: undefined,
    };
  }

  // Count existing templates
  const { count } = await supabase
    .from("user_templates")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const templateCount = count || 0;
  const remaining = limits.templates - templateCount;

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `Template limit reached (${limits.templates}). Upgrade to save more templates.`,
      tier,
      remainingTemplates: 0,
    };
  }

  return {
    allowed: true,
    tier,
    remainingTemplates: remaining,
  };
}

/**
 * Check if user can add a team member
 */
export async function canAddTeamMember(userId: string, userEmail?: string): Promise<TeamCheckResult> {
  // Admin bypass
  if (isAdminEmail(userEmail)) {
    return {
      allowed: true,
      isAdmin: true,
      reason: "Admin account - unlimited access",
    };
  }

  const supabase = await getSupabaseClient();

  // Get subscription
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("tier, user_limit")
    .eq("user_id", userId)
    .single();

  if (error || !subscription) {
    return {
      allowed: false,
      reason: "No subscription found",
    };
  }

  const tier = subscription.tier as SubscriptionTier;
  const limits = SUBSCRIPTION_LIMITS[tier];

  // Single user tier
  if (limits.users <= 1) {
    return {
      allowed: false,
      reason: "Team members are not available on this tier. Upgrade to add team members.",
      tier,
      remainingSeats: 0,
    };
  }

  // Count existing team members
  const { count } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  const memberCount = (count || 0) + 1; // Include owner
  const remaining = limits.users - memberCount;

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `Team member limit reached (${limits.users}). Upgrade to add more members.`,
      tier,
      remainingSeats: 0,
    };
  }

  return {
    allowed: true,
    tier,
    remainingSeats: remaining,
  };
}

/**
 * Get current usage summary for dashboard display
 */
export async function getUsageSummary(userId: string, userEmail?: string) {
  const isAdmin = isAdminEmail(userEmail);
  const supabase = await getSupabaseClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!subscription) {
    return {
      isAdmin,
      tier: "free" as SubscriptionTier,
      ramsUsed: 0,
      ramsLimit: 1,
      templatesUsed: 0,
      templatesLimit: 0,
      teamMembers: 1,
      teamLimit: 1,
      credits: 0,
    };
  }

  const tier = subscription.tier as SubscriptionTier;
  const limits = SUBSCRIPTION_LIMITS[tier];

  // Get template count
  const { count: templateCount } = await supabase
    .from("user_templates")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get team member count
  const { count: teamCount } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  return {
    isAdmin,
    tier,
    ramsUsed: subscription.rams_used_this_period || 0,
    ramsLimit: limits.ramsPerMonth,
    templatesUsed: templateCount || 0,
    templatesLimit: limits.templates,
    teamMembers: (teamCount || 0) + 1, // Include owner
    teamLimit: limits.users,
    credits: subscription.credits || 0,
    periodEnd: subscription.current_period_end,
  };
}
