'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'

const CATEGORY_GROUPS = [
  {
    label: 'コア業務',
    icon: '💼',
    options: [
      '営業・販売管理',
      '顧客管理（CRM）',
      'プロジェクト管理',
      'タスク・ToDo管理',
      'スケジュール・予定管理',
      '在庫管理',
      '経理・会計',
      '人事・勤怠管理',
      '請求書・見積書作成',
    ],
  },
  {
    label: 'マーケティング・コミュニケーション',
    icon: '📢',
    options: [
      'マーケティング支援',
      'SNS管理',
      'メール配信',
      'アンケート・フォーム作成',
      'チャット・メッセージング',
    ],
  },
  {
    label: 'コンテンツ制作',
    icon: '🎨',
    options: [
      '文書作成・編集',
      'デザイン・画像編集',
      '動画編集',
      'プレゼンテーション作成',
      'Webサイト作成',
    ],
  },
  {
    label: 'データ・分析',
    icon: '📊',
    options: [
      'データ分析・可視化',
      'レポート作成',
      'ダッシュボード',
      '計算・シミュレーション',
      'ファイル変換・処理',
    ],
  },
  {
    label: '学習・教育',
    icon: '📚',
    options: [
      'eラーニング',
      'クイズ・テスト作成',
      '学習管理',
      'ドキュメント共有',
    ],
  },
  {
    label: 'その他',
    icon: '🔧',
    options: [
      '自動化・効率化ツール',
      'API連携ツール',
      'AI活用ツール',
      'セキュリティ・認証',
      'その他ユーティリティ',
    ],
  },
]

const TAG_GROUPS = [
  {
    label: '利用形態タグ',
    icon: '🏷️',
    groups: [
      {
        label: '料金',
        options: ['無料', '有料', 'フリーミアム'],
      },
      {
        label: '利用規模',
        options: ['個人向け', 'チーム向け', '企業向け'],
      },
      {
        label: 'アクセス',
        options: ['ブラウザ完結', 'アカウント不要', 'モバイル対応', 'インストール不要', 'PWA対応', 'オフライン対応'],
      },
    ],
  },
  {
    label: '業界・用途タグ',
    icon: '🏢',
    groups: [
      {
        label: '業種',
        options: ['小売・EC', '不動産', '飲食店', '医療・ヘルスケア', '教育', '製造業', '士業', '建設・工事', '美容・サロン', '運送・物流', 'IT・Web制作', '広告・マーケティング', '金融・保険', '人材派遣'],
      },
      {
        label: '用途',
        options: ['プロジェクト管理', 'タスク管理', '顧客管理（CRM）', '在庫管理', '見積書・請求書作成', '勤怠管理', '採用管理', 'イベント運営', 'カスタマーサポート', '業務効率化', 'データ管理', '資料作成', 'コスト削減', 'SNS管理', 'メール配信', '分析・レポート', '初心者向け', '多言語対応'],
      },
    ],
  },
]

const AI_TOOLS = ['Gemini', 'Chat GPT', 'Cursor', 'Claude', 'Bolt', 'V0', 'Copilot', 'Perplexity', 'Grok', 'LLaMA', 'Mistral', 'Notion', 'Airtable', 'Zapier', 'Make']

const BACKEND_SERVICES = ['Supabase', 'Firebase', 'AWS', 'Heroku', 'Railway', 'Render', 'Vercel', 'PlanetScale', 'MongoDB', 'PostgreSQL', 'Node.js', 'Python']

const FRONTEND_TOOLS = ['Vercel', 'Netlify', 'GitHub Pages', 'Cloudflare Pages', 'AWS Amplify', 'Firebase Hosting', 'Heroku', 'Render']

const TITLE_MAX = 80
const DESC_MAX = 2000

export default function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [aiTools, setAiTools] = useState<string[]>([])
  const [backendServices, setBackendServices] = useState<string[]>([])
  const [frontendTools, setFrontendTools] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

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
    setTags((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
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
    setLoading(true)

    try {
      if (categories.length === 0) {
        setError('カテゴリを1つ以上選択してください')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
            throw new Error('プロフィールの作成に失敗しました。もう一度お試しください。')
          }
        }
      }

      let uploadedImageUrl: string | null = null

      if (imageFile) {
        if (!user) {
          throw new Error('画像付きで公開する場合はログインが必要です。画像なしならそのまま公開できます。')
        }

        try {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${user?.id || 'anon'}-${Date.now()}.${fileExt}`
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
        } catch (uploadException: any) {
          console.error('Upload exception:', uploadException)
          throw new Error(uploadException.message || '画像のアップロードに失敗しました')
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id ?? null,
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
        .select()
        .single()

      if (error) throw error

      router.push(`/projects/${data.id}`)
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'プロジェクトの公開に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <Navbar />

      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            戻る
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-4 tracking-tight">
            作品を公開する
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            ログインなしでも公開できます（画像アップロードはログイン時のみ）
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50/80 border border-red-200/60 text-red-600 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* ==================== セクション1: 基本情報 ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">基本情報</h2>
              <p className="text-xs text-slate-400 mt-0.5">アプリの名前・説明・URLを入力してください</p>
            </div>
            <div className="p-5 space-y-5">
              {/* タイトル */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1.5">
                  アプリ名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  maxLength={TITLE_MAX}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 text-sm placeholder:text-slate-300"
                  placeholder="例: 便利なTodoアプリ"
                />
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-slate-400">わかりやすい名前をつけましょう</p>
                  <p className={`text-xs ${title.length > TITLE_MAX * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {title.length}/{TITLE_MAX}
                  </p>
                </div>
              </div>

              {/* 説明 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1.5">
                  説明 <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  maxLength={DESC_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 resize-y text-sm placeholder:text-slate-300"
                  placeholder="どんなアプリですか？特徴や使い方を書いてみましょう"
                />
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-slate-400">特徴、使い方、技術スタックなどを記載</p>
                  <p className={`text-xs ${description.length > DESC_MAX * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {description.length}/{DESC_MAX}
                  </p>
                </div>
              </div>

              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-600 mb-1.5">
                  URL <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔗</span>
                  <input
                    type="url"
                    id="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 text-sm placeholder:text-slate-300"
                    placeholder="https://example.com"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">アプリのURLまたはリポジトリのURL</p>
              </div>
            </div>
          </section>

          {/* ==================== セクション2: 使用したAIツール ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">使用したAIツール</h2>
              <p className="text-xs text-slate-400 mt-0.5">このプロジェクトで使用したAIツールを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のAIツールバッジ */}
              {aiTools.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">選択中（{aiTools.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {aiTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleAiTool(tool)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {tool}
                        <span className="text-violet-400 hover:text-red-500">✕</span>
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
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 text-sm ${
                        checked
                          ? 'border-violet-300 bg-violet-50/80 text-violet-700 font-medium shadow-sm shadow-violet-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAiTool(tool)}
                        className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded"
                      />
                      <span>{tool}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション2.5: バックエンド/サービス ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">バックエンド/サービス</h2>
              <p className="text-xs text-slate-400 mt-0.5">使用したバックエンドサービスを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のバックエンドサービスバッジ */}
              {backendServices.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">選択中（{backendServices.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {backendServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleBackendService(service)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {service}
                        <span className="text-sky-400 hover:text-red-500">✕</span>
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
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 text-sm ${
                        checked
                          ? 'border-sky-300 bg-sky-50/80 text-sky-700 font-medium shadow-sm shadow-sky-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBackendService(service)}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                      />
                      <span>{service}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション2.6: フロントエンドツール ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">フロントエンドツール</h2>
              <p className="text-xs text-slate-400 mt-0.5">使用したフロントエンドツール/ホスティングを選択してください（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のフロントエンドツールバッジ */}
              {frontendTools.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">選択中（{frontendTools.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {frontendTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleFrontendTool(tool)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {tool}
                        <span className="text-teal-400 hover:text-red-500">✕</span>
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
                          ? 'border-teal-300 bg-teal-50/80 text-teal-700 font-medium shadow-sm shadow-teal-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFrontendTool(tool)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                      />
                      <span>{tool}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== セクション3: サムネイル画像 ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">サムネイル画像</h2>
              <p className="text-xs text-slate-400 mt-0.5">アプリを視覚的にアピールしましょう（任意）</p>
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
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="absolute top-2 right-2 bg-slate-800/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg hover:bg-red-500 text-sm font-medium shadow-lg transition-colors duration-200"
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
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-indigo-400 bg-indigo-50/50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/20'
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
                <div className="text-3xl mb-2 opacity-60">📷</div>
                <p className="text-slate-600 font-medium text-sm">
                  ファイルをドラッグ&ドロップ
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  またはクリックして選択
                </p>
                <p className="text-slate-300 text-xs mt-2">
                  JPG, PNG, GIF, WebP（最大10MB）
                </p>
              </div>
            </div>
          </section>

          {/* ==================== セクション4: カテゴリ ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">カテゴリ <span className="text-red-400 text-xs">*</span></h2>
              <p className="text-xs text-slate-400 mt-0.5">アプリの分類を選択してください（複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のカテゴリバッジ */}
              {categories.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">選択中（{categories.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {cat}
                        <span className="text-indigo-400 hover:text-red-500">✕</span>
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
                    <div key={group.label} className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50/80">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-600">{group.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-indigo-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
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
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 text-sm ${
                                  checked
                                    ? 'border-indigo-300 bg-indigo-50/80 text-indigo-700 font-medium shadow-sm shadow-indigo-100'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCategory(option)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
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
                <p className="mt-3 text-xs text-amber-600/80 flex items-center gap-1">
                  <span>⚠️</span> 1つ以上のカテゴリを選択してください
                </p>
              )}
            </div>
          </section>

          {/* ==================== セクション5: タグ ==================== */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">タグ</h2>
              <p className="text-xs text-slate-400 mt-0.5">利用条件や対象業界を指定できます（任意・複数選択可）</p>
            </div>
            <div className="p-5">
              {/* 選択中のタグバッジ */}
              {tags.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">選択中（{tags.length}件）</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {tag}
                        <span className="text-blue-400 hover:text-red-500">✕</span>
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
                    <div key={tagGroup.label} className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50/80">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-600">{tagGroup.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-indigo-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="p-3 bg-white space-y-3">
                        {tagGroup.groups.map((group) => (
                          <div key={group.label}>
                            <p className="text-xs font-semibold text-slate-500 mb-2 pl-1">{group.label}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {group.options.map((option) => {
                                const checked = tags.includes(option)
                                return (
                                  <label
                                    key={option}
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 text-sm ${
                                      checked
                                        ? 'border-blue-300 bg-blue-50/80 text-blue-700 font-medium shadow-sm shadow-blue-100'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleTag(option)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
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
            </div>
          </section>

          {/* ==================== 送信ボタン ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                <span className="text-red-400">*</span> は必須項目です
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/"
                  className="flex-1 sm:flex-none text-center px-5 py-2.5 border border-slate-200 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 text-sm"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm shadow-indigo-200 disabled:shadow-none"
                >
                  {loading ? '公開しています...' : '公開する'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
