import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { z } from "zod";

// Validation schema for checkout metadata
const CheckoutMetadataSchema = z.object({
  userId: z.string().uuid(),
  tier: z.enum(["free", "pay_per_use", "monthly", "annual"]),
  type: z.enum(["one_time", "subscription"]),
});

// Validation schema for subscription metadata
const SubscriptionMetadataSchema = z.object({
  userId: z.string().uuid(),
});

// Lazy initialization for Supabase (avoid build-time errors)
let supabase: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabase;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Validate metadata with Zod
        const metadataResult = CheckoutMetadataSchema.safeParse(session.metadata);
        if (!metadataResult.success) {
          console.error("Invalid checkout metadata:", metadataResult.error);
          break;
        }

        const { userId, tier, type } = metadataResult.data;

        const db = getSupabaseAdmin();
        if (type === "one_time") {
          // Pay-per-use: increment credits
          const { error } = await db.rpc("increment_rams_credits", {
            user_id: userId,
            credits: 1,
          });
          if (error) console.error("Error incrementing credits:", error);
        } else if (session.subscription) {
          // Subscription: update subscription record
          const { error } = await db
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              tier: tier,
              status: "active",
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
          if (error) console.error("Error updating subscription:", error);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Validate metadata with Zod
        const metadataResult = SubscriptionMetadataSchema.safeParse(subscription.metadata);
        if (!metadataResult.success) {
          console.error("Invalid subscription metadata:", metadataResult.error);
          break;
        }

        const { userId } = metadataResult.data;

        const db = getSupabaseAdmin();
        // Access billing period from the subscription items
        const subscriptionItem = subscription.items?.data?.[0];
        const periodStart = subscriptionItem?.current_period_start
          ? new Date(subscriptionItem.current_period_start * 1000).toISOString()
          : new Date().toISOString();
        const periodEnd = subscriptionItem?.current_period_end
          ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const { error } = await db
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) console.error("Error updating subscription:", error);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const db = getSupabaseAdmin();

        const { error } = await db
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) console.error("Error canceling subscription:", error);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Get subscription ID from parent if available
        const subscriptionId = typeof invoice.parent === 'object' && invoice.parent
          ? (invoice.parent as { subscription_details?: { subscription?: string } }).subscription_details?.subscription
          : null;

        if (!subscriptionId) break;

        const db = getSupabaseAdmin();
        // Record payment
        const { error } = await db.from("payments").insert({
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: subscriptionId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "succeeded",
          paid_at: new Date().toISOString(),
        });

        if (error) console.error("Error recording payment:", error);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // Get subscription ID from parent if available
        const subscriptionId = typeof invoice.parent === 'object' && invoice.parent
          ? (invoice.parent as { subscription_details?: { subscription?: string } }).subscription_details?.subscription
          : null;

        if (!subscriptionId) break;

        const db = getSupabaseAdmin();
        // Update subscription status
        const { error } = await db
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) console.error("Error updating subscription status:", error);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
