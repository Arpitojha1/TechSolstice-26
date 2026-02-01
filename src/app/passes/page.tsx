import { requireAuth, getUserProfile, isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Supabase client for database operations only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PassesPage = async () => {
  // Auth & Profile Check
  const session = await requireAuth()
  const userId = session.user.id

  // Get Profile & Admin Status
  const profile = await getUserProfile(userId)
  const adminStatus = await isAdmin(userId)

  // --- COMING SOON UI ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">

      {/* Background Tech Grid (Subtle) */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #7D0D2C 0%, transparent 70%)'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">

        {/* Animated Tech Text */}
        <h1 className="tech-text mb-6">
          PASSES<br />REVEALING SOON
        </h1>

        {/* Decorative Line */}
        <div className="w-32 h-[2px] bg-red-900/50 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500 animate-slide"></div>
        </div>

        <p className="text-neutral-500 font-mono text-sm tracking-[0.3em] uppercase">
          Stay Tuned • TechSolstice'26
        </p>

      </div>

      <style>{`
        /* The Homepage Font & Claret Red Animation */
        .tech-text {
          font-family: 'Michroma', sans-serif;
          font-size: clamp(2rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -2px;
          text-transform: uppercase;
          
          background: linear-gradient(
            135deg, 
            #4a0417 0%,   /* Dark Claret */
            #7D0D2C 30%,  /* Base Claret */
            #ff1a1a 50%,  /* Bright Red Highlight */
            #7D0D2C 70%,  /* Base Claret */
            #4a0417 100%  /* Dark Claret */
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-slide {
          animation: slide 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );

  /*
  // --- OLD RENDER LOGIC PRESERVED BELOW ---
  if(!isvisible){
    return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
      // ... (Old Coming Soon Code)
    </div>
    );
  }
  else{
    return (
      <div className="min-h-screen bg-transparent text-white pb-20">
        // ... (Old Passes Dashboard Code)
      </div>
    )
  }
  */
}

import { memo } from 'react';
export default memo(PassesPage);