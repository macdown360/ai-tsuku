import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  project: {
    id: string
    user_id: string | null
    poster_name?: string | null
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
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-xl transition-colors overflow-hidden flex flex-col border border-slate-200 hover:border-slate-300"
      aria-label={`${project.title}の詳細を見る`}
    >
      {/* プロジェクト画像 */}
      <div className="relative w-full aspect-[16/8.5] bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 overflow-hidden">
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

      <div className="p-3 flex flex-col flex-grow overflow-hidden">
        {/* タイトル */}
        <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1 line-clamp-1 leading-snug">
          {project.title}
        </h3>

        {/* 説明 */}
        <p className="text-slate-600 text-xs mb-2 line-clamp-1 leading-relaxed">
          {project.description}
        </p>

        {/* カテゴリ */}
        {project.categories && project.categories.length > 0 && (
          <div className="flex gap-1.5 mb-2 overflow-hidden">
            {project.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded-full flex-shrink-0"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-200/60 gap-2">
          <span className="text-xs text-slate-500 truncate">
            掲載者: {project.poster_name || '匿名'} ・
            <span suppressHydrationWarning className="ml-1">
              {new Date(project.created_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
            </span>
          </span>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
              <span className="text-xs font-semibold">❤️</span>
              <span className="text-xs font-medium">{project.likes_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
