export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Payment successful
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment.
        </p>
        <a
          href="/pay"
          className="bg-black text-white px-6 py-4 rounded-xl inline-block"
        >
          Back
        </a>
      </div>
    </main>
  );
}
