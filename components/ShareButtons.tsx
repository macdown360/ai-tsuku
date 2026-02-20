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
    const text = encodeURIComponent(`${title}\n\n${description.substring(0, 100)}...`)
    const xUrl = `https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
    window.open(xUrl, '_blank', 'width=550,height=420')
  }

  const shareOnInstagram = () => {
    // Instagramはウェブシェア機能が限定的なため、URLをコピーして通知
    handleCopyLink()
    alert('URLをコピーしました。Instagramで貼り付けてシェアしてください（DM、ストーリーズ、キャプション等）')
  }

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank', 'width=550,height=420')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  const shareViaLine = () => {
    const text = encodeURIComponent(`${title}\n${description.substring(0, 100)}...`)
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
    window.open(lineUrl, '_blank', 'width=550,height=420')
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

      {/* Instagram */}
      <button
        onClick={shareOnInstagram}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white hover:from-[#e08030] hover:via-[#d85f39] hover:to-[#ca1f40] transition-colors text-sm font-medium"
        title="Instagramでシェア"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 1.5c-4.687 0-8.5 3.813-8.5 8.5S7.313 20.5 12 20.5s8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zm0 2c3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5zm3.5-2c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 1.5c2.485 0 4.5 2.015 4.5 4.5S14.485 16.5 12 16.5 7.5 14.485 7.5 12 9.515 7.5 12 7.5z" />
        </svg>
        Instagram
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareOnLinkedIn}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#094399] transition-colors text-sm font-medium"
        title="LinkedInでシェア"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.81 0-9.728h3.554v1.375c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.685 1.375 3.685 4.331l.001 5.608zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.71 0-.956.77-1.71 1.944-1.71 1.174 0 1.915.754 1.94 1.71 0 .952-.766 1.71-1.969 1.71zm1.582 11.597H3.714v-9.728h3.205v9.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
        LinkedIn
      </button>

      {/* Facebook */}
      <button
        onClick={shareOnFacebook}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#0a66c2] transition-colors text-sm font-medium"
        title="Facebookでシェア"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </button>

      {/* LINE */}
      <button
        onClick={shareViaLine}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00B900] text-white hover:bg-[#009500] transition-colors text-sm font-medium"
        title="LINEでシェア"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.281.63.63 0 .344-.281.63-.63.63H4.634c-.349 0-.63-.286-.63-.63 0-.349.281-.63.63-.63zm0 5.138H4.634c-.349 0-.63.281-.63.63 0 .349.281.63.63.63h14.731c.349 0 .63-.281.63-.63 0-.349-.281-.63-.63-.63zM12 0C5.383 0 0 4.925 0 11.5c0 3.6 1.813 6.831 4.742 8.653V24l4.919-2.765C11.75 21.817 11.888 21.82 12 21.82c6.617 0 12-4.925 12-11.32C24 4.925 18.617 0 12 0z" />
        </svg>
        LINE
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
        {copied ? 'コピーしました' : 'リンク'}
      </button>
    </div>
  )
}
