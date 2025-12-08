import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// We'll use pdf-parse for PDFs and mammoth for Word docs
// These need to be installed: npm install pdf-parse mammoth

export async function POST(request: NextRequest) {
  try {
    // Check authentication
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // Extract text based on file type
    if (file.type === "application/pdf") {
      try {
        // Use require for CommonJS module compatibility
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (e) {
        console.error("PDF parse error:", e);
        return NextResponse.json({
          text: "[PDF file uploaded - text extraction failed]",
          warning: "PDF parsing failed. The file may be corrupted or password-protected.",
        });
      }
    } else if (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } catch (e) {
        console.error("Word parse error:", e);
        return NextResponse.json({
          text: "[Word file uploaded - text extraction failed]",
          warning: "Word parsing failed.",
        });
      }
    } else if (file.type === "text/plain") {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Limit extracted text to prevent token overload (roughly 50k chars = ~12k tokens)
    const maxChars = 50000;
    if (extractedText.length > maxChars) {
      extractedText = extractedText.substring(0, maxChars) + "\n\n[Text truncated due to length...]";
    }

    // Clean up the text - remove excessive whitespace
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Text extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from file" },
      { status: 500 }
    );
  }
}
