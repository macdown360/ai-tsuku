import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import { HOME_CATEGORY_NAMES } from '@/lib/categories'

export default async function Home() {
  const supabase = await createClient()
  
  // ユーザーのログイン状態を確認
  const { data: { user } } = await supabase.auth.getUser()
  
  // ログイン状態に応じたリンク先を決定
  const ctaLink = '/projects/new'
  
  // 最新のプロジェクトを取得（8つに増やして4カラム×2行）
  const { data: recentProjects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(8)

  // カテゴリ別のプロジェクトを取得
  const categorySections = await Promise.all(
    HOME_CATEGORY_NAMES.map(async (category) => {
      const { data: projects } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .contains('categories', [category])
        .order('created_at', { ascending: false })
        .limit(4)
      
      return {
        name: category,
        projects: projects || []
      }
    })
  )

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar />
      
      {/* Hero Section - noteのようにシンプル */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-center">
          <div className="flex justify-center gap-2 mb-2">
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md">
              ログイン不要
            </span>
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md">
              掲載無料
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight whitespace-nowrap">
            AIで作ったプロダクトやアプリを気軽にシェア
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            AIやノーコードで作ったサイトやアプリを、簡単に公開・共有できるプラットフォーム
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={ctaLink}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              掲載する
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              プロダクトを探す
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mt-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">新着</h2>
            <Link
              href="/projects"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              もっとみる →
            </Link>
          </div>
          
          {recentProjects && recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-4">
                まだ作品が公開されていません
              </p>
              <Link
                href={ctaLink}
                className="text-emerald-500 hover:text-emerald-600 text-sm font-medium"
              >
                最初の作品を公開する →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {categorySections.map((section) => (
        section.projects.length > 0 && (
          <section key={section.name} className="mt-2 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">{section.name}</h2>
                <Link
                  href={`/projects?category=${encodeURIComponent(section.name)}`}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  もっとみる →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {section.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      {/* CTA Section */}
      <section className="mt-2 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            あなたのアイデアが世界を変える！
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            ...かもしれない
          </p>
          <Link
            href={ctaLink}
            className="inline-block px-8 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            無料で掲載する
          </Link>
        </div>
      </section>
    </div>
  )
}
