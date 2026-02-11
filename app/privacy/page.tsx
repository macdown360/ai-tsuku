'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 inline-flex items-center text-sm">
            ← ホームに戻る
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            個人情報保護方針
          </h1>
          <p className="text-gray-500 mt-2">最終更新日：2026年2月11日</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 prose prose-sm max-w-none space-y-6">
          {/* 第1条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第1条 方針の目的</h2>
            <p className="text-gray-700">
              Appli Farm（以下「運営者」という）は、本プラットフォームを利用するユーザーの個人情報の取扱いに関して、以下の方針に従い、個人情報の保護に努めます。本方針は、個人情報の保護に関する法律（以下「個人情報保護法」という）及びその他の関連法令を遵守します。
            </p>
          </section>

          {/* 第2条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第2条 取得する個人情報</h2>
            <p className="text-gray-700 mb-3">運営者は、以下の個人情報を取得します：</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-semibold">メールアドレス</span> — アカウント登録時に取得</li>
              <li><span className="font-semibold">ユーザープロフィール情報</span> — 氏名、自己紹介、アバター画像、Webサイト、SNSリンク（任意）</li>
              <li><span className="font-semibold">プロジェクト情報</span> — 登録されたプロジェクトのタイトル、説明、URL、画像、カテゴリ、タグ</li>
              <li><span className="font-semibold">利用ログ</span> — アクセス日時、操作履歴、IPアドレス（技術的な目的で自動取得）</li>
              <li><span className="font-semibold">相互作用情報</span> — 「水やり」（いいね）の履歴等</li>
            </ul>
          </section>

          {/* 第3条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第3条 個人情報の利用目的</h2>
            <p className="text-gray-700 mb-3">運営者は、取得した個人情報を以下の目的のために利用します：</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>サービスの提供・運営及び改善</li>
              <li>ユーザーのアカウント管理及び認証</li>
              <li>プロジェクト情報の管理及び公開</li>
              <li>サービスに関する通知及び告知</li>
              <li>セキュリティ対策及び不正利用の防止</li>
              <li>利用統計及びアクセス解析</li>
              <li>問い合わせ対応及びサポート</li>
              <li>法律上の義務を履行するため</li>
            </ul>
          </section>

          {/* 第4条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第4条 個人情報の保護</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 運営者は、ユーザーの個人情報を保護するため、適切なセキュリティ対策を講じています。
              </p>
              <p>
                <span className="font-semibold">2.</span> パスワードは暗号化され、安全に保管されます。
              </p>
              <p>
                <span className="font-semibold">3.</span> 本プラットフォームはSSL/TLS暗号化通信を採用し、通信内容の安全性を確保しています。
              </p>
              <p>
                <span className="font-semibold">4.</span> ただし、インターネットの性質上、完全なセキュリティを保証することはできません。
              </p>
            </div>
          </section>

          {/* 第5条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第5条 個人情報の第三者提供</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 運営者は、ユーザーの同意を得ず、個人情報を第三者に提供することはありません。
              </p>
              <p>
                <span className="font-semibold">2.</span> 以下の場合は、ユーザーの同意なく個人情報を提供することがあります：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>法律上の要請がある場合</li>
                <li>公衆衛生又は児童の健全な育成に重大な悪影響を及ぼすおそれがある場合</li>
                <li>犯罪捜査、脱税防止等の国家機関の業務に協力する必要がある場合</li>
              </ul>
              <p>
                <span className="font-semibold">3.</span> クラウドサービスプロバイダ（Supabase等）に対しては、本サービスの運営に必要な範囲での個人情報提供を行う場合があります。当該プロバイダは個人情報保護契約の対象となります。
              </p>
            </div>
          </section>

          {/* 第6条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第6条 プロフィール情報の公開範囲</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> ユーザーが入力するプロフィール情報（氏名、自己紹介、アバター画像等）は、本プラットフォーム上で他のユーザーに公開されます。
              </p>
              <p>
                <span className="font-semibold">2.</span> メールアドレスは、本プラットフォーム上では非公開です。
              </p>
              <p>
                <span className="font-semibold">3.</span> 公開情報に関する責任はユーザー自身で負うものとします。
              </p>
            </div>
          </section>

          {/* 第7条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第7条 個人情報へのアクセス権</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> ユーザーは、いつでもプロフィール編集ページにアクセスして、自身の個人情報を確認・修正できます。
              </p>
              <p>
                <span className="font-semibold">2.</span> 個人情報の削除をご希望の場合は、アカウント削除機能をご利用いただくか、お問い合わせフォームからご連絡ください。
              </p>
            </div>
          </section>

          {/* 第8条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第8条 クッキーとトラッキング</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 本プラットフォームは、ユーザーのセッション管理及び利用者分析目的でクッキーを使用します。
              </p>
              <p>
                <span className="font-semibold">2.</span> ユーザーはブラウザ設定でクッキーを無効にすることができますが、その場合、本サービスの一部機能が正常に動作しない可能性があります。
              </p>
            </div>
          </section>

          {/* 第9条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第9条 個人情報の保持期間</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> アカウントが有効である限り、ユーザーの個人情報は保管されます。
              </p>
              <p>
                <span className="font-semibold">2.</span> アカウント削除後、個人情報は速やかに削除されるか、匿名化・統計処理されます。
              </p>
              <p>
                <span className="font-semibold">3.</span> ただし、法律上の保存義務がある場合は、その限りではありません。
              </p>
            </div>
          </section>

          {/* 第10条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第10条 個人情報保護方針の变更</h2>
            <p className="text-gray-700">
              運営者は、本方針を随時変更することができます。変更後は、本プラットフォームに掲載した時点で効力が生じるものとします。重大な変更の場合は、メール通知による予告を行う場合があります。
            </p>
          </section>

          {/* 第11条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第11条 お問い合わせ</h2>
            <p className="text-gray-700">
              個人情報の取扱いに関するご質問、ご不明な点、又は情報削除のご要望については、本プラットフォームの「お問い合わせ」フォームからご連絡ください。
            </p>
          </section>

          {/* セクション */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">個人情報の見直し・削除方法</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">自動取得情報の見直し：</span>
                プロフィール編集ページにアクセスしていただくことで、ご自身が登録された情報の確認と修正が可能です。
              </p>
              <p>
                <span className="font-semibold">アカウント削除：</span>
                プロフィール編集ページからアカウント削除を申請できます。削除後、登録されたすべての個人情報が削除されます（ただし、プロジェクト作成日時等の統計データは匿名化して保管される場合があります）。
              </p>
              <p>
                <span className="font-semibold">その他のご要望：</span>
                上記の方法でご対応いただけない場合は、お問い合わせフォームからご連絡ください。
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-sm text-gray-500">
              © 2026 Appli Farm. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
