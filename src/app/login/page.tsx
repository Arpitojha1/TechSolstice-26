/*
 * ============================================
 * TEMPORARILY DISABLED PAGE
 * This page is disabled for the current website display phase.
 * Access is blocked via middleware redirect to home page.
 * Remove the redirect in middleware.ts to re-enable.
 * ============================================
 */

'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/profile',
        redirect: true,
      })
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden text-center space-y-10">
          
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-white michroma-regular tracking-tight leading-tight uppercase">
              Access
            </h1>
            <p className="text-neutral-500 text-[10px] font-black tracking-[0.3em] uppercase">Join the Solstice Experience</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-4 rounded-2xl bg-white/[0.95] hover:bg-white px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-neutral-900 transition-all duration-500 shadow-2xl shadow-blue-500/10 active:scale-[0.97] disabled:opacity-50 outline-none"
            >
              {!loading && (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              {loading ? (
                <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Continue with Google'
              )}
            </button>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.05]"></div>
                <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-black">Secure Authentication</span>
                <div className="h-px flex-1 bg-white/[0.05]"></div>
              </div>
              <p className="text-[10px] text-neutral-500 font-medium leading-relaxed px-4 opacity-60">
                By continuing, you agree to our terms of service and academic integrity policies.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-[10px] text-neutral-600 uppercase tracking-[0.5em] font-black opacity-40 italic">Technical Solstice '26</p>
        </div>
      </motion.div>
    </div>
  )
}
