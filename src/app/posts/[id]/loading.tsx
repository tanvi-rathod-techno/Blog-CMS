// app/(main)/loading.tsx
export default function Loading() {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center text-gray-500">
        <div className="animate-pulse text-center">
          <h2 className="text-xl font-semibold mb-2">Loading…</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }
  