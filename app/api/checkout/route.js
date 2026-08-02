import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (stripeKey && stripeKey !== "sk_test_your_stripe_secret_key_here") {
      const stripe = new Stripe(stripeKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Repurpr Pro Plan — AI Content Multiplier",
                description: "Unlimited URL ingestion, multi-platform matrix exports & priority processing queue.",
              },
              unit_amount: 1900, // $19.00 USD
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancel`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Simulated Stripe checkout session URL for demo/testing without secret key
    return NextResponse.json({
      url: `${origin}/?checkout=success_demo`,
      simulated: true,
      message: "Stripe Key not set in environment. Simulated checkout flow initiated."
    });

  } catch (error) {
    console.error("API /api/checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session: " + error.message }, { status: 500 });
  }
}
