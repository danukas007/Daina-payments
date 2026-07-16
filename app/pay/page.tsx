"use client";

import { useState } from "react";

export default function PayPage() {
  const [guestName, setGuestName] = useState("");
  const [apartment, setApartment] = useState("");
  const [petOption, setPetOption] = useState("none");
  const [tips, setTips] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const pet =
    petOption === "small"
      ? 10
      : petOption === "large"
        ? 20
        : 0;

  const total = pet + tips;

  const cannotPay =
    isLoading ||
    guestName.trim() === "" ||
    apartment === "" ||
    petOption === "multiple" ||
    total <= 0;

  async function checkout() {
    if (petOption === "multiple") {
      alert(
        "Please contact us before arrival for approval and pricing for more than one pet."
      );
      return;
    }

    if (!guestName.trim()) {
      alert("Please enter the guest name.");
      return;
    }

    if (!apartment) {
      alert("Please select the apartment.");
      return;
    }

    if (total <= 0) {
      alert("Please select a pet fee or a tip before continuing.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/create-checkout", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          guest_name: guestName.trim(),
          apartment,
          petOption,
          pet,
          tips,
          total,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to create payment.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("Payment link was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      alert(
        "We could not start the payment. Please try again or contact us."
      );

      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Daina Apartments
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Secure payment for optional extras during your stay at
              Daina Apartments Self Check-in.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="font-medium text-gray-900">
              Optional extras
            </h2>

            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Pet fee</li>
              <li>• Optional tip for our hosting team</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="guestName"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Guest name
              </label>

              <input
                id="guestName"
                type="text"
                placeholder="Enter guest name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="apartment"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Apartment
              </label>

              <select
                id="apartment"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Select apartment</option>
                <option value="Apartment 3">Apartment 3</option>
                <option value="Apartment 5">Apartment 5</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="petOption"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Pets &amp; pet fees
              </label>

              <select
                id="petOption"
                value={petOption}
                onChange={(e) => setPetOption(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              >
                <option value="none">No pets</option>

                <option value="small">
                  Small pet (up to 10 kg) — €10
                </option>

                <option value="large">
                  Large pet (over 10 kg) — €20
                </option>

                <option value="multiple">
                  More than one pet — price upon request before arrival
                </option>
              </select>

              {petOption === "multiple" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm leading-5 text-red-700">
                    Please contact us before arrival for approval and
                    pricing for more than one pet.
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-800">
                  Optional tip for our hosting team
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Thank you for supporting our small hosting team.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 5, 10, 20].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTips(value)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      tips === value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    €{value}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Total
                </span>

                <span className="text-2xl font-semibold">
                  €{total.toFixed(2)}
                </span>
              </div>

              {pet > 0 && (
                <div className="mt-3 flex justify-between text-sm text-gray-300">
                  <span>Pet fee</span>
                  <span>€{pet.toFixed(2)}</span>
                </div>
              )}

              {tips > 0 && (
                <div className="mt-1 flex justify-between text-sm text-gray-300">
                  <span>Optional tip</span>
                  <span>€{tips.toFixed(2)}</span>
                </div>
              )}
            </div>

            {total === 0 && petOption !== "multiple" && (
              <p className="text-center text-sm text-gray-500">
                Select a pet fee or an optional tip to continue.
              </p>
            )}

            <button
              type="button"
              onClick={checkout}
              disabled={cannotPay}
              className={`w-full rounded-xl px-6 py-4 font-medium text-white transition ${
                cannotPay
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isLoading
                ? "Opening secure payment..."
                : petOption === "multiple"
                  ? "Contact us for pet pricing"
                  : "Pay securely"}
            </button>

            <p className="text-center text-xs leading-5 text-gray-500">
              Payments are securely processed by Stripe.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
