'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<{ title: string; message: string; suggestion: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const supabase = createClient()

  // パスワードの入力値チェック
  const validatePassword = (pwd: string): { valid: boolean; message?: string } => {
    if (pwd.length < 6) {
      return { valid: false, message: 'パスワードは6文字以上である必要があります' }
    }
    if (!/(?=.*[a-z])/.test(pwd) && !/(?=.*[A-Z])/.test(pwd) && !/(?=.*[0-9])/.test(pwd)) {
      return { valid: true } // 英数字混在の強制しない（UXのため）
    }
    return { valid: true }
  }

  useEffect(() => {
    // URLハッシュにトークンがあるか確認
    const hash = window.location.hash.substring(1)
    if (!hash) {
      setTokenValid(false)
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // バリデーション
    const validation = validatePassword(password)
    if (!validation.valid) {
      setError({
        title: 'パスワードが要件を満たしていません',
        message: validation.message || 'パスワードを確認してください。',
        suggestion: '新しいパスワードを入力してください。',
      })
      return
    }

    if (password !== passwordConfirm) {
      setError({
        title: 'パスワードが一致しません',
        message: '入力したパスワードが異なります。',
        suggestion: 'パスワードと確認用パスワードが同じことを確認してください。',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      // 2秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.message || 'パスワード更新に失敗しました')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-center py-12 px-4 sm:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-xl font-bold text-gray-900">AIで作ってみた件</span>
          </Link>
          <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
            パスワード更新
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 md:py-8 px-5 rounded-xl border border-gray-100 sm:px-10">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-900 font-semibold text-sm mb-1">
                リセットリンクが無効です
              </p>
              <p className="text-red-700 text-sm mb-2">
                パスワードリセット用のリンクが見つかりません。
              </p>
              <p className="text-red-600 text-xs bg-white rounded px-3 py-2">
                💡 メール内のリンクからアクセスしてください。リンクの有効期限は1時間です。
              </p>
            </div>
            <Link
              href="/auth/reset-password"
              className="block w-full mt-4 text-center py-2.5 px-4 rounded-full text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              パスワードリセットページに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-xl font-bold text-gray-900">AIで作ってみた件</span>
        </Link>
        <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
          新しいパスワードを設定
        </h2>
        <p className="mt-2 text-center text-xs text-gray-400">
          新しいパスワードを入力してください
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 md:py-8 px-5 rounded-xl border border-gray-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleUpdatePassword}>
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

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-900 font-semibold text-sm mb-1">
                  ✅ パスワードが更新されました
                </p>
                <p className="text-green-700 text-sm">
                  ログインページへ移動します...
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                新しいパスワード（6文字以上）
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                パスワード（確認）
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
              {password && passwordConfirm && password === passwordConfirm && (
                <p className="mt-1 text-xs text-green-600">✓ パスワードが一致します</p>
              )}
              {password && passwordConfirm && password !== passwordConfirm && (
                <p className="mt-1 text-xs text-red-600">✗ パスワードが一致しません</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !success}
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'パスワードを更新中...' : 'パスワードを更新'}
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
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
