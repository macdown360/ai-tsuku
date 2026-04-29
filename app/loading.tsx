export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-center space-y-4">
          <div className="flex justify-center gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-md" />
            <div className="h-6 w-16 bg-gray-200 rounded-md" />
          </div>
          <div className="h-8 w-3/4 mx-auto bg-gray-200 rounded" />
          <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
          <div className="flex justify-center gap-3">
            <div className="h-10 w-28 bg-gray-200 rounded-full" />
            <div className="h-10 w-28 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="mt-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-6 w-16 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-[16/8.5] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
