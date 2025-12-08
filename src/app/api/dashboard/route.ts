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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get subscription info
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier, rams_limit, rams_used_this_period")
      .eq("user_id", user.id)
      .single();

    // Get RAMS documents with stats
    const { data: ramsDocuments, count: totalCount } = await supabase
      .from("rams_documents")
      .select("id, title, status, updated_at", { count: "exact" })
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    // Calculate stats
    const drafts = ramsDocuments?.filter(r => r.status === "draft").length || 0;
    const completed = ramsDocuments?.filter(r => r.status === "complete").length || 0;

    // Get recent documents (last 5)
    const recentRAMS = (ramsDocuments || []).slice(0, 5).map(doc => ({
      id: doc.id,
      title: doc.title || "Untitled RAMS",
      status: doc.status,
      updatedAt: formatRelativeTime(doc.updated_at),
    }));

    // Usage info
    const ramsUsed = subscription?.rams_used_this_period || 0;
    const ramsLimit = subscription?.rams_limit ?? 2; // Default free tier

    return NextResponse.json({
      stats: {
        total: totalCount || 0,
        drafts,
        completed,
        ramsUsed,
        ramsLimit,
      },
      recentRAMS,
      subscription: {
        tier: subscription?.tier || "free",
        ramsUsed,
        ramsLimit,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}
