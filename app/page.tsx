import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'

export default async function Home() {
  const supabase = await createClient()
  
  // 最新のプロジェクトを取得
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            WEBサイト・アプリを<br />共有しよう 🚀
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            誰でも簡単に自分が作ったWEBサイトやWEBアプリを登録して公開できるプラットフォーム
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              無料で始める
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
            >
              プロジェクトを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Web Application Sharing Economyの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">簡単投稿</h3>
              <p className="text-gray-600">
                タイトル、説明、URLを入力するだけで簡単にプロジェクトを公開できます
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">発見しやすい</h3>
              <p className="text-gray-600">
                カテゴリやタグで整理され、検索機能で目的のプロジェクトがすぐに見つかります
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">いいね & シェア</h3>
              <p className="text-gray-600">
                気に入ったプロジェクトにいいねをしたり、SNSでシェアできます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新のプロジェクト</h2>
            <Link
              href="/projects"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              すべて見る →
            </Link>
          </div>
          
          {projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-4">
                まだプロジェクトが投稿されていません
              </p>
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                最初の投稿者になりませんか？
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            あなたのプロジェクトを世界に公開しよう
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            無料で始められます。今すぐ登録して、作品を共有しましょう！
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            今すぐ始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Web Application Sharing Economy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
