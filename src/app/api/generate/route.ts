import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { RAMS_SYSTEM_PROMPT, buildSectionPrompt, type RAMSGenerationContext } from "@/lib/ai/claude";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { canGenerateRAMS, recordRAMSGeneration } from "@/lib/subscription/check-usage";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
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

    // Rate limiting check
    const rateLimitResult = checkRateLimit(`generate:${user.id}`, RATE_LIMITS.generate);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetTime),
          }
        }
      );
    }

    // Subscription usage check
    const usageCheck = await canGenerateRAMS(user.id, user.email);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: usageCheck.reason || "Generation limit reached",
          upgradeRequired: true,
          tier: usageCheck.tier,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sectionId, context } = body as {
      sectionId: string;
      context: RAMSGenerationContext;
    };

    if (!sectionId || !context) {
      return NextResponse.json(
        { error: "Missing sectionId or context" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const prompt = buildSectionPrompt(sectionId, context);

    if (!prompt) {
      return NextResponse.json(
        { error: `Unknown section: ${sectionId}` },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: RAMS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text content in response" },
        { status: 500 }
      );
    }

    // Record usage (deduct credit or increment monthly usage)
    // Only record for first generation of a RAMS (sectionId === "full" or first section)
    if (sectionId === "full" || sectionId === "scope_of_works") {
      const ramsId = context.cdmInfo?.project?.reference || crypto.randomUUID();
      await recordRAMSGeneration(user.id, ramsId);
    }

    return NextResponse.json({
      sectionId,
      content: textContent.text,
      isAdmin: usageCheck.isAdmin,
      remainingGenerations: usageCheck.remainingGenerations,
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Error generating RAMS section:`, error);
    return NextResponse.json(
      { error: "Failed to generate content", errorId },
      { status: 500 }
    );
  }
}
