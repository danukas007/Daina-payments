import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();

  const {
  guest_name,
  apartment,
  nights,
  guests,
  parkingDays,
  petFee,
  tips,
} = body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
   
    metadata: {
  guest_name,
  apartment,
  nights: nights.toString(),
  guests: guests.toString(),
  parking_days: parkingDays.toString(),
  pet_fee: petFee.toString(),
  tips: tips.toString(),
},

   line_items: [

  ...(body.touristTax > 0
    ? [{
        price_data: {

          currency: "eur",

          product_data: {
            name: "Tourist tax",
          },

          unit_amount:
            body.touristTax * 100,
        },

        quantity: 1,
      }]
    : []),

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
