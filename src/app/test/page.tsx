'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

type Profile = {
  id: string
  email: string
  full_name?: string
  updated_at?: string
}

export default function TestPage() {
  const [data, setData] = useState<Profile[] | null>(null)
  const [error, setError] = useState<{ message: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('profiles').select('*')
      setData(data)
      setError(error)
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔍 Supabase Test</h1>
      {error && <p className="text-red-500">❌ Error: {error.message}</p>}
      {data ? (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading data from Supabase...</p>
      )}
    </div>
  )
}
