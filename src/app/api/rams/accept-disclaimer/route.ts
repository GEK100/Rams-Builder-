import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import crypto from "crypto";

const AcceptDisclaimerSchema = z.object({
  ramsId: z.string().uuid(),
  ramsVersion: z.number().int().positive().optional().default(1),
  generatedContent: z.string().optional(), // Used to create document hash
});

/**
 * Records user acceptance of the RAMS disclaimer
 * This creates an audit trail for liability purposes
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

    const body = await request.json();
    const validationResult = AcceptDisclaimerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { ramsId, ramsVersion, generatedContent } = validationResult.data;

    // Verify user owns this RAMS
    const { data: rams, error: ramsError } = await supabase
      .from("rams_documents")
      .select("id, user_id, title, version")
      .eq("id", ramsId)
      .single();

    if (ramsError || !rams) {
      return NextResponse.json({ error: "RAMS not found" }, { status: 404 });
    }

    if (rams.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create document hash if content provided
    let documentHash: string | null = null;
    if (generatedContent) {
      documentHash = crypto
        .createHash("sha256")
        .update(generatedContent)
        .digest("hex");
    }

    // Get client info
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] ||
                      request.headers.get("x-real-ip") ||
                      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Record the acceptance
    const { data: acceptance, error: insertError } = await supabase
      .from("rams_disclaimer_acceptances")
      .upsert({
        rams_id: ramsId,
        user_id: user.id,
        rams_version: ramsVersion || rams.version || 1,
        document_hash: documentHash,
        ip_address: ipAddress,
        user_agent: userAgent,
        disclaimer_version: "1.0",
        accepted_at: new Date().toISOString(),
      }, {
        onConflict: "rams_id,user_id,rams_version",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error recording disclaimer acceptance:", insertError);
      return NextResponse.json(
        { error: "Failed to record acceptance" },
        { status: 500 }
      );
    }

    // Update download count on RAMS document
    await supabase
      .from("rams_documents")
      .update({
        download_count: (rams as unknown as { download_count?: number }).download_count
          ? (rams as unknown as { download_count: number }).download_count + 1
          : 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq("id", ramsId);

    // Log for audit purposes
    console.log(`[DISCLAIMER] User ${user.id} accepted disclaimer for RAMS ${ramsId} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      acceptanceId: acceptance.id,
      acceptedAt: acceptance.accepted_at,
      message: "Disclaimer acceptance recorded",
    });
  } catch (error) {
    console.error("Disclaimer acceptance error:", error);
    return NextResponse.json(
      { error: "Failed to record disclaimer acceptance" },
      { status: 500 }
    );
  }
}

/**
 * Check if user has already accepted disclaimer for a RAMS
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

    const { searchParams } = new URL(request.url);
    const ramsId = searchParams.get("ramsId");

    if (!ramsId) {
      return NextResponse.json({ error: "ramsId required" }, { status: 400 });
    }

    // Check for existing acceptance
    const { data: acceptance } = await supabase
      .from("rams_disclaimer_acceptances")
      .select("id, accepted_at, rams_version")
      .eq("rams_id", ramsId)
      .eq("user_id", user.id)
      .order("accepted_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      hasAccepted: !!acceptance,
      acceptance: acceptance || null,
    });
  } catch (error) {
    console.error("Check acceptance error:", error);
    return NextResponse.json(
      { error: "Failed to check acceptance status" },
      { status: 500 }
    );
  }
}
