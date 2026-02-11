# Appli Farm - セットアップガイド

## 🚀 クイックスタート

このプロジェクトを始めるには、以下の手順に従ってください。

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスし、無料アカウントを作成
2. 「New Project」をクリックして新しいプロジェクトを作成
3. プロジェクト名、データベースパスワードを設定
4. リージョンを選択（日本なら Tokyo がおすすめ）
5. プロジェクトが作成されるまで数分待つ

### 2. データベーススキーマの構築

**⚠️ 重要: ファイルパスではなく、ファイルの中身をコピーしてください！**

1. Supabaseダッシュボードの左サイドバーから「**SQL Editor**」を選択
2. 「**New query**」をクリック
3. VS Codeで `supabase/schema.sql` ファイルを開く
4. ファイルの**中身を全てコピー**（Ctrl+A → Ctrl+C）
5. SupabaseのSQL Editorに**貼り付け**（Ctrl+V）
6. 「**Run**」ボタン（緑色の再生ボタン）をクリックして実行
7. ✅ 「Success. No rows returned」メッセージが表示されればOK！

> ❌ `'/workspaces/tool-park/supabase/schema.sql'` とファイルパスを入力しないでください  
> ✅ ファイルの中身（SQLコード）をコピー&ペーストしてください

### 3. Supabase Storage のセットアップ

画像アップロード機能を使用するために、Storageバケットを正しく設定する必要があります。

#### ステップ 1: バケットの作成

1. Supabaseダッシュボードの左サイドバーから「**Storage**」を選択
2. 「**Create a new bucket**」ボタンをクリック
3. バケット名に `project-images` と入力
4. 「**Public bucket**」にチェックを入れる
5. 「**Create bucket**」をクリック

#### ステップ 2: RLS ポリシーの設定（重要！）

1. 作成した `project-images` バケットをクリックして選択
2. 上部の「**Policies**」タブをクリック
3. 「**New policy**」をクリック
4. 「**For authenticated users**」を選択

**以下の2つのポリシーを作成します：**

**ポリシー 1: ユーザー自身のファイルをアップロード可能にする**
- Template: `CREATE` を選択
- Target role: `authenticated`
- Definition に以下を入力:
  ```
  (uid::text = auth.uid()::text) OR (auth.uid() IS NOT NULL)
  ```
- Click `Review` then `Save policy`

**ポリシー 2: 全員がファイルを読み取り可能にする**
- Template: `SELECT` を選択
- Target role: `anon`
- Definition に以下を入力:
  ```
  true
  ```
- Click `Review` then `Save policy`

✅ これでプロジェクト画像のアップロード機能が使用できます

**トラブルシューティング:**
- アップロード時に「未認可」エラーが出る → ポリシー 1 を確認してください
- 画像が表示されない → ポリシー 2 を確認してください

### 4. 環境変数の設定

1. Supabaseダッシュボードの「Settings」→「API」を開く
2. 以下の情報をコピー:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. `.env.local` ファイルを編集:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 📋 チェックリスト

- [ ] Supabaseプロジェクトを作成
- [ ] データベーススキーマを実行
- [ ] Supabase Storageバケット（project-images）を作成
- [ ] `.env.local` に認証情報を設定
- [ ] `npm install` を実行（初回のみ）
- [ ] `npm run dev` で開発サーバーを起動
- [ ] ブラウザで動作確認

## 🔧 トラブルシューティング

### エラー: "Invalid API key"
- `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認
- Supabaseダッシュボードから最新のキーをコピーし直す

### エラー: "relation does not exist"
- `supabase/schema.sql` が正しく実行されているか確認
- Supabaseの「Table Editor」でテーブルが作成されているか確認

### エラー: 画像がアップロードできない・「未認可」エラーが出る
- Supabase Storage の `project-images` バケットが存在するか確認
- バケットの **RLS Policies** が正しく設定されているか確認
  - `SELECT` ポリシーが存在し、条件が `true` になっているか
  - `CREATE` ポリシーが存在し、認証ユーザーが作成可能か
- ブラウザのコンソールで詳しいエラーメッセージを確認（F12キー）

### エラー: ページが表示されない
- `npm run dev` が正常に起動しているか確認
- ターミナルでエラーメッセージを確認
- ブラウザのコンソールでエラーを確認

## 📚 次のステップ

1. 新規登録でアカウントを作成
2. プロジェクトを投稿してみる
3. 他のユーザーのプロジェクトにいいねする
4. プロフィールをカスタマイズする

## 🎨 カスタマイズ

- カラーテーマを変更: `tailwind.config.ts` を編集
- ナビゲーションを変更: `components/Navbar.tsx` を編集
- ロゴを変更: 絵文字を別のものに置き換え

## 📞 サポート

問題が解決しない場合は、GitHubのIssuesでお知らせください。
