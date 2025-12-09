import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
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

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch standard processes
    const { data: processes, error } = await supabase
      .from("standard_processes")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("display_order");

    if (error) {
      console.error("Error fetching processes:", error);
      return NextResponse.json(
        { error: "Failed to fetch processes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ processes: processes || [] });
  } catch (error) {
    console.error("Processes API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
