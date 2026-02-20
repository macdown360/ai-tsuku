'use client'

interface ProjectStructuredDataProps {
  project: {
    id: string
    title: string
    description: string
    image_url: string | null
    url: string
    created_at: string
    likes_count: number
    profiles?: {
      full_name: string | null
    }
  }
  pageUrl: string
}

export default function ProjectStructuredData({ project, pageUrl }: ProjectStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tool-park.example.com'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.description,
    image: project.image_url || `${baseUrl}/og-image.png`,
    url: pageUrl,
    datePublished: project.created_at,
    dateModified: project.created_at,
    author: {
      '@type': 'Person',
      name: (project.profiles as any)?.full_name || 'AIで作ってみた件',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIで作ってみた件',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
