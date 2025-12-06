'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CompleteProfile() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('User not found. Please log in again.')
        setLoading(false)
        return
      }

      // Upsert the profile in DB (insert if not exists, update if exists)
      // Get the auth provider from user metadata
      const authProvider = user.app_metadata?.provider === 'azure' ? 'microsoft' : (user.app_metadata?.provider || 'google')
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: name.trim(),
          email: user.email,
          auth_provider: authProvider
        }, { 
          onConflict: 'id' 
        })

      if (error) {
        console.error('Profile save error:', error)
        alert('Error saving name: ' + error.message)
        setLoading(false)
      } else {
        router.refresh() 
        router.push('/passes') 
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-bold text-blue-500">Almost there!</h1>
        <p className="mb-8 text-gray-400">
          Since you logged in with Google, we just need your full name for the pass.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Full Name (as per ID)
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Aditi Sharma"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  )
}