import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook Error" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata || {};

    const { error } = await supabase.from("payments").insert([
      {
        guest_name: metadata.guest_name || "",
        apartment: metadata.apartment || "",
        amount: session.amount_total || 0,
        nights: Number(metadata.nights || 0),
        guests: Number(metadata.guests || 0),
        parking_days: Number(metadata.parking_days || 0),
        pet_fee: metadata.pet_fee === "true",
        tips: Number(metadata.tips || 0),
        stripe_session_id: session.id,
        payment_status: session.payment_status,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
