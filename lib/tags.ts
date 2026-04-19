export const MAX_TAG_SELECTION = 5

export const TAG_GROUPS = [
  {
    label: '対象ユーザー',
    icon: '👥',
    groups: [
      {
        label: '対象ユーザー',
        options: [
          '個人',
          '学生',
          'フリーランス',
          '中小企業',
          '大企業',
          'エンジニア',
          'クリエイター',
          '医療・福祉',
          '教育機関',
        ],
      },
    ],
  },
  {
    label: '料金・提供形態',
    icon: '💳',
    groups: [
      {
        label: '料金・提供形態',
        options: [
          '無料',
          'フリーミアム',
          '有料（サブスク）',
          '有料（買い切り）',
          'オープンソース',
          'API提供あり',
          'ノーコード',
        ],
      },
    ],
  },
  {
    label: '使用AI・技術',
    icon: '🤖',
    groups: [
      {
        label: '使用AI・技術',
        options: [
          'ChatGPT / GPT-4o',
          'Claude',
          'Gemini',
          'Llama（ローカルAI）',
          'Stable Diffusion',
          'Midjourney',
          'Dify',
          'n8n',
          'Make',
          'Zapier',
          'Notion',
          'Supabase',
          'Firebase',
          'Vercel',
          '独自モデル',
        ],
      },
    ],
  },
]