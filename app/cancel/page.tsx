export default function CancelPage() {

  return (

    <main className="min-h-screen flex items-center justify-center p-6">

      <div className="max-w-md w-full text-center">

        <h1 className="text-4xl font-semibold mb-4">
          Payment cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was not completed.
        </p>

        <a
          href="/pay"
          className="bg-black text-white px-6 py-4 rounded-xl inline-block"
        >
          Try again
        </a>

      </div>

    </main>
  );
}
