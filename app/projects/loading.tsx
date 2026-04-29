export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] animate-pulse">
      <div className="max-w-7xl mx-auto py-8 md:py-10 px-4 sm:px-6">
        <div className="h-7 w-20 bg-gray-200 rounded mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* サイドバー skeleton */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </aside>

          {/* メイン skeleton */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100">
              <div className="h-10 bg-gray-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
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
          </main>
        </div>
      </div>
    </div>
  )
}
