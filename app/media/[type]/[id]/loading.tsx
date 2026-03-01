export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Poster Skeleton */}
        <div className="w-72 h-[420px] bg-zinc-800 rounded-2xl" />

        <div className="flex-1 space-y-6">
          <div className="h-10 bg-zinc-800 rounded w-3/4" />
          <div className="h-5 bg-zinc-800 rounded w-1/3" />
          <div className="h-5 bg-zinc-800 rounded w-1/2" />

          <div className="space-y-3 pt-4">
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-zinc-800 rounded w-4/6" />
          </div>

          <div className="flex gap-3 pt-4">
            <div className="h-8 w-16 bg-zinc-800 rounded-full" />
            <div className="h-8 w-16 bg-zinc-800 rounded-full" />
            <div className="h-8 w-16 bg-zinc-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* DETAIL SECTIONS */}
      <div className="mt-12 space-y-8">
        <div className="h-6 bg-zinc-800 rounded w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-zinc-900 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
