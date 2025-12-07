import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { z } from "zod";

const DeleteAccountSchema = z.object({
  confirmEmail: z.string().email(),
  confirmText: z.literal("DELETE MY ACCOUNT"),
});

/**
 * GDPR Article 17 - Right to Erasure ("Right to be Forgotten")
 * Delete user account and all associated data
 */
export async function POST(request: NextRequest) {
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

    // Rate limit: 3 attempts per hour
    const rateLimitResult = checkRateLimit(`delete-account:${user.id}`, { maxRequests: 3, windowMs: 3600000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = DeleteAccountSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request. Please confirm by typing 'DELETE MY ACCOUNT' and your email." },
        { status: 400 }
      );
    }

    const { confirmEmail } = validationResult.data;

    // Verify email matches
    if (confirmEmail.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match your account email." },
        { status: 400 }
      );
    }

    // Use service role to delete user data (bypasses RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Delete all user data in order (respecting foreign key constraints)
    // 1. Delete contextual answers
    await supabaseAdmin
      .from("contextual_answers")
      .delete()
      .eq("user_id", user.id);

    // 2. Delete risk assessments
    await supabaseAdmin
      .from("risk_assessments")
      .delete()
      .eq("user_id", user.id);

    // 3. Delete widgets
    await supabaseAdmin
      .from("widgets")
      .delete()
      .eq("user_id", user.id);

    // 4. Delete RAMS revisions (if exists)
    await supabaseAdmin
      .from("rams_revisions")
      .delete()
      .eq("user_id", user.id);

    // 5. Delete RAMS documents
    await supabaseAdmin
      .from("rams")
      .delete()
      .eq("user_id", user.id);

    // 6. Delete payments
    await supabaseAdmin
      .from("payments")
      .delete()
      .eq("user_id", user.id);

    // 7. Delete subscription
    await supabaseAdmin
      .from("subscriptions")
      .delete()
      .eq("user_id", user.id);

    // 8. Delete user profile
    await supabaseAdmin
      .from("user_profiles")
      .delete()
      .eq("id", user.id);

    // 9. Delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    // Log the deletion for audit purposes (without PII)
    console.log(`[GDPR] Account deleted: ${user.id} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently deleted.",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support." },
      { status: 500 }
    );
  }
}
