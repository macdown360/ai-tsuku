import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tool-park.example.com';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        image_url,
        categories,
        tags,
        ai_tools,
        profiles:user_id (
          full_name
        )
      `)
      .eq('id', id)
      .single();

    if (error || !project) {
      return {
        title: 'プロジェクト詳細',
        description: 'AIで作ってみた件 - プロジェクト詳細ページ',
        robots: { index: false },
      };
    }

    const projectUrl = `${baseUrl}/projects/${id}`;
    const title = `${(project as any).title} | AIで作ってみた件`;
    const description = (project as any).description.substring(0, 160);
    const image = (project as any).image_url || `${baseUrl}/og-image.png`;
    const authorName = ((project as any).profiles && Array.isArray((project as any).profiles) && (project as any).profiles[0]?.full_name) || 'AIで作ってみた件';
    
    // キーワード生成：カテゴリ、タグ、AIツールから自動生成
    const keywords = [
      ...((project as any).categories || []),
      ...((project as any).tags || []),
      ...((project as any).ai_tools || []),
      'AI活用',
      'ノーコード',
      '作品事例',
    ].filter(Boolean).slice(0, 10);

    return {
      title,
      description,
      keywords,
      authors: [{ name: authorName }],
      openGraph: {
        type: 'article',
        locale: 'ja_JP',
        url: projectUrl,
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: (project as any).title,
          },
        ],
        siteName: 'AIで作ってみた件',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: projectUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'プロジェクト詳細',
      description: 'AIで作ってみた件 - プロジェクト詳細ページ',
      robots: { index: false },
    };
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
