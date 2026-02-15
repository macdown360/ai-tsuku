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
        options: ['小売・EC', '不動産', '飲食店', '医療・ヘルスケア', '教育', '製造業', '士業', '建設・工事', '美容・サロン', '運送・物流'],
      },
      {
        label: '用途',
        options: ['イベント運営', 'カスタマーサポート', '業務効率化', 'データ管理', '資料作成', 'コスト削減', '初心者向け', 'AI活用'],
      },
    ],
  },
]

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [openCatGroups, setOpenCatGroups] = useState<Set<string>>(new Set())
  const [openTagGroups, setOpenTagGroups] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()


  const toggleAccordion = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) => {
    setFn((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

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

      if (!user) {
        throw new Error('ログインが必要です')
      }

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

      let uploadedImageUrl: string | null = null

      if (imageFile) {
        try {
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
        } catch (uploadException: any) {
          console.error('Upload exception:', uploadException)
          throw new Error(uploadException.message || '画像のアップロードに失敗しました')
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title,
          description,
          url,
          image_url: uploadedImageUrl || null,
          categories,
          tags,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/projects/${data.id}`)
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'プロジェクトの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link href="/" className="text-green-600 hover:text-green-700 inline-flex items-center text-sm">
            ← 戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
            ✨ 作品を公開する
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            あなたの作品をみんなと共有しましょう
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ==================== セクション1: 基本情報 ==================== */}
          <section className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">1</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">基本情報</h2>
                  <p className="text-xs text-gray-500">アプリの名前・説明・URLを入力してください</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-y"
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
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">アプリのURLまたはリポジトリのURL</p>
              </div>
            </div>
          </section>

          {/* ==================== セクション2: サムネイル画像 ==================== */}
          <section className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white text-sm font-bold">2</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">サムネイル画像</h2>
                  <p className="text-xs text-gray-500">アプリを視覚的にアピールしましょう（任意）</p>
                </div>
              </div>
            </div>
            <div className="p-6">
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
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
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

          {/* ==================== セクション3: カテゴリ ==================== */}
          <section className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">3</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">カテゴリ <span className="text-red-500 text-sm">*</span></h2>
                  <p className="text-xs text-gray-500">アプリの分類を選択してください（複数選択可）</p>
                </div>
              </div>
            </div>
            <div className="p-6">
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {cat}
                        <span className="text-green-500 hover:text-red-500">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* アコーディオン形式のカテゴリグループ */}
              <div className="space-y-2">
                {CATEGORY_GROUPS.map((group) => {
                  const isOpen = openCatGroups.has(group.label)
                  const selectedCount = group.options.filter((o) => categories.includes(o)).length
                  return (
                    <div key={group.label} className="rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(openCatGroups, setOpenCatGroups, group.label)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="flex items-center gap-2">
                          <span>{group.icon}</span>
                          <span className="text-sm font-semibold text-gray-700">{group.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {group.options.map((option) => {
                              const checked = categories.includes(option)
                              return (
                                <label
                                  key={option}
                                  className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                                    checked
                                      ? 'border-green-400 bg-green-50 text-green-800 font-medium'
                                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleCategory(option)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span>{option}</span>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )}
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

          {/* ==================== セクション4: タグ ==================== */}
          <section className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white text-sm font-bold">4</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">タグ</h2>
                  <p className="text-xs text-gray-500">利用条件や対象業界を指定できます（任意・複数選択可）</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* 選択中のタグバッジ */}
              {tags.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">選択中（{tags.length}件）</p>
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

              {/* アコーディオン形式のタググループ */}
              <div className="space-y-2">
                {TAG_GROUPS.map((tagGroup) => {
                  const isOpen = openTagGroups.has(tagGroup.label)
                  const allOptions = tagGroup.groups.flatMap((g) => g.options)
                  const selectedCount = allOptions.filter((o) => tags.includes(o)).length
                  return (
                    <div key={tagGroup.label} className="rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(openTagGroups, setOpenTagGroups, tagGroup.label)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="flex items-center gap-2">
                          <span>{tagGroup.icon}</span>
                          <span className="text-sm font-semibold text-gray-700">{tagGroup.label}</span>
                          {selectedCount > 0 && (
                            <span className="ml-1 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-3 bg-white space-y-3">
                          {tagGroup.groups.map((group) => (
                            <div key={group.label}>
                              <p className="text-xs font-semibold text-gray-500 mb-2 pl-1">{group.label}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {group.options.map((option) => {
                                  const checked = tags.includes(option)
                                  return (
                                    <label
                                      key={option}
                                      className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all text-sm ${
                                        checked
                                          ? 'border-blue-400 bg-blue-50 text-blue-800 font-medium'
                                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleTag(option)}
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
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ==================== 送信ボタン ==================== */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> は必須項目です
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/"
                  className="flex-1 sm:flex-none text-center px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold shadow-sm"
                >
                  {loading ? '公開しています...' : '✨ 公開する'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
