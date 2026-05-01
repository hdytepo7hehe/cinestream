export default function Loading() {
  return (
    <div className="animate-fade-in">
      {/* Hero skeleton */}
      <div className="relative w-full h-[85vh] bg-cine-surface skeleton" />

      {/* Rows skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 space-y-10">
        {[1, 2, 3].map((row) => (
          <div key={row}>
            {/* Row title */}
            <div className="skeleton h-6 w-48 mb-4 rounded" />
            {/* Cards */}
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton flex-shrink-0 rounded-md"
                  style={{ width: 160, height: 240 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
