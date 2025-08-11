import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    // All user uploads live in the public "users-data" bucket so
    // ensure that bucket and a folder for this user exist.
    const bucket = 'users-data'

    // Ensure bucket exists
    const { data: bucketInfo } = await supabase.storage.getBucket(bucket)
    if (!bucketInfo) {
      await supabase.storage.createBucket(bucket, { public: true })
    }

    const keepFilePath = `${userId}/.keep`
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(keepFilePath, Buffer.from('init'), {
        upsert: false,
        contentType: 'text/plain',
      })

    if (uploadError && !uploadError.message.includes('exists')) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const placeholder = 'user-placeholder.png'
    const { data: files } = await supabase.storage.from(bucket).list(userId)
    const hasPlaceholder = files?.some((f) => f.name === placeholder)

    if (!hasPlaceholder) {
      const fileBuffer = await readFile(
        path.join(process.cwd(), 'public', 'images', 'user', placeholder)
      )
      const { error: placeholderError } = await supabase.storage
        .from(bucket)
        .upload(`${userId}/${placeholder}`, fileBuffer, {
          upsert: false,
          contentType: 'image/png',
        })
      if (placeholderError && !placeholderError.message.includes('exists')) {
        return NextResponse.json({ error: placeholderError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
