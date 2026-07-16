import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const guestName = String(body.guest_name || "").trim();
    const apartment = String(body.apartment || "").trim();
    const petOption = String(body.petOption || "none");

    const pet = Number(body.pet || 0);
    const tips = Number(body.tips || 0);

    if (!guestName) {
      return Response.json(
        { error: "Guest name is required." },
        { status: 400 }
      );
    }

    if (!apartment) {
      return Response.json(
        { error: "Apartment is required." },
        { status: 400 }
      );
    }

    if (petOption === "multiple") {
      return Response.json(
        {
          error:
            "Pricing for more than one pet must be agreed before arrival.",
        },
        { status: 400 }
      );
    }

    const allowedPetFees: Record<string, number> = {
      none: 0,
      small: 10,
      large: 20,
    };

    const correctPetFee = allowedPetFees[petOption];

    if (correctPetFee === undefined) {
      return Response.json(
        { error: "Invalid pet option." },
        { status: 400 }
      );
    }

    if (pet !== correctPetFee) {
      return Response.json(
        { error: "Invalid pet fee." },
        { status: 400 }
      );
    }

    if (![0, 5, 10, 20].includes(tips)) {
      return Response.json(
        { error: "Invalid tip amount." },
        { status: 400 }
      );
    }

    if (pet <= 0 && tips <= 0) {
      return Response.json(
        { error: "No payment item was selected." },
        { status: 400 }
      );
    }

    const petDescription =
      petOption === "small"
        ? "Small pet up to 10 kg"
        : petOption === "large"
          ? "Large pet over 10 kg"
          : "No pets";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      metadata: {
        guest_name: guestName,
        apartment,
        pet_option: petOption,
        pet_description: petDescription,
        pet_fee: String(pet),
        tips: String(tips),
      },

      payment_intent_data: {
        metadata: {
          guest_name: guestName,
          apartment,
          pet_option: petOption,
          pet_description: petDescription,
          pet_fee: String(pet),
          tips: String(tips),
        },
      },

      line_items: [
        ...(pet > 0
          ? [
              {
                price_data: {
                  currency: "eur",

                  product_data: {
                    name:
                      petOption === "small"
                        ? "Pet fee – small pet up to 10 kg"
                        : "Pet fee – large pet over 10 kg",
                  },

                  unit_amount: pet * 100,
                },

                quantity: 1,
              },
            ]
          : []),

        ...(tips > 0
          ? [
              {
                price_data: {
                  currency: "eur",

                  product_data: {
                    name: "Optional tip for our hosting team",
                  },

                  unit_amount: tips * 100,
                },

                quantity: 1,
              },
            ]
          : []),
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return Response.json(
      { error: "Unable to create payment." },
      { status: 500 }
    );
  }
}
