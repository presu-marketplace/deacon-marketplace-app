import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const bucket = 'user-uploads'

    // Ensure bucket exists
    const { data: bucketInfo } = await supabase.storage.getBucket(bucket)
    if (!bucketInfo) {
      await supabase.storage.createBucket(bucket, { public: true })
    }

    const filePath = `${userId}/.keep`
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, Buffer.from('init'), { upsert: false, contentType: 'text/plain' })

    if (uploadError && !uploadError.message.includes('exists')) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
