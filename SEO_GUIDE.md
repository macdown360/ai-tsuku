# SEO 最適化ガイド

このドキュメントでは、AIで作ってみた件 のSEO最適化について説明します。

## 📊 実装されている SEO 対策

### 1. タイトル・メタディスクリプション最適化

#### ルートレイアウト（全ページ）
- **タイトル**: `AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム`
- **ディスクリプション**: キーワード（AI、ノーコード、ChatGPT等）を含む160文字以内
- **メタキーワード**: AI、ノーコード、ChatGPT、Notion、Zapierなど

#### プロジェクト詳細ページ
- **動的タイトル**: `{プロジェクト名} | AIで作ってみた件`
- **動的ディスクリプション**: 説明文の最初の160文字
- **動的キーワード**: プロジェクトのカテゴリ・タグ・使用ツールから自動生成

#### プロジェクト一覧ページ
- **タイトル**: `プロジェクト一覧 | AIで作ってみた件`
- **ディスクリプション**: 検索キーワード向けの最適化文

### 2. 構造化データ（Schema.org）

#### Article スキーマ（プロジェクト詳細ページ）
- 記事タイプとしての構造化
- 著者情報、公開日時を含める
- Google リッチスニペット対応

#### BreadcrumbList スキーマ（プロジェクト詳細ページ）
- パンくずリスト表示
- サイト階層構造を検索エンジンに明確に伝える
```
ホーム > プロジェクト一覧 > プロジェクト タイトル
```

### 3. Sitemap.xml（自動生成）

**ファイル**: `app/sitemap.ts`

#### サイトマップの内容
- **静的ページ**: ホーム、プロジェクト一覧、ログイン、サインアップ等
- **動的ページ**: 全プロジェクト詳細ページ
- **優先度設定**:
  - ホーム: 優先度 1.0
  - プロジェクト一覧: 優先度 0.9
  - 個別プロジェクト: 優先度 0.8
  - その他: 優先度 0.3～0.7

#### 更新頻度
- ホーム・プロジェクト一覧: 毎日
- 個別プロジェクト: 週1回
- プライバシー・利用規約: 年1回

#### アクセス方法
```
https://your-domain.com/sitemap.xml
```

### 4. robots.txt（クローリング制御）

**ファイル**: `public/robots.txt`

#### 制御内容
- ✅ 公開ページはすべてインデックス許可
- ❌ API など内部ページはクローリング禁止
- ❌ 認証ページはクローリング禁止
- 低速クローラー（Ahrefsボット等）は制限

#### 環境別設定
開発環境と本番環境で Sitemap URL を切り替える場合：

```bash
# .env.local（開発環境）
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 本番環境
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 5. Canonical URL（重複ページ対策）

全ページに Canonical URL を設定：

```typescript
alternates: {
  canonical: `${baseUrl}/projects/${id}`,
}
```

これにより、URL パラメータを含むバリエーション URL の重複を防ぎます。

### 6. Open Graph / Twitter Card

#### OG メタタグ
- 各ページに適切な OG メタタグを設定
- OGP 画像は自動生成（プロジェクト詳細ページ）
- SNS シェア時の表示を最適化

#### Twitter Card
- Summary Large Image カード対応
- ツイート時の見た目を最適化

### 7. Image Alt テキスト

すべての画像に意味のある alt テキストを設定：

```tsx
<Image
  src={project.image_url}
  alt={project.title}  // キーワード含む
/>
```

## 🔧 環境変数設定

`.env.local` に以下を設定：

```bash
# 本番環境
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# ローカル開発
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📈 Google Search Console への登録

### 1. サイトマップ登録

1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. プロパティを選択
3. 左メニュー「**サイトマップ**」をクリック
4. 新しいサイトマップを追加：
   ```
   https://your-domain.com/sitemap.xml
   ```

### 2. robots.txt 検証

1. Search Console にて「**カバレッジ**」確認
2. クロール対象のページが正しくリストされているか確認

### 3. パフォーマンスレポート

定期的に以下をチェック：
- **クリック数**: ユーザーが検索結果からアクセス
- **表示件数**: 検索結果に表示された回数
- **平均掲載順位**: キーワードごとの検索順位

## ⚡ Core Web Vitals 最適化

Next.js の推奨事項に従う：

- **LCP（Largest Contentful Paint）**: < 2.5秒
- **FID（First Input Delay）**: < 100ms  
- **CLS（Cumulative Layout Shift）**: < 0.1

### 改善方法

```tsx
// 画像の最適化
<Image
  src={url}
  alt={title}
  priority={false}  // 上部画像のみ priority でロード
  sizes="(max-width: 640px) 100vw, ..."
/>

// 動的インポート
const Component = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
})
```

## 🎯 キーワード戦略

### ターゲットキーワード

**メインキーワード**:
- AI活用
- ノーコード
- ChatGPT活用
- 作品事例

**関連キーワード**:
- Notion活用
- Zapier活用
- ローコード開発
- 自動化ツール

### キーワード配置

| 場所 | キーワード |
|------|-----------|
| ページタイトル | メインキーワード+修飾語 |
| メタディスクリプション | メインキーワード1～2個 |
| H1 見出し | ページトピック |
| 本文冒頭 | メインキーワード |
| Image alt | 説明的なキーワード |

## 📱 モバイル SEO

### 実装済み
- ✅ レスポンシブデザイン
- ✅ モバイルファースト設計
- ✅ タッチターゲット（最少44x44px）
- ✅ テキストサイズ（最少16px）

### 確認方法

[Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) で確認：

```
https://your-domain.com
```

## 🔍 検索エンジン登録

### Google
1. [Google Search Console](https://search.google.com/search-console) でプロパティ追加
2. サイトマップを登録
3. 手動サイト検査

### Bing
1. [Bing Webmaster Tools](https://www.bing.com/webmasters/) でサイト追加
2. robots.txt 確認
3. サイトマップ登録

## 💡 定期的な SEO 監視

### 月次チェックリスト

- [ ] Search Console でインプレッション・クリック数確認
- [ ] 掲載順位トップ キーワードの確認
- [ ] 新しいプロジェクト数の追跡
- [ ] ページスピード計測（PageSpeed Insights）

### ツール

- **Lighthouse**: Chrome DevTools 内蔵
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **SEOチェックツール**: https://seocheki.net/
- **キーワード順位計測**: GRC、SEMrush等


## 🚀 最適化の効果目標

| 指標 | 目標値 |
|------|--------|
| 平均掲載順位 | 10位以内（主要キーワード） |
| CTR（クリック率） | 3～5% |
| page/session（ページビュー） | 2以上 |
| Core Web Vitals | すべてGood（緑） |
| モバイル対応 | 100% |

---

**最終更新**: 2026年2月20日
