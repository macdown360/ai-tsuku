# Supabase スキーマ更新ガイド

## 問題
`Could not find the 'ai_tools' column of 'projects' in the schema cache` というエラーが表示されている場合、Supabaseのデータベーススキーマが最新の状態になっていません。

## 解決方法

### 方法1: Supabaseダッシュボード（推奨）

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. プロジェクトを選択
3. 左サイドバーの **SQL Editor** をクリック
4. **New query** をクリック
5. 以下のSQLを実行：

```sql
-- Add ai_tools column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS ai_tools TEXT[] DEFAULT '{}';

-- Add backend_services column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS backend_services TEXT[] DEFAULT '{}';

-- Add frontend_tools column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS frontend_tools TEXT[] DEFAULT '{}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_ai_tools ON projects USING GIN (ai_tools);
CREATE INDEX IF NOT EXISTS idx_projects_backend_services ON projects USING GIN (backend_services);
CREATE INDEX IF NOT EXISTS idx_projects_frontend_tools ON projects USING GIN (frontend_tools);
```

6. **Run** をクリック
7. 完了後、ページをリロードしてキャッシュをクリア

### 方法2: ローカル開発環境（supabase CLI）

1. Supabase CLIがインストールされていることを確認：
```bash
supabase --version
```

2. プロジェクトディレクトリ（`supabase/migrations/` フォルダが存在する場所）で以下を実行：
```bash
supabase db push
```

### 方法3: 本番環境との同期

既存のプロジェクトをリセットする場合：

1. Supabaseダッシュボードで **Project Settings** > **Dangerzone** に移動
2. **Reset database** をクリック
3. 確認画面で確認
4. 新しいスキーマが適用されます

## トラブルシューティング

### キャッシュクリア
- ブラウザのキャッシュをクリア（Ctrl+Shift+Delete または Cmd+Shift+Delete）
- LocalStorageをクリア：ブラウザの開発ツール > Application > Clear Site Data

### 接続情報の確認
1. Supabaseダッシュボードの **Project Settings** で以下を確認：
   - Project URL
   - API Key (anon/public, service_role)

2. `.env.local` ファイルで設定を確認：
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 確認方法

SQLエディターで以下を実行して、カラムが正しく追加されていることを確認：

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
```

以下のカラムが表示されることを確認：
- `ai_tools` (text[])
- `backend_services` (text[])
- `frontend_tools` (text[])
