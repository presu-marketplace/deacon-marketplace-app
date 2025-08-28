import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { userId, role: rawRole = 'client', fullName } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const requestedRole =
      typeof rawRole === 'string' && rawRole.toLowerCase() === 'pro'
        ? 'provider'
        : (rawRole as 'client' | 'provider')

    const supabase = getSupabaseAdmin()
    const api = supabase.schema('api')

    // Read current role from api.profiles
    const { data: existingProfile, error: fetchError } = await api
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    // Decide final role:
    // - If no profile: use requestedRole
    // - If exists: keep current unless upgrading client→provider was requested
    let finalRole: 'client' | 'provider'
    if (!existingProfile) {
      finalRole = requestedRole ?? 'client'
      const { error: insertError } = await api
        .from('profiles')
        .insert({ id: userId, full_name: fullName ?? '', role: finalRole })
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
    } else {
      finalRole =
        existingProfile.role === 'client' && requestedRole === 'provider'
          ? 'provider'
          : (existingProfile.role as 'client' | 'provider')

      const updates: Record<string, any> = {}
      if (fullName) updates.full_name = fullName
      if (finalRole !== existingProfile.role) updates.role = finalRole

      if (Object.keys(updates).length) {
        const { error: updateError } = await api
          .from('profiles')
          .update(updates)
          .eq('id', userId)
        if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Ensure api.providers row for providers
    if (finalRole === 'provider') {
      const { error: providerError } = await api
        .from('providers')
        .upsert(
          { id: userId, company_name: null, tax_id: null, coverage_area: [] },
          { onConflict: 'id', ignoreDuplicates: true }
        )
      if (providerError) return NextResponse.json({ error: providerError.message }, { status: 500 })
    }

    // Storage bootstrap
    const bucket = 'users-data'

    // Ensure bucket exists
    const { data: bucketInfo, error: getBucketErr } = await supabase.storage.getBucket(bucket)
    if (getBucketErr) return NextResponse.json({ error: getBucketErr.message }, { status: 500 })
    if (!bucketInfo) {
      const { error: createBucketErr } = await supabase.storage.createBucket(bucket, { public: true })
      if (createBucketErr) return NextResponse.json({ error: createBucketErr.message }, { status: 500 })
    }

    // Ensure user folder + .keep
    const keepFilePath = `${userId}/.keep`
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(keepFilePath, Buffer.from('init'), { upsert: false, contentType: 'text/plain' })
    if (uploadError && !/exists/i.test(uploadError.message)) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Seed placeholder avatar if missing
    const placeholder = 'user-placeholder.png'
    const { data: files, error: listErr } = await supabase.storage.from(bucket).list(userId)
    if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 })
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
      if (placeholderError && !/exists/i.test(placeholderError.message)) {
        return NextResponse.json({ error: placeholderError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true, role: finalRole })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
