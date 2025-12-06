import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // Redundant check for safety
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!admin) redirect('/passes')

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold text-purple-500 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-900 p-6 border border-gray-800">
           <h3 className="text-gray-400 text-sm">Total Sales</h3>
           <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
        <div className="rounded-xl bg-gray-900 p-6 border border-gray-800">
           <h3 className="text-gray-400 text-sm">Users Registered</h3>
           <p className="text-3xl font-bold mt-2">1</p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/passes" className="text-blue-400 underline">
          ← Back to User View
        </Link>
      </div>
    </div>
  )
}