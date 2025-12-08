import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  companyName: z.string().max(200).optional(),
  marketingConsent: z.boolean().optional(),
});

/**
 * GDPR Article 15 - Right of Access
 * Get user profile and data summary
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

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get data counts for transparency
    const [ramsCount, widgetCount, riskCount] = await Promise.all([
      supabase.from("rams_documents").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("rams_widgets").select("id", { count: "exact", head: true }),
      supabase.from("rams_risk_assessments").select("id", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: !!user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
      },
      profile: profile || null,
      dataSummary: {
        ramsDocuments: ramsCount.count || 0,
        widgets: widgetCount.count || 0,
        riskAssessments: riskCount.count || 0,
      },
      gdprRights: {
        dataExportUrl: "/api/user/data-export",
        deleteAccountUrl: "/api/user/delete-account",
        privacyPolicyUrl: "/privacy",
        cookiePolicyUrl: "/cookies",
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * GDPR Article 16 - Right to Rectification
 * Update user profile data
 */
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const validationResult = UpdateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data provided", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Update user metadata in auth
    if (updates.fullName !== undefined) {
      await supabase.auth.updateUser({
        data: { full_name: updates.fullName },
      });
    }

    // Update profile in database
    const { error: updateError } = await supabase
      .from("user_profiles")
      .upsert({
        id: user.id,
        full_name: updates.fullName,
        company_name: updates.companyName,
        marketing_consent: updates.marketingConsent,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
