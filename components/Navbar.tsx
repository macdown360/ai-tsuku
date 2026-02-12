'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-2 md:gap-8">
          <div className="flex items-center space-x-4 md:space-x-8 flex-1">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-lg md:text-2xl font-bold text-green-700">🌱 Farm</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                ホーム
              </Link>
              <Link
                href="/projects"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname?.startsWith('/projects')
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                プロジェクト一覧
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <Link
                  href="/projects/new"
                  className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  🌱 種をまく
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 whitespace-nowrap"
                >
                  プロフィール
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 whitespace-nowrap"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 whitespace-nowrap"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="space-y-2 pt-2 mb-4">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                ホーム
              </Link>
              <Link
                href="/projects"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname?.startsWith('/projects')
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                プロジェクト一覧
              </Link>
            </div>
            <div className="space-y-2 border-t pt-2">
              {user ? (
                <>
                  <Link
                    href="/projects/new"
                    className="block px-3 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                    onClick={() => setIsOpen(false)}
                  >
                    🌱 種をまく
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
                    onClick={() => setIsOpen(false)}
                  >
                    プロフィール
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
                    onClick={() => setIsOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                    onClick={() => setIsOpen(false)}
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
