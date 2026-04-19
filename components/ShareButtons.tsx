'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  description: string
  url: string
  imageUrl?: string
}

export default function ShareButtons({ title, description, url, imageUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy URL')
    }
  }

  const shareOnX = () => {
    const text = encodeURIComponent(`${title}\n\n${description.substring(0, 100)}...\n\n#AIツク #AIで作ってみた件`)
    const xUrl = `https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
    window.open(xUrl, '_blank', 'width=550,height=420')
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-semibold text-slate-700">シェア:</span>

      {/* X */}
      <button
        onClick={shareOnX}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-slate-900 transition-colors text-sm font-medium"
        title="Xでシェア"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
        title="URLをコピー"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? 'コピーしました' : 'リンクをコピー'}
      </button>
    </div>
  )
}
