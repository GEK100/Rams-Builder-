import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

export interface ExtractedProjectInfo {
  projectTitle?: string;
  projectDescription?: string;
  projectReference?: string;
  clientCompany?: string;
  siteAddress?: {
    line1?: string;
    city?: string;
    postcode?: string;
  };
  mainContractor?: string;
  startDate?: string;
  duration?: string;
  suggestedActivities?: string[];
}

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

    const body = await request.json();
    const { scopeText } = body;

    if (!scopeText || typeof scopeText !== "string") {
      return NextResponse.json({ error: "No scope text provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return empty if no API key - user can fill manually
      return NextResponse.json({ extracted: {} });
    }

    const client = new Anthropic({ apiKey });

    // Limit the scope text to avoid token issues
    const truncatedScope = scopeText.substring(0, 15000);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Extract project information from this scope document.

IMPORTANT RULES:
1. ONLY include fields where the information is EXPLICITLY stated in the document
2. Do NOT guess or infer information that isn't clearly written
3. Do NOT make up reference numbers, dates, or company names
4. If a piece of information is ambiguous or unclear, DO NOT include it
5. It's better to return fewer fields with accurate data than to guess

Fields to extract (ONLY if explicitly stated):
- projectTitle: The exact project name/title as written in the document
- projectDescription: Brief description of the works if explicitly stated (1-2 sentences)
- projectReference: Reference number, job number, or quote number if explicitly written
- clientCompany: The client/customer company name if explicitly mentioned
- siteAddress: Object with line1, city, postcode - ONLY if a full address is provided
- mainContractor: The main contractor company name if explicitly stated
- startDate: Expected start date (YYYY-MM-DD format) - ONLY if a specific date is mentioned
- duration: Expected duration - ONLY if explicitly stated (e.g., "2 weeks", "10 days")
- suggestedActivities: Array of specific electrical activities explicitly mentioned (e.g., ["cable installation", "distribution board installation"])

Document content:
${truncatedScope}

Respond with ONLY a valid JSON object, no markdown, no explanation.
OMIT any field where the information is not explicitly and clearly stated in the document.
An empty object {} is a valid response if no clear information is found.`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ extracted: {} });
    }

    try {
      // Parse the JSON response
      const jsonStr = textContent.text.trim();
      const extracted: ExtractedProjectInfo = JSON.parse(jsonStr);

      return NextResponse.json({ extracted });
    } catch {
      // If parsing fails, return empty
      console.error("Failed to parse AI response:", textContent.text);
      return NextResponse.json({ extracted: {} });
    }
  } catch (error) {
    console.error("Extract project info error:", error);
    return NextResponse.json(
      { error: "Failed to extract project information" },
      { status: 500 }
    );
  }
}
