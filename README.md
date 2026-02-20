# AIで作ってみた件 🌱

自分が作ったWEBサイトやアプリを公開して、利用者からのフィードバックを受けながら一緒に育てていくプラットフォーム

## 機能

- 🌱 **種をまく**: タイトル、説明、URLを入力するだけで簡単にアプリを公開
- 🌻 **発見しやすい**: カテゴリやタグで整理され、検索機能で目的のアプリがすぐに見つかる
- 👤 **ユーザー認証**: Supabaseによる安全なユーザー登録・ログイン機能
- 💧 **水をやる**: 気に入ったアプリにいいね
- 📱 **SNSシェア**: Twitter、Facebook、LinkedIn、LINEでプロジェクトをシェア
- 🎨 **モダンなUI**: Tailwind CSSによる美しいデザイン
- 🔗 **OGP対応**: SNSでシェアされた時に美しいカード表示
- 📊 **構造化データ**: JSON-LD を実装して SEO 最適化

## マーケティング機能

このプラットフォームは、プロジェクトの拡散を最大化するために以下のマーケティング機能を備えています：

### 1. SNS シェアの最適化（OGP/Twitter Card）
- **動的メタタグ生成**: 各プロジェクトページで自動的に OGP メタタグを生成
- **カスタム OG 画像**: サーバーサイドでプロジェクト情報を含む動的画像を生成
- **Twitter Card 対応**: Twitter での表示を最適化
- **複数 SNS 対応**: Twitter、LinkedIn、Facebook、LINE に対応

### 2. シェアボタン
- **ワンクリックシェア**: 複数 SNS プラットフォームへのワンクリックシェア
- **URL コピー機能**: プロジェクト URL を簡単にコピー可能
- **レスポンシブデザイン**: モバイルでの使いやすさを重視

### 3. 構造化データ（JSON-LD）
- **Schema.org 対応**: Article スキーマを実装
- **SEO 最適化**: 検索エンジンによる正確な情報抽出
- **リッチスニペット表示**: Google 検索での見栄え改善

### 4. プロジェクトカード改善
- **視覚的インパクト**: ホバー効果を強化（影、スケール等）
- **いいね数の強調**: 人気度を視覚的に強調
- **メタデータ表示**: 作成日時、更新日時、作成者情報を明確に表示

### 使用方法

各プロジェクト詳細ページでは、以下のシェア機能が利用可能です：

```
シェア: [ツイート] [LinkedIn] [Facebook] [LINE] [リンク]
```

環境変数を設定することで、OGP の base URL を指定できます：

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド/認証**: Supabase (PostgreSQL)
- **デプロイ**: Vercel (推奨)

## セットアップ

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com)でアカウントを作成
2. 新しいプロジェクトを作成
3. SQL Editorで \`supabase/schema.sql\` の内容を実行してデータベースを構築

### 3. 環境変数の設定

\`.env.local.example\` をコピーして \`.env.local\` を作成し、Supabaseの認証情報を設定:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

\`.env.local\` を編集:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

Supabaseプロジェクトの設定から以下の情報を取得:
- Project URL → \`NEXT_PUBLIC_SUPABASE_URL\`
- API Keys の anon/public → \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

### 4. ダミープロジェクトの追加（オプション）

開発環境でテストするために、10個のダミープロジェクトを追加できます:

```bash
npm run seed:dummy
```

詳細は [DUMMY_PROJECTS_GUIDE.md](./DUMMY_PROJECTS_GUIDE.md) を参照してください。

### 5. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

\`\`\`
ai-tsuku/
├── app/                      # Next.js App Router
│   ├── auth/                # 認証ページ
│   │   ├── login/          # ログインページ
│   │   └── signup/         # 新規登録ページ
│   ├── projects/           # プロジェクト関連
│   │   ├── [id]/          # プロジェクト詳細ページ
│   │   ├── new/           # プロジェクト公開ページ
│   │   └── page.tsx       # プロジェクト一覧ページ
│   ├── profile/           # プロフィールページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   ├── Navbar.tsx        # ナビゲーション
│   └── ProjectCard.tsx   # プロジェクトカード
├── lib/                  # ユーティリティ
│   └── supabase/        # Supabase設定
│       ├── client.ts    # クライアントサイド
│       └── server.ts    # サーバーサイド
├── types/               # TypeScript型定義
│   └── database.types.ts # データベース型
├── supabase/           # Supabaseスキーマ
│   └── schema.sql      # データベーススキーマ
└── middleware.ts       # Next.js ミドルウェア
\`\`\`

## データベーススキーマ

### profiles テーブル
ユーザープロフィール情報

- \`id\`: UUID (Primary Key, 外部キー: auth.users)
- \`email\`: TEXT (メールアドレス)
- \`full_name\`: TEXT (氏名)
- \`avatar_url\`: TEXT (アバター画像URL)
- \`bio\`: TEXT (自己紹介)
- \`website\`: TEXT (ウェブサイトURL)

### projects テーブル
公開されたプロジェクト情報

- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID (外部キー: profiles)
- \`title\`: TEXT (タイトル)
- \`description\`: TEXT (説明)
- \`url\`: TEXT (プロジェクトURL)
- \`image_url\`: TEXT (画像URL)
- \`category\`: TEXT (カテゴリ)
- \`tags\`: TEXT[] (タグ配列)
- \`likes_count\`: INTEGER (いいね数)

### likes テーブル
プロジェクトへのいいね

- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID (外部キー: profiles)
- \`project_id\`: UUID (外部キー: projects)

## デプロイ

### Vercelにデプロイ

1. [Vercel](https://vercel.com)にログイン
2. GitHubリポジトリをインポート
3. 環境変数を設定
4. デプロイ

### その他のプラットフォーム

Next.jsアプリケーションは以下のプラットフォームにもデプロイ可能:
- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。
