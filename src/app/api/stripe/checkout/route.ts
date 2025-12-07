import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/server";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/stripe/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, isAnnual } = body as { tier: SubscriptionTier; isAnnual?: boolean };

    // Get the current user from Supabase
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
    const rateLimitResult = checkRateLimit(`checkout:${user.id}`, RATE_LIMITS.checkout);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please wait before trying again." },
        { status: 429 }
      );
    }

    const stripe = getStripeClient();
    const tierConfig = SUBSCRIPTION_TIERS[tier];

    if (!tierConfig || tier === "free") {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Handle pay-per-use: one-time payment
    if (tier === "pay_per_use") {
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: "RAMS Document Generation",
                description: "Single RAMS document with AI generation",
              },
              unit_amount: 499, // £4.99 in pence
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
          tier,
          type: "one_time",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Get price ID from environment based on tier
    const priceIdMap: Record<string, string | undefined> = {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      annual: process.env.STRIPE_PRICE_ANNUAL,
    };

    const priceId = priceIdMap[tier];
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured for this tier" }, { status: 500 });
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        tier,
        type: "subscription",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
