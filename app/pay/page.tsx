"use client";

import { useState } from "react";

export default function PayPage() {
  const [guestName, setGuestName] = useState("");
  const [apartment, setApartment] = useState("");

  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(1);

  const [parkingDays, setParkingDays] = useState(0);

  const [petFee, setPetFee] = useState(false);

  const [tips, setTips] = useState(0);

  const touristTax = nights * guests * 2;

  const parking = parkingDays * 0;

  const pet = petFee ? 10 : 0;

  const total =
    touristTax +
    parking +
    pet +
    tips;
async function checkout() {

  const res = await fetch(
    "/api/create-checkout",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        guestName,

        apartment,

        touristTax,

        parking,

        pet,

        tips,

        total,
      }),
    }
  );

  const data =
    await res.json();

  window.location.href =
    data.url;
}
  return (
    <main className="max-w-md mx-auto p-6">

      <h1 className="text-3xl font-semibold mb-6">
        Daina Apartments
      </h1>
<p className="text-gray-600 mb-8 leading-7">

  Secure payment for optional stay extras and
  local tourist tax during your stay at
  Daina Apartments Self Check-in.

</p>

<div className="bg-gray-50 border rounded-2xl p-4 mb-8">

  <h2 className="font-medium mb-2">
    What can be paid here
  </h2>

  <ul className="text-sm text-gray-600 space-y-1">

    <li>
      • Local tourist tax
    </li>

    <li>
      • Parking
    </li>

    <li>
      • Pet fee
    </li>

    <li>
      • Optional appreciation for our team
    </li>

  </ul>

</div>

      <input
        placeholder="Guest name"
        className="border p-3 w-full mb-4"
        value={guestName}
        onChange={(e) =>
          setGuestName(e.target.value)
        }
      />

 <select
   className="border p-3 w-full mb-4 rounded-lg"          
   value={apartment}
   onChange={(e) =>
    setApartment(e.target.value)
  }
>
  <option value="">
    Select apartment
  </option>

  <option value="Apartment 3">
    Apartment 3
  </option>

  <option value="Apartment 5">
    Apartment 5
  </option>
</select>

      <div className="mb-4">
        <label>Nights</label>

        <input
          type="number"
          value={nights}
          onChange={(e) =>
            setNights(Number(e.target.value))
          }
          className="border p-3 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Guests</label>

        <input
          type="number"
          value={guests}
          onChange={(e) =>
            setGuests(Number(e.target.value))
          }
          className="border p-3 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Parking days</label>

        <input
          type="number"
          value={parkingDays}
          onChange={(e) =>
            setParkingDays(Number(e.target.value))
          }
          className="border p-3 w-full"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={petFee}
          onChange={() =>
            setPetFee(!petFee)
          }
        />

        <label>Pet fee (€10)</label>
      </div>

      <div className="mb-6">
        <label>Support our hosting team</label>
<p className="text-sm text-gray-500 mt-1">
  Optional support for our small hosting team
</p>

        <div className="flex gap-2 mt-2">
          {[0, 5, 10, 20].map((v) => (
            <button
              key={v}
              onClick={() => setTips(v)}
              className="border px-4 py-2"
            >
              €{v}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xl mb-6">
        Total: €{total}
   <p className="text-sm text-gray-500 mt-2">
  All payments are securely processed by Stripe.
</p>
     
      </div>

      <button
         onClick={checkout}
         className="bg-black text-white px-6 py-4 w-full rounded-xl"
>
        Pay now
      </button>

    </main>
  );
}