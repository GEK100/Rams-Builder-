import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { RAMS_SYSTEM_PROMPT, buildSectionPrompt, type RAMSGenerationContext } from "@/lib/ai/claude";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
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

    return NextResponse.json({
      sectionId,
      content: textContent.text,
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
