'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { KeyboardEvent } from 'react'

interface ProjectCardProps {
  project: {
    id: string
    user_id: string | null
    title: string
    description: string
    url: string
    image_url: string | null
    categories: string[]
    tags: string[]
    ai_tools?: string[] | null
    backend_services?: string[] | null
    frontend_tools?: string[] | null
    likes_count: number
    created_at: string
    updated_at: string
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    }
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/projects/${project.id}`)
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      router.push(`/projects/${project.id}`)
    }
  }

  return (
    <div
      className="bg-white rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-slate-200/60 hover:border-slate-300 hover:-translate-y-1"
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`${project.title} details`}
    >
        {/* プロジェクト画像 */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 overflow-hidden">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl bg-slate-50">
              📄
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow overflow-hidden">
          {/* タイトル */}
          <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">
            {project.title}
          </h3>

          {/* 説明 */}
          <p className="text-slate-600 text-xs md:text-sm mb-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* タグ - 1行に制限 */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex gap-1.5 mb-2 overflow-hidden">
              {project.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded-full flex-shrink-0"
                >
                  #{tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-full flex-shrink-0">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 使用したツール - 1行に統合 */}
          <div className="flex gap-1 mb-3 flex-wrap overflow-hidden">
            {/* AIツール */}
            {project.ai_tools && project.ai_tools.length > 0 && (
              <>
                <span
                  className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded-full flex-shrink-0"
                >
                  {project.ai_tools[0]}
                </span>
                {project.ai_tools.length > 1 && (
                  <span className="px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-full flex-shrink-0">
                    +{project.ai_tools.length - 1} AI
                  </span>
                )}
              </>
            )}

            {/* バックエンド */}
            {project.backend_services && project.backend_services.length > 0 && (
              <>
                <span
                  className="px-2 py-0.5 text-xs bg-sky-100 text-sky-700 rounded-full flex-shrink-0"
                >
                  {project.backend_services[0]}
                </span>
                {project.backend_services.length > 1 && (
                  <span className="px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-full flex-shrink-0">
                    +{project.backend_services.length - 1}
                  </span>
                )}
              </>
            )}

            {/* フロントエンド */}
            {project.frontend_tools && project.frontend_tools.length > 0 && (
              <>
                <span
                  className="px-2 py-0.5 text-xs bg-teal-100 text-teal-700 rounded-full flex-shrink-0"
                >
                  {project.frontend_tools[0]}
                </span>
                {project.frontend_tools.length > 1 && (
                  <span className="px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-full flex-shrink-0">
                    +{project.frontend_tools.length - 1}
                  </span>
                )}
              </>
            )}
          </div>

          {/* フッター：作成者といいね数 */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-200/60">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                {project.user_id && project.profiles?.avatar_url ? (
                  <Image
                    src={project.profiles.avatar_url}
                    alt={project.profiles.full_name || '匿名'}
                    width={20}
                    height={20}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] flex-shrink-0 text-slate-400">
                    👤
                  </div>
                )}
                <span className="text-xs text-slate-600 truncate">
                  {project.profiles?.full_name || '匿名'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                <span className="text-xs font-semibold">❤️</span>
                <span className="text-xs font-medium">{project.likes_count}</span>
              </div>
            </div>
          </div>

          {/* 日付情報 */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span suppressHydrationWarning>
              {new Date(project.created_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
            </span>
            {project.created_at !== project.updated_at && (
              <span suppressHydrationWarning title="更新日">
                更新: {new Date(project.updated_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </div>
  )
}
