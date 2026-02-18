'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<{ title: string; message: string; suggestion: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email) {
      setError({
        title: 'メールアドレスを入力してください',
        message: 'リセット用メールの送信先を指定する必要があります。',
        suggestion: 'メールアドレス欄にメールアドレスを入力してください。',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setSuccessMessage(
        `パスワードリセット用のメールを ${email} に送信しました。メール内のリンクをクリックして、新しいパスワードを設定してください。（メールは15分以内に届きます）`
      )
      setEmail('')
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.message || 'パスワードリセットに失敗しました')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-xl font-bold text-gray-900">AIで作ってみた件</span>
        </Link>
        <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
          パスワードをリセット
        </h2>
        <p className="mt-2 text-center text-xs text-gray-400">
          登録されているメールアドレスを入力してください。
          <br />
          パスワードリセット用のメールを送信します。
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 md:py-8 px-5 rounded-xl border border-gray-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-900 font-semibold text-sm mb-1">
                  {error.title}
                </p>
                <p className="text-red-700 text-sm mb-2">
                  {error.message}
                </p>
                <p className="text-red-600 text-xs bg-white rounded px-3 py-2">
                  💡 {error.suggestion}
                </p>
              </div>
            )}

            {successMessage && (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                  <p className="font-semibold mb-1">✅ 送信完了</p>
                  <p className="text-xs">{successMessage}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="example@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'リセットメールを送信中...' : 'リセットメールを送信'}
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>アカウントをお持ちでしょうか？</p>
              <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
                ログインページに戻る
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
