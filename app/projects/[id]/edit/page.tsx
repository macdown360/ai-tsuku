'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { MAX_TAG_SELECTION, TAG_GROUPS } from '@/lib/tags'
import type { User } from '@supabase/supabase-js'

const AI_TOOLS = ['Gemini', 'Chat GPT', 'Cursor', 'Claude', 'Bolt', 'V0', 'Copilot', 'Perplexity', 'Grok', 'LLaMA', 'Mistral']

const BACKEND_SERVICES = ['Supabase', 'Firebase', 'AWS', 'Heroku', 'Railway', 'Render', 'Vercel', 'PlanetScale', 'MongoDB', 'PostgreSQL', 'Node.js', 'Python']

const FRONTEND_TOOLS = ['Vercel', 'Netlify', 'GitHub Pages', 'Cloudflare Pages', 'AWS Amplify', 'Firebase Hosting', 'Heroku', 'Render']

const TITLE_MAX = 80
const DESC_MAX = 2000
const TAG_LIMIT_ERROR = `タグは最大${MAX_TAG_SELECTION}つまで選択できます`
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
}

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<User | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [aiTools, setAiTools] = useState<string[]>([])
  const [backendServices, setBackendServices] = useState<string[]>([])
  const [frontendTools, setFrontendTools] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
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
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const { data: projectData, error } = await supabase
        .from('projects')
        .select('id, user_id, title, description, url, image_url, categories, tags, ai_tools, backend_services, frontend_tools')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !projectData) {
        console.error(error)
        router.push('/projects')
        return
      }

      if (projectData.user_id !== user.id) {
        router.push(`/projects/${projectData.id}`)
        return
      }

      setProject(projectData)
      setTitle(projectData.title)
      setDescription(projectData.description)
      setUrl(projectData.url)
      setCategories(projectData.categories || [])
      setTags(projectData.tags || [])
      setAiTools(projectData.ai_tools || [])
      setBackendServices(projectData.backend_services || [])
      setFrontendTools(projectData.frontend_tools || [])
      setCurrentImageUrl(projectData.image_url)
      setImagePreview(projectData.image_url)
      setLoading(false)
    }

    fetchProject()
  }, [resolvedParams, supabase, router])

  const handleFileChange = (file: File | null) => {
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('画像ファイルは10MB以下にしてください')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }

    setImageFile(file)
    setRemoveImage(false)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const toggleTag = (value: string) => {
    setTags((prev) => {
      if (prev.includes(value)) {
        setError((current) => (current === TAG_LIMIT_ERROR ? null : current))
        return prev.filter((item) => item !== value)
      }

      if (prev.length >= MAX_TAG_SELECTION) {
        setError(TAG_LIMIT_ERROR)
        return prev
      }

      setError((current) => (current === TAG_LIMIT_ERROR ? null : current))
      return [...prev, value]
    })
  }

  const toggleAiTool = (value: string) => {
    setAiTools((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const toggleBackendService = (value: string) => {
    setBackendServices((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const toggleFrontendTool = (value: string) => {
    setFrontendTools((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!project || !user) {
      setError('ログインが必要です')
      return
    }

    if (categories.length === 0) {
      setError('カテゴリを1つ以上選択してください')
      return
    }

    if (tags.length > MAX_TAG_SELECTION) {
      setError(TAG_LIMIT_ERROR)
      return
    }

    setSaving(true)

    try {
      let uploadedImageUrl = currentImageUrl

      if (removeImage) {
        uploadedImageUrl = null
      }

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `projects/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile, { upsert: false })

        if (uploadError) {
          console.error('Upload error details:', uploadError)

          if (uploadError.message === 'Bucket not found') {
            throw new Error(
              'Supabase Storage の設定がまだ完了していません。\n\n' +
              'SETUP.md の「3. Supabase Storage のセットアップ」を参照して、\n' +
              '「project-images」という名前のバケットを作成してください。'
            )
          }

          if (uploadError.message.includes('row-level security policy')) {
            throw new Error(
              'Supabase Storage のセキュリティポリシーが正しく設定されていません。\n\n' +
              'SETUP.md の「3. Supabase Storage のセットアップ」の\n' +
              'ステップ2「RLS ポリシー設定」を確認して、\n' +
              'CREATE ポリシーと SELECT ポリシーを作成してください。'
            )
          }

          throw new Error(`画像アップロード失敗: ${uploadError.message || '不明なエラー'}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath)

        uploadedImageUrl = publicUrl
      }

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title,
          description,
          url,
          image_url: uploadedImageUrl || null,
          categories,
          tags,
          ai_tools: aiTools.length > 0 ? aiTools : null,
          backend_services: backendServices.length > 0 ? backendServices : null,
          frontend_tools: frontendTools.length > 0 ? frontendTools : null,
        })
        .eq('id', project.id)

      if (updateError) throw updateError

      router.push(`/projects/${project.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || '更新に失敗しました')
    } finally {
      setSaving(false)
    }
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

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar />

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link href={`/projects/${project.id}`} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 戻る
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3">
            作品を編集
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            アプリの情報を更新しましょう
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* ==================== セクション1: 基本情報 ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">基本情報</h2>
              <p className="text-xs text-gray-400 mt-0.5">アプリの名前・説明・URLを入力してください</p>
            </div>
            <div className="p-5 space-y-5">
              {/* タイトル */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  アプリ名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  maxLength={TITLE_MAX}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
                  placeholder="例: 便利なTodoアプリ"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">わかりやすい名前をつけましょう</p>
                  <p className={`text-xs ${title.length > TITLE_MAX * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {title.length}/{TITLE_MAX}
                  </p>
                </div>
              </div>

              {/* 説明 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  maxLength={DESC_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-y text-sm"
                  placeholder="どんなアプリですか？特徴や使い方を書いてみましょう"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">特徴、使い方、技術スタックなどを記載</p>
                  <p className={`text-xs ${description.length > DESC_MAX * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {description.length}/{DESC_MAX}
                  </p>
                </div>
              </div>

              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔗</span>
                  <input
                    type="url"
                    id="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
                    placeholder="https://example.com"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">アプリのURLまたはリポジトリのURL</p>
              </div>
            </div>
          </section>

          {/* ==================== セクション2: 使用したAIツール ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">使用したAIツール</h2>
              <p className="text-xs text-gray-400 mt-0.5">このプロジェクトで使用したAIツールを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のAIツールバッジ */}
              {aiTools.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{aiTools.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {aiTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleAiTool(tool)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {tool}
                        <span className="text-purple-500 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AIツール選択 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {AI_TOOLS.map((tool) => {
                  const checked = aiTools.includes(tool)
                  return (
                    <label
                      key={tool}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                        checked
                          ? 'border-purple-400 bg-purple-50 text-purple-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAiTool(tool)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span>{tool}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション2.5: バックエンド/サービス ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">バックエンド/サービス</h2>
              <p className="text-xs text-gray-400 mt-0.5">使用したバックエンドサービスを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のバックエンドサービスバッジ */}
              {backendServices.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{backendServices.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {backendServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleBackendService(service)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {service}
                        <span className="text-blue-500 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* バックエンドサービス選択 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {BACKEND_SERVICES.map((service) => {
                  const checked = backendServices.includes(service)
                  return (
                    <label
                      key={service}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                        checked
                          ? 'border-blue-400 bg-blue-50 text-blue-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBackendService(service)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>{service}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション2.6: フロントエンドツール ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">フロントエンドツール</h2>
              <p className="text-xs text-gray-400 mt-0.5">使用したフロントエンドツール/ホスティングを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のフロントエンドツールバッジ */}
              {frontendTools.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{frontendTools.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {frontendTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleFrontendTool(tool)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {tool}
                        <span className="text-green-500 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* フロントエンドツール選択 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {FRONTEND_TOOLS.map((tool) => {
                  const checked = frontendTools.includes(tool)
                  return (
                    <label
                      key={tool}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                        checked
                          ? 'border-green-400 bg-green-50 text-green-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFrontendTool(tool)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span>{tool}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション3: サムネイル画像 ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">サムネイル画像</h2>
              <p className="text-xs text-gray-400 mt-0.5">アプリを視覚的にアピールしましょう（任意）</p>
            </div>
            <div className="p-5">
              {imagePreview && (
                <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setRemoveImage(true)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm font-medium shadow"
                  >
                    削除
                  </button>
                </div>
              )}

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                  aria-label="画像ファイルを選択"
                />
                <div className="text-3xl mb-1">📷</div>
                <p className="text-gray-700 font-medium text-sm">
                  ファイルをドラッグ&ドロップ
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  またはクリックして選択
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  JPG, PNG, GIF, WebP（最大10MB）
                </p>
              </div>
            </div>
          </section>

          {/* ==================== セクション4: カテゴリ ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">カテゴリ <span className="text-red-500 text-xs">*</span></h2>
              <p className="text-xs text-gray-400 mt-0.5">アプリの分類を選択してください（複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のカテゴリバッジ */}
              {categories.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{categories.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {cat}
                        <span className="text-emerald-400 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* カテゴリグループ */}
              <div className="space-y-4">
                {CATEGORY_GROUPS.map((group) => {
                  const selectedCount = group.options.filter((o) => categories.includes(o)).length
                  return (
                    <div key={group.label} className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{group.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {group.options.map((option) => {
                            const checked = categories.includes(option)
                            return (
                              <label
                                key={option}
                                className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                                  checked
                                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-medium'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCategory(option)}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <span>{option}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {categories.length === 0 && (
                <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                  <span>⚠️</span> 1つ以上のカテゴリを選択してください
                </p>
              )}
            </div>
          </section>

          {/* ==================== セクション5: タグ ==================== */}
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">タグ</h2>
              <p className="text-xs text-gray-400 mt-0.5">対象ユーザー・料金形態・使用技術を指定できます（任意・複数選択可・最大5つ）</p>
            </div>
            <div className="p-5">
              {/* 選択中のタグバッジ */}
              {tags.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{tags.length}/{MAX_TAG_SELECTION}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {tag}
                        <span className="text-blue-500 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* タググループ */}
              <div className="space-y-4">
                {TAG_GROUPS.map((tagGroup) => {
                  const allOptions = tagGroup.groups.flatMap((g) => g.options)
                  const selectedCount = allOptions.filter((o) => tags.includes(o)).length
                  return (
                    <div key={tagGroup.label} className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{tagGroup.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="p-3 bg-white space-y-3">
                        {tagGroup.groups.map((group) => (
                          <div key={group.label}>
                            <p className="text-xs font-semibold text-gray-500 mb-2 pl-1">{group.label}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {group.options.map((option) => {
                                const checked = tags.includes(option)
                                const disabled = !checked && tags.length >= MAX_TAG_SELECTION
                                return (
                                  <label
                                    key={option}
                                    className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                                      disabled
                                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : checked
                                        ? 'border-blue-400 bg-blue-50 text-blue-800 font-medium'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleTag(option)}
                                      disabled={disabled}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span>{option}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              {tags.length >= MAX_TAG_SELECTION && (
                <p className="mt-3 text-xs text-amber-600">タグは最大{MAX_TAG_SELECTION}つまで選択できます</p>
              )}
            </div>
          </section>

          {/* ==================== 送信ボタン ==================== */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                <span className="text-red-500">*</span> は必須項目です
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex-1 sm:flex-none text-center px-5 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {saving ? '保存中...' : '変更を保存'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
