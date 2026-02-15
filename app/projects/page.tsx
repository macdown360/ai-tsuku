import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // プロジェクトを取得
  let query = supabase
    .from('projects')
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  // カテゴリフィルター
  if (params.category) {
    query = query.contains('categories', [params.category])
  }

  // 検索フィルター
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  const { data: projects } = await query

  // ユニークなカテゴリを取得
  const { data: categoriesData } = await supabase
    .from('projects')
    .select('categories')

  const categories = Array.from(
    new Set(
      (categoriesData ?? [])
        .flatMap((p) => p.categories || [])
        .filter(Boolean)
    )
  )

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">✨ みんの作品</h1>
        </div>

        {/* 検索とフィルター */}
        <div className="mb-8 bg-white p-4 md:p-6 rounded-lg shadow">
          <form method="get" className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                検索
              </label>
              <input
                type="text"
                id="search"
                name="search"
                defaultValue={params.search}
                placeholder="プロジェクト名や説明で検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/projects"
                  className={`px-3 md:px-4 py-2 rounded-md text-sm ${
                    !params.category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  すべて
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/projects?category=${cat}`}
                    className={`px-3 md:px-4 py-2 rounded-md text-sm ${
                      params.category === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              検索
            </button>
          </form>
        </div>

        {/* プロジェクト一覧 */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-green-300">
            <p className="text-gray-500 text-base md:text-lg mb-4">
              ✨ まだ作品が公開されていません
            </p>
            <Link
              href="/projects/new"
              className="text-green-600 hover:text-green-700 font-medium text-sm md:text-base"
            >
              最初の作品を公開する
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
