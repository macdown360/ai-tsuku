import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { project_id, action } = await request.json()

    if (!project_id || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc(
      action === 'like' ? 'increment_likes' : 'decrement_likes',
      { p_project_id: project_id }
    )

    if (error) {
      console.error('Like RPC error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ likes_count: data })
  } catch (err) {
    console.error('Like route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
