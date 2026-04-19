'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import ShareButtons from '@/components/ShareButtons'
import ProjectStructuredData from '@/components/ProjectStructuredData'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { User } from '@supabase/supabase-js'

interface Project {
  id: string
  user_id: string | null
  title: string
  description: string
  url: string
  image_url: string | null
  categories: string[]
  tags: string[]
  ai_tools: string[] | null
  backend_services: string[] | null
  frontend_tools: string[] | null
  likes_count: number
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface Comment {
  id: string
  project_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface ProjectUpdate {
  id: string
  project_id: string
  content: string
  created_at: string
  updated_at: string
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [newUpdate, setNewUpdate] = useState('')
  const [submittingUpdate, setSubmittingUpdate] = useState(false)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const router = useRouter()
  const supabase = createClient()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    const fetchProject = async () => {
      setLoading(true)
      
      // ユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // プロジェクト情報を取得
      const { data: projectData, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('id', resolvedParams.id)
        .single()

      if (error || !projectData) {
        console.error(error)
        router.push('/projects')
        return
      }

      setProject(projectData)

      // いいね状態を取得
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('project_id', resolvedParams.id)
          .single()

        setIsLiked(!!likeData)
      }

      // コメントを取得
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('project_id', resolvedParams.id)
        .order('created_at', { ascending: false })

      if (commentsData) {
        setComments(commentsData)
      }

      // 改善履歴を取得
      const { data: updatesData } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', resolvedParams.id)
        .order('created_at', { ascending: false })

      if (updatesData) {
        setUpdates(updatesData)
      }

      // 関連プロジェクトを取得・計算
      const { data: allProjectsData } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .neq('id', resolvedParams.id)

      if (allProjectsData && allProjectsData.length > 0) {
        // 関連性スコアを計算
        const scoredProjects = allProjectsData.map((p: Project) => {
          let score = 0

          // カテゴリが共通していればスコア加算
          if (projectData.categories && p.categories) {
            const commonCategories = projectData.categories.filter((cat: string) =>
              p.categories.includes(cat)
            )
            score += commonCategories.length * 3
          }

          // タグが共通していればスコア加算
          if (projectData.tags && p.tags) {
            const commonTags = projectData.tags.filter((tag: string) =>
              p.tags.includes(tag)
            )
            score += commonTags.length * 2
          }

          // AIツールが共通していればスコア加算
          if (projectData.ai_tools && p.ai_tools) {
            const commonAiTools = (projectData.ai_tools || []).filter((tool: string) =>
              (p.ai_tools || []).includes(tool)
            )
            score += commonAiTools.length * 2
          }

          // バックエンドサービスが共通していればスコア加算
          if (projectData.backend_services && p.backend_services) {
            const commonBackend = (projectData.backend_services || []).filter((service: string) =>
              (p.backend_services || []).includes(service)
            )
            score += commonBackend.length * 2
          }

          // フロントエンドツールが共通していればスコア加算
          if (projectData.frontend_tools && p.frontend_tools) {
            const commonFrontend = (projectData.frontend_tools || []).filter((tool: string) =>
              (p.frontend_tools || []).includes(tool)
            )
            score += commonFrontend.length * 2
          }

          return { ...p, relatedScore: score }
        })

        // スコアでソートして上位4～6個を選択
        const filtered = scoredProjects
          .filter((p: any) => p.relatedScore > 0)
          .sort((a: any, b: any) => b.relatedScore - a.relatedScore)
          .slice(0, 6)

        setRelatedProjects(filtered as Project[])
      }

      setLoading(false)
    }

    fetchProject()
  }, [resolvedParams, supabase, router])

  const handleLike = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!project) return

    try {
      if (isLiked) {
        // いいねを削除
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', project.id)

        await supabase
          .from('projects')
          .update({ likes_count: Math.max(0, project.likes_count - 1) })
          .eq('id', project.id)

        setProject({ ...project, likes_count: Math.max(0, project.likes_count - 1) })
        setIsLiked(false)
      } else {
        // いいねを追加
        await supabase
          .from('likes')
          .insert({ user_id: user.id, project_id: project.id })

        await supabase
          .from('projects')
          .update({ likes_count: project.likes_count + 1 })
          .eq('id', project.id)

        setProject({ ...project, likes_count: project.likes_count + 1 })
        setIsLiked(true)
      }
    } catch (error) {
      console.error('いいねの更新に失敗しました:', error)
    }
  }

  const handleShare = (platform: string) => {
    if (!project) return

    const shareUrl = encodeURIComponent(window.location.href)
    const shareText = encodeURIComponent(`${project.title} - AIで作ってみた件`)

    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case 'line':
        url = `https://line.me/R/msg/text/?${shareText}%20${shareUrl}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const handleCopyUrl = async () => {
    if (!project) return
    
    try {
      await navigator.clipboard.writeText(project.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = project.url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!project || !newComment.trim()) return

    setSubmittingComment(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          content: newComment.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'コメントの公開に失敗しました')
      }

      const data = await response.json()
      setComments([data, ...comments])
      setNewComment('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'コメントの公開に失敗しました'
      console.error('コメントの公開に失敗しました:', error)
      alert(errorMessage)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleCommentDelete = async (commentId: string) => {
    if (!user) return

    const confirmed = window.confirm('このコメントを削除しますか？')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '削除に失敗しました')
      }

      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'コメントの削除に失敗しました'
      console.error('コメントの削除に失敗しました:', error)
      alert(errorMessage)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!project || !newUpdate.trim()) return

    setSubmittingUpdate(true)

    try {
      const response = await fetch('/api/project-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          content: newUpdate.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '改善履歴の追加に失敗しました')
      }

      const data = await response.json()
      setUpdates([data, ...updates])
      setNewUpdate('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '改善履歴の追加に失敗しました'
      console.error('改善履歴の追加に失敗しました:', error)
      alert(errorMessage)
    } finally {
      setSubmittingUpdate(false)
    }
  }

  const handleUpdateDelete = async (updateId: string) => {
    if (!user) return

    const confirmed = window.confirm('この改善履歴を削除しますか？')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/project-updates?id=${updateId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '削除に失敗しました')
      }

      setUpdates(updates.filter(update => update.id !== updateId))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '改善履歴の削除に失敗しました'
      console.error('改善履歴の削除に失敗しました:', error)
      alert(errorMessage)
    }
  }

  const handleDelete = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!project) return

    const confirmed = window.confirm('このプロジェクトを削除しますか？この操作は取り消せません。')
    if (!confirmed) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (error) {
      console.error('プロジェクトの削除に失敗しました:', error)
      window.alert('削除に失敗しました。もう一度お試しください。')
      return
    }

    router.push('/projects')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6]">
        <Navbar />
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">
          <p className="text-gray-400 text-sm">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const isOwner = !!project.user_id && user?.id === project.user_id

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar />
      {resolvedParams && project && (
        <>
          <ProjectStructuredData 
            project={project}
            pageUrl={`${typeof window !== 'undefined' ? window.location.href : 'https://tool-park.example.com'}`}
          />
          <BreadcrumbSchema projectTitle={project.title} projectId={project.id} />
        </>
      )}
      <div className="max-w-3xl mx-auto py-8 md:py-10 px-4 sm:px-6">
        <div className="mb-4">
          <Link href="/projects" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 戻る
          </Link>
        </div>

        <article className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* 画像 */}
          {project.image_url && (
            <div className="relative h-48 md:h-96">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-5 md:p-8">
            {/* カテゴリ */}
            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block px-2.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* タイトル */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {project.title}
            </h1>

            {isOwner && (
              <div className="flex gap-2 mb-5">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-50 transition-colors"
                >
                  編集
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-1.5 border border-gray-200 text-red-500 rounded-full text-xs hover:bg-red-50 transition-colors"
                >
                  削除
                </button>
              </div>
            )}

            {/* 作成者情報 */}
            <div className="flex items-center gap-2.5 mb-6 w-fit">
              {project.user_id && project.profiles?.avatar_url ? (
                <Image
                  src={project.profiles.avatar_url}
                  alt={project.profiles.full_name || '匿名'}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 text-sm">
                  👤
                </div>
              )}
              <p className="text-sm font-medium text-gray-900">
                {project.profiles?.full_name || '匿名'}
              </p>
            </div>

            {/* 日付情報 */}
            <div className="mb-6 text-xs text-gray-500 space-y-1">
              <p>
                <span className="font-medium text-gray-600">作成日:</span> {new Date(project.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {project.created_at !== project.updated_at && (
                <p>
                  <span className="font-medium text-gray-600">最終更新:</span> {new Date(project.updated_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>

            {/* 説明 */}
            <div className="mb-6">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* タグ */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 使用したAIツール */}
            {project.ai_tools && project.ai_tools.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-600 mb-2">💡 使用したAIツール</p>
                <div className="flex flex-wrap gap-2">
                  {project.ai_tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 使用したバックエンド/サービス */}
            {project.backend_services && project.backend_services.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-600 mb-2">⚙️ バックエンド/サービス</p>
                <div className="flex flex-wrap gap-2">
                  {project.backend_services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 使用したフロントエンドツール */}
            {project.frontend_tools && project.frontend_tools.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-600 mb-2">🎨 フロントエンドツール</p>
                <div className="flex flex-wrap gap-2">
                  {project.frontend_tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-100">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-5 py-2.5 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 text-center text-sm transition-colors"
              >
                サイトを開く
              </a>
              
              <button
                onClick={handleLike}
                className={`px-5 py-2.5 rounded-full font-medium border transition-colors text-sm whitespace-nowrap ${
                  isLiked
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'
                }`}
              >
                {isLiked ? '❤️' : '♡'} {project.likes_count}
              </button>
            </div>

            {/* シェアボタン */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <ShareButtons 
                title={project.title}
                description={project.description}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                imageUrl={project.image_url || undefined}
              />
            </div>

            {/* 改善履歴セクション */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-2">
                改善履歴 ({updates.length})
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                改善履歴はプロジェクトの作成者のみが追加できます
              </p>

              {/* 改善履歴フォーム - プロジェクト所有者のみ表示 */}
              {isOwner && (
                <form onSubmit={handleUpdateSubmit} className="mb-6">
                  <textarea
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="改善内容を記入してください..."
                    maxLength={50}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
                    rows={2}
                    disabled={submittingUpdate}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingUpdate || !newUpdate.trim()}
                      className="px-5 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingUpdate ? '追加中...' : '追加'}
                    </button>
                  </div>
                </form>
              )}

              {/* 改善履歴リスト */}
              <div className="space-y-3">
                {updates.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">
                    まだ改善履歴がありません
                  </p>
                ) : (
                  updates.map((update) => (
                    <div key={update.id} className="bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-200 flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <p className="text-xs text-emerald-700 font-medium">
                          {new Date(update.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-700 break-words whitespace-normal">
                          {update.content}
                        </p>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleUpdateDelete(update.id)}
                          className="text-gray-400 hover:text-red-500 text-xs transition-colors whitespace-nowrap"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 関連プロジェクト */}
            {relatedProjects.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">
                  関連するおすすめプロジェクト
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
