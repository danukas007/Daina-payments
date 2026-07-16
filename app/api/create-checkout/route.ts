import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("BODY:", body);

  const {
  guest_name,
  apartment,
  parkingDays,
  petOption,
  tips,
} = body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
   
   metadata: {
  guest_name: guest_name || "",
  apartment: apartment || "",
  parking_days: String(parkingDays || 0),
  pet_option: String(petOption || "0"),
  tips: String(tips || 0),
},

payment_intent_data: {
  metadata: {
    guest_name: guest_name || "",
    apartment: apartment || "",
    parking_days: String(parkingDays || 0),
    pet_option: String(petOption || "0"),
    tips: String(tips || 0),
  },
},

   line_items: [

  ...(body.parking > 0
    ? [{
        price_data: {

          currency: "eur",

          product_data: {
            name: "Parking",
          },

          unit_amount:
            body.parking * 100,
        },

        quantity: 1,
      }]
    : []),

  ...(body.pet > 0
    ? [{
        price_data: {

          currency: "eur",

          product_data: {
            name: "Pet fee",
          },

          unit_amount:
            body.pet * 100,
        },

        quantity: 1,
      }]
    : []),

  ...(body.tips > 0
    ? [{
        price_data: {

          currency: "eur",

          product_data: {
            name:
              "Tips for our team",
          },

          unit_amount:
            body.tips * 100,
        },

        quantity: 1,
      }]
    : []),

],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  });

  return Response.json({
    url: session.url,
  });
}
