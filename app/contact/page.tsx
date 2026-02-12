'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('すべての項目を入力してください')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('送信に失敗しました。もう一度お試しください。')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      // 3秒後にリセット
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="max-w-2xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-green-600 hover:text-green-700 flex items-center text-sm md:text-base">
            ← ホームに戻る
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 md:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              📧 お問い合わせ
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              ご意見・ご質問やバグ報告など、お気軽にお問い合わせください。
            </p>
          </div>

          <div className="p-6 md:p-8">
            {submitted && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm md:text-base">
                ✓ お問い合わせありがとうございます。送信いたしました。
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm md:text-base">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 名前 */}
              <div>
                <label htmlFor="name" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田太郎"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm md:text-base"
                  required
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm md:text-base"
                  required
                />
              </div>

              {/* 件名 */}
              <div>
                <label htmlFor="subject" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  件名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="ご質問やご意見をお聞かせください"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm md:text-base"
                  required
                />
              </div>

              {/* メッセージ */}
              <div>
                <label htmlFor="message" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="詳しくお聞かせください"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm md:text-base resize-none"
                  required
                />
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? '送信中...' : '📧 送信する'}
              </button>
            </form>

            {/* 補足情報 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-500 text-center">
                通常、お問い合わせへのご返信は営業日2日以内にさせていただきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
