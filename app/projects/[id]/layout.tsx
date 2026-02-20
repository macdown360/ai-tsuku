import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  profiles?: {
    full_name: string | null;
  };
}

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
      };
    }

    const projectUrl = `${baseUrl}/projects/${id}`;
    const title = `${project.title} | AIで作ってみた件`;
    const description = project.description.substring(0, 160);
    const image = project.image_url || `${baseUrl}/og-image.png`;
    const authorName = (project.profiles as any)?.[0]?.full_name || 'AIで作ってみた件';

    return {
      title,
      description,
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
            alt: project.title,
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
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'プロジェクト詳細',
      description: 'AIで作ってみた件 - プロジェクト詳細ページ',
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
