export default function CoursesListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
      </div>

      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 sm:hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="flex gap-3">
              <div className="w-28 h-20 bg-gray-200 rounded-lg animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
