import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* ブランド */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-lg md:text-2xl font-bold text-green-700">🌱 Farm</span>
            </Link>
            <p className="text-gray-600 text-xs md:text-sm">
              開発者がつくったWebアプリを紹介し、
              <br />
              互いに成長を応援するプラットフォーム
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  プロジェクト一覧
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  新規登録
                </Link>
              </li>
            </ul>
          </div>

          {/* ポリシー */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">ポリシー</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors">
                  個人情報保護方針
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-200 pt-6 md:pt-8">
          <p className="text-center text-gray-500 text-xs md:text-sm">
            © {currentYear} Appli Farm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
