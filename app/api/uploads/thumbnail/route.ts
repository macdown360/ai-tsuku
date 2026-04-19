import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY と NEXT_PUBLIC_SUPABASE_URL の設定が必要です。')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const userId = formData.get('userId')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '画像ファイルが見つかりませんでした。' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '画像ファイルは10MB以下にしてください。' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '画像ファイルのみアップロードできます。' }, { status: 400 })
    }

    const ext = MIME_TO_EXT[file.type] || file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const owner = typeof userId === 'string' && userId.length > 0 ? userId : 'anon'
    const fileName = `${owner}-${Date.now()}-${randomUUID()}.${ext}`
    const filePath = `projects/${fileName}`

    const supabase = getSupabaseAdminClient()
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : '画像アップロードに失敗しました。'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}