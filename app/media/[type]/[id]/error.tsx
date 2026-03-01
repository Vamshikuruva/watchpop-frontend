"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold text-zinc-100">
        Something went wrong
      </h2>
      <p className="text-zinc-400 mt-2">We couldn't load this media.</p>

      <button onClick={reset} className="mt-6 px-4 py-2 bg-zinc-800 rounded-lg">
        Try again
      </button>
    </div>
  );
}
