import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const alt = 'Project'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

interface Params {
  id: string
}

interface Project {
  title: string
  description: string
  poster_name: string | null
}

export default async function Image({ params }: { params: Promise<Params> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: project } = await supabase
      .from('projects')
      .select('title, description, poster_name')
      .eq('id', id)
      .single()

    if (!project) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 60,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            AIで作ってみた件
          </div>
        ),
        { ...size }
      )
    }

    const title = (project as Project).title
    const author = (project as Project).poster_name || 'AIで作ってみた件'
    const description = (project as Project).description.substring(0, 120)

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '40px',
            fontFamily: 'system-ui',
            overflow: 'hidden',
          }}
        >
          {/* ロゴ */}
          <div
            style={{
              fontSize: 40,
              marginBottom: '20px',
              fontWeight: 'bold',
            }}
          >
            🚀 AIで作ってみた件
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: '1.3',
              maxWidth: '90%',
            }}
          >
            {title}
          </div>

          {/* 説明 */}
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '30px',
              maxWidth: '80%',
              lineHeight: '1.4',
            }}
          >
            {description}...
          </div>

          {/* 作成者 */}
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: 'auto',
            }}
          >
            {author}
          </div>
        </div>
      ),
      { ...size }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          AIで作ってみた件
        </div>
      ),
      { ...size }
    )
  }
}
