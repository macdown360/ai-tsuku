'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { MAX_TAG_SELECTION, TAG_GROUPS } from '@/lib/tags'

const TITLE_MAX = 80
const DESC_MAX = 2000
const TAG_LIMIT_ERROR = `タグは最大${MAX_TAG_SELECTION}つまで選択できます`

export default function NewProjectPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [posterName, setPosterName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [publishedProjectId, setPublishedProjectId] = useState<string | null>(null)
  const submitIntentRef = useRef(false)

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

  const validateStep1 = () => {
    if (!title.trim()) {
      setError('プロダクト名を入力してください')
      return false
    }

    if (!description.trim()) {
      setError('説明を入力してください')
      return false
    }

    if (!url.trim()) {
      setError('URLを入力してください')
      return false
    }

    if (!posterName.trim()) {
      setError('掲載者名を入力してください')
      return false
    }

    setError(null)
    return true
  }

  const handleNext = () => {
    submitIntentRef.current = false
    if (step === 1) {
      if (!validateStep1()) return
      setStep(2)
      return
    }

    if (step === 2) {
      if (categories.length === 0) {
        setError('カテゴリを1つ以上選択してください')
        return
      }
      setError(null)
      setStep(3)
    }
  }

  const handleBack = () => {
    submitIntentRef.current = false
    setError(null)
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as 1 | 2 | 3)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== 3 || !submitIntentRef.current) {
      return
    }
    submitIntentRef.current = false
    setError(null)
    setLoading(true)

    try {
      if (!validateStep1()) {
        setLoading(false)
        setStep(1)
        return
      }

      if (categories.length === 0) {
        setError('カテゴリを1つ以上選択してください')
        setLoading(false)
        setStep(2)
        return
      }

      if (tags.length > MAX_TAG_SELECTION) {
        setError(TAG_LIMIT_ERROR)
        setLoading(false)
        setStep(3)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

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
              full_name: posterName.trim(),
              avatar_url: user.user_metadata?.avatar_url || null,
            })

          if (profileError) {
            throw new Error('プロフィールの作成に失敗しました。もう一度お試しください。')
          }
        } else {
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ full_name: posterName.trim() })
            .eq('id', user.id)

          if (updateProfileError) {
            throw new Error('掲載者名の更新に失敗しました。')
          }
        }
      }

      let uploadedImageUrl: string | null = null

      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        if (user?.id) {
          formData.append('userId', user.id)
        }

        const uploadResponse = await fetch('/api/uploads/thumbnail', {
          method: 'POST',
          body: formData,
        })

        const uploadResult = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || '画像のアップロードに失敗しました')
        }

        uploadedImageUrl = uploadResult.publicUrl ?? null
      }

      const baseProjectPayload = {
        user_id: user?.id ?? null,
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        image_url: uploadedImageUrl,
        categories,
        tags,
        ai_tools: null,
        backend_services: null,
        frontend_tools: null,
      }

      let data: { id: string } | null = null
      let insertError: any = null

      // poster_name 未反映環境でも投稿失敗しないようにフォールバック
      const firstInsert = await supabase
        .from('projects')
        .insert({
          ...baseProjectPayload,
          poster_name: posterName.trim(),
        })
        .select()
        .single()

      data = firstInsert.data as { id: string } | null
      insertError = firstInsert.error

      if (insertError?.message?.includes("poster_name")) {
        const fallbackInsert = await supabase
          .from('projects')
          .insert(baseProjectPayload)
          .select()
          .single()

        data = fallbackInsert.data as { id: string } | null
        insertError = fallbackInsert.error
      }

      if (insertError || !data) throw insertError || new Error('プロダクトの公開に失敗しました')
      setPublishedProjectId(data.id)
      setShowShareModal(true)
    } catch (submitError: any) {
      setError(submitError.message || 'プロダクトの公開に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const navigateToPublishedProject = () => {
    if (!publishedProjectId) return
    setShowShareModal(false)
    router.push(`/projects/${publishedProjectId}`)
    router.refresh()
  }

  const handleShareOnXAfterPublish = () => {
    if (!publishedProjectId) return

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    const projectUrl = `${baseUrl}/projects/${publishedProjectId}`
    const text = encodeURIComponent(`${title.trim()} を公開しました\n\n#AIツク #AIで作ってみた件`)
    const xUrl = `https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(projectUrl)}`

    window.open(xUrl, '_blank', 'width=550,height=420')
    navigateToPublishedProject()
  }

  const stepTitles: Record<1 | 2 | 3, string> = {
    1: '基本情報',
    2: 'カテゴリ',
    3: 'タグ',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <Navbar />

      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            戻る
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-4 tracking-tight">プロダクトを掲載する</h1>

          <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm">
            {[1, 2, 3].map((value) => {
              const current = value as 1 | 2 | 3
              const active = step === current
              const done = step > current
              return (
                <div key={current} className="inline-flex items-center gap-2">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {current}
                  </span>
                  <span className={active ? 'text-indigo-600 font-semibold' : 'text-slate-500'}>{stepTitles[current]}</span>
                  {current < 3 && <span className="text-slate-300">/</span>}
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          const target = e.target as HTMLElement
          const isTextarea = target.tagName.toLowerCase() === 'textarea'
          if (isTextarea) return

          if (e.key === 'Enter' && e.ctrlKey === false && e.metaKey === false) {
            e.preventDefault()
          }
        }} className="space-y-5">
          {step === 1 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800">（1）基本情報</h2>
                <p className="text-xs text-slate-400 mt-0.5">プロダクト名・説明・URL・掲載者名・サムネイル画像を入力してください</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1.5">
                    プロダクト名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    maxLength={TITLE_MAX}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 text-sm placeholder:text-slate-300"
                    placeholder="例: 便利なTodoプロダクト"
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-slate-400">わかりやすい名前をつけましょう</p>
                    <p className={`text-xs ${title.length > TITLE_MAX * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {title.length}/{TITLE_MAX}
                    </p>
                  </div>
                </div>

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
                    placeholder="どんなプロダクトですか？特徴や使い方を書いてみましょう"
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-slate-400">改行・Markdown記法に対応（例: # 見出し / - 箇条書き）</p>
                    <p className={`text-xs ${description.length > DESC_MAX * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {description.length}/{DESC_MAX}
                    </p>
                  </div>
                </div>

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
                </div>

                <div>
                  <label htmlFor="posterName" className="block text-sm font-medium text-slate-600 mb-1.5">
                    掲載者名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="posterName"
                    required
                    value={posterName}
                    onChange={(e) => setPosterName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 text-sm placeholder:text-slate-300"
                    placeholder="例: 山田 太郎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">サムネイル画像（任意）</label>
                  {imagePreview && (
                    <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                    <p className="text-slate-600 font-medium text-sm">ファイルをドラッグ&ドロップ</p>
                    <p className="text-slate-400 text-xs mt-1">またはクリックして選択</p>
                    <p className="text-slate-300 text-xs mt-2">JPG, PNG, GIF, WebP（最大10MB）</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800">（2）カテゴリ <span className="text-red-400 text-xs">*</span></h2>
                <p className="text-xs text-slate-400 mt-0.5">プロダクトの分類を選択してください（複数選択可）</p>
              </div>
              <div className="p-5">
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

                <div className="space-y-4">
                  {CATEGORY_GROUPS.map((group) => {
                    const selectedCount = group.options.filter((o) => categories.includes(o)).length
                    return (
                      <div key={group.label} className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50/80">
                          <span className="flex items-center gap-2">
                            <span>{group.icon}</span>
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
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800">（3）タグ</h2>
                <p className="text-xs text-slate-400 mt-0.5">対象ユーザー・料金形態・使用技術を指定できます（任意・複数選択可・最大5つ）</p>
              </div>
              <div className="p-5">
                {tags.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">選択中（{tags.length}/{MAX_TAG_SELECTION}件）</p>
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

                <div className="space-y-4">
                  {TAG_GROUPS.map((tagGroup) => {
                    const allOptions = tagGroup.groups.flatMap((g) => g.options)
                    const selectedCount = allOptions.filter((o) => tags.includes(o)).length
                    return (
                      <div key={tagGroup.label} className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50/80">
                          <span className="flex items-center gap-2">
                            <span>{tagGroup.icon}</span>
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
                                  const disabled = !checked && tags.length >= MAX_TAG_SELECTION
                                  return (
                                    <label
                                      key={option}
                                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 text-sm ${
                                        disabled
                                          ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                          : checked
                                          ? 'border-blue-300 bg-blue-50/80 text-blue-700 font-medium shadow-sm shadow-blue-100'
                                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleTag(option)}
                                        disabled={disabled}
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
                {tags.length >= MAX_TAG_SELECTION && (
                  <p className="mt-3 text-xs text-amber-600">タグは最大{MAX_TAG_SELECTION}つまで選択できます</p>
                )}
              </div>
            </section>
          )}

          {error && (
            <div className="bg-red-50/80 border border-red-200/60 text-red-600 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">現在のステップ: （{step}）{stepTitles[step]}</p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {step === 1 ? (
                  <Link
                    href="/"
                    className="flex-1 sm:flex-none text-center px-5 py-2.5 border border-slate-200 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 text-sm"
                  >
                    キャンセル
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 sm:flex-none px-5 py-2.5 border border-slate-200 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 text-sm"
                  >
                    戻る
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-indigo-200"
                  >
                    次へ
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={() => {
                      submitIntentRef.current = true
                    }}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm shadow-indigo-200 disabled:shadow-none"
                  >
                    {loading ? '公開しています...' : '公開する'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900">公開が完了しました</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Xでシェアして、より多くの人に見てもらいませんか？
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleShareOnXAfterPublish}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Xでシェアする
              </button>

              <button
                type="button"
                onClick={navigateToPublishedProject}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                シェアせずに公開ページへ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
