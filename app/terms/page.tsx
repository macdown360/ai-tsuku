'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 inline-flex items-center text-sm">
            ← ホームに戻る
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            利用規約
          </h1>
          <p className="text-gray-500 mt-2">最終更新日：2026年2月11日</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 prose prose-sm max-w-none space-y-6">
          {/* 第1条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第1条 サービスの概要</h2>
            <p className="text-gray-700">
              Appli Farm（以下「本サービス」という）は、ユーザーが開発・運営するWebアプリケーションやサービスを登録・紹介し、ユーザー間で評価・共有できるプラットフォーム（以下「本プラットフォーム」という）です。本サービスを通じて、ユーザーは自身のプロジェクト情報を登録し、他のユーザーから「水やり」（いいね）を受けることができます。
            </p>
          </section>

          {/* 第2条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第2条 アカウント登録</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 本サービスを利用するには、ユーザーが有効なメールアドレスでアカウント登録を行う必要があります。
              </p>
              <p>
                <span className="font-semibold">2.</span> ユーザーは登録情報の正確性及び真実性を保証し、登録情報を常に最新の状態に保つ責任を負います。
              </p>
              <p>
                <span className="font-semibold">3.</span> アカウントのログイン情報は個人に属するものです。ユーザーは第三者による不正使用を防ぐため、パスワードを厳重に管理する責任を負います。
              </p>
              <p>
                <span className="font-semibold">4.</span> アカウントに関連する全ての活動について、ユーザーが責任を負うものとします。
              </p>
            </div>
          </section>

          {/* 第3条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第3条 プロジェクト登録と管理</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> ユーザーは、著作権を有するプロジェクト（Webアプリケーション、ツール、その他デジタルサービス）に限り、本プラットフォームに登録できます。
              </p>
              <p>
                <span className="font-semibold">2.</span> 登録されたプロジェクト情報は、他のユーザーに公開されます。
              </p>
              <p>
                <span className="font-semibold">3.</span> ユーザーは自身が登録したプロジェクトの情報を随時編集・削除できます。削除したプロジェクトは復元できません。
              </p>
              <p>
                <span className="font-semibold">4.</span> 以下の内容を含むプロジェクトの登録は禁止します：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>違法行為又は違法行為に該当する可能性のあるコンテンツ</li>
                <li>第三者の知的財産権を侵害するコンテンツ</li>
                <li>差別、ハラスメント、暴力、その他有害なコンテンツ</li>
                <li>スパムや詐欺行為に該当するコンテンツ</li>
                <li>他ユーザーの個人情報を無断で公開するコンテンツ</li>
              </ul>
            </div>
          </section>

          {/* 第4条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第4条 ユーザーの行為制限</h2>
            <p className="text-gray-700 mb-3">ユーザーは、本サービスの利用において以下の行為を行ってはならないものとします：</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>本サービスに対する不正アクセス又は不正利用</li>
              <li>本サービスのセキュリティを損なう行為</li>
              <li>他のユーザーの利用を妨害する行為</li>
              <li>本プラットフォームのシステムに負荷をかける行為</li>
              <li>第三者に成りすまし、又は虚偽の情報を公開する行為</li>
              <li>その他本規約に違反する行為</li>
            </ul>
          </section>

          {/* 第5条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第5条 知的財産権</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> ユーザーが登録するプロジェクト情報に含まれる知的財産権は、当該ユーザーが保有するものとします。
              </p>
              <p>
                <span className="font-semibold">2.</span> 本プラットフォーム自体及びそのデザイン・機能に関する著作権は、運営者に帰属します。
              </p>
              <p>
                <span className="font-semibold">3.</span> ユーザーは、本サービスを利用する権利を有しますが、本プラットフォームの複製、修正、翻案、その他の改変を行うことはできません。
              </p>
            </div>
          </section>

          {/* 第6条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第6条 免責事項</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 本サービスは「現状のまま」提供されています。本プラットフォームの安定性、継続性、正確性について、運営者は一切の保証をしません。
              </p>
              <p>
                <span className="font-semibold">2.</span> ユーザーが登録するプロジェクト情報の正確性、完全性、合法性については、ユーザー自身の責任です。
              </p>
              <p>
                <span className="font-semibold">3.</span> 本サービスの利用により損害が生じた場合、運営者は責任を負いません。
              </p>
              <p>
                <span className="font-semibold">4.</span> 他のユーザーとの間での紛争について、運営者は一切の責任を負いません。
              </p>
            </div>
          </section>

          {/* 第7条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第7条 プライバシーと個人情報</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                個人情報の取扱いについては、<Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">個人情報保護方針</Link>をご参照ください。
              </p>
            </div>
          </section>

          {/* 第8条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第8条 サービスの中断・終了</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">1.</span> 運営者は、予告なく本サービスを中断、変更、又は終了することができます。
              </p>
              <p>
                <span className="font-semibold">2.</span> サービス終了時、ユーザーが登録したプロジェクト情報の引き継ぎについて、運営者は一切の責任を負いません。
              </p>
            </div>
          </section>

          {/* 第9条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第9条 違反時の対応</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                ユーザーが本規約に違反した場合、運営者は以下の措置を講じることができます：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>プロジェクト情報の削除</li>
                <li>アカウントの一時停止</li>
                <li>アカウントの削除</li>
              </ul>
            </div>
          </section>

          {/* 第10条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第10条 規約の変更</h2>
            <p className="text-gray-700">
              運営者は、本規約を随時変更することができます。変更後は、本プラットフォームに掲載した時点で効力が生じるものとします。
            </p>
          </section>

          {/* 第11条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第11条 準拠法</h2>
            <p className="text-gray-700">
              本規約は、日本国法に準拠するものとし、本サービスに関する紛争は日本国の裁判所に属するものとします。
            </p>
          </section>

          {/* 第12条 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第12条 問い合わせ</h2>
            <p className="text-gray-700">
              本規約に関するご質問やご不明な点については、本プラットフォームの「お問い合わせ」フォームからご連絡ください。
            </p>
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
