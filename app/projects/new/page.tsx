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
    options: [
      'eラーニング',
      'クイズ・テスト作成',
      '学習管理',
      'ドキュメント共有',
    ],
  },
  {
    label: 'その他',
    options: [
      '自動化・効率化ツール',
      'API連携ツール',
      'AI活用ツール',
      'セキュリティ・認証',
      'その他ユーティリティ',
    ],
  },
]

export default function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (file: File | null) => {
    if (!file) return

    // ファイルサイズをチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      setError('画像ファイルは10MB以下にしてください')
      return
    }

    // ファイルタイプをチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }

    setImageFile(file)
    setError(null)

    // プレビューを作成
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

      // プロフィールが存在するか確認し、なければ作成
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // プロフィールが存在しない場合は作成
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

      // 画像をアップロード
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${user.id}-${Date.now()}.${fileExt}`
          const filePath = `projects/${fileName}`

          const { error: uploadError, data } = await supabase.storage
            .from('project-images')
            .upload(filePath, imageFile, { upsert: false })

          if (uploadError) {
            console.error('Upload error details:', uploadError)
            
            // バケットが見つからない場合の特別なエラーメッセージ
            if (uploadError.message === 'Bucket not found') {
              throw new Error(
                'Supabase Storage の設定がまだ完了していません。\n\n' +
                'SETUP.md の「3. Supabase Storage のセットアップ」を参照して、\n' +
                '「project-images」という名前のバケットを作成してください。'
              )
            }

            // RLS ポリシーエラーの場合
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

          // 公開URLを取得
          const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath)

          uploadedImageUrl = publicUrl
        } catch (uploadException: any) {
          console.error('Upload exception:', uploadException)
          throw new Error(uploadException.message || '画像のアップロードに失敗しました')
        }
      }

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title,
          description,
          url,
          image_url: uploadedImageUrl || null,
          categories,
          tags: tagsArray,
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
      
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 flex items-center">
            ← 戻る
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🌱 新しいアプリの種をまく
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="例: 便利なTodoアプリ"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="アプリの説明、使用した技術、特徴などを記載してください"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サムネイル画像（オプション）
              </label>
              
              {/* 画像プレビュー */}
              {imagePreview && (
                <div className="mb-4 relative w-full h-48 rounded-md overflow-hidden bg-gray-100">
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
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm font-medium"
                  >
                    削除
                  </button>
                </div>
              )}

              {/* ドラッグアンドドロップエリア */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50'
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
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-gray-700 font-medium mb-1">
                  ファイルをドラッグ&ドロップ
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  またはクリックして選択してください
                </p>
                <p className="text-gray-400 text-xs">
                  対応形式: JPG, PNG, GIF, WebP（最大10MB）
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-5">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      {group.label}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {group.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 hover:border-green-400 hover:bg-green-50"
                        >
                          <input
                            type="checkbox"
                            checked={categories.includes(option)}
                            onChange={() => toggleCategory(option)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                複数選択が可能です
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                タグ（オプション）
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="React, TypeScript, Tailwind (カンマ区切り)"
              />
              <p className="mt-1 text-sm text-gray-500">
                タグをカンマ区切りで入力してください（例: React, TypeScript, Tailwind）
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '植えています...' : '🌱 種をまく'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
