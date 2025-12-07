import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

/**
 * GDPR Article 20 - Right to Data Portability
 * Export all user data in a machine-readable format (JSON)
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 1 export per hour
    const rateLimitResult = checkRateLimit(`data-export:${user.id}`, { maxRequests: 1, windowMs: 3600000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "You can only export your data once per hour. Please try again later." },
        { status: 429 }
      );
    }

    // Collect all user data
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      exportType: "GDPR_DATA_EXPORT",
      user: {
        id: user.id,
        email: user.email,
        emailConfirmedAt: user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        metadata: user.user_metadata,
      },
    };

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      exportData.profile = profile;
    }

    // Get user's RAMS documents
    const { data: ramsDocuments } = await supabase
      .from("rams")
      .select("*")
      .eq("user_id", user.id);

    if (ramsDocuments) {
      exportData.ramsDocuments = ramsDocuments;
    }

    // Get user's widgets
    const { data: widgets } = await supabase
      .from("widgets")
      .select("*")
      .eq("user_id", user.id);

    if (widgets) {
      exportData.widgets = widgets;
    }

    // Get user's risk assessments
    const { data: riskAssessments } = await supabase
      .from("risk_assessments")
      .select("*")
      .eq("user_id", user.id);

    if (riskAssessments) {
      exportData.riskAssessments = riskAssessments;
    }

    // Get user's contextual answers
    const { data: contextualAnswers } = await supabase
      .from("contextual_answers")
      .select("*")
      .eq("user_id", user.id);

    if (contextualAnswers) {
      exportData.contextualAnswers = contextualAnswers;
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subscription) {
      // Remove sensitive Stripe IDs for security
      exportData.subscription = {
        tier: subscription.tier,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        createdAt: subscription.created_at,
      };
    }

    // Get user's payment history (without sensitive details)
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, currency, status, paid_at, created_at")
      .eq("user_id", user.id);

    if (payments) {
      exportData.paymentHistory = payments;
    }

    // Return as downloadable JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const filename = `rams-builder-data-export-${new Date().toISOString().split('T')[0]}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
