import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const events = [
    { name: 'Hackathon', icon: '💻', desc: '24-hour coding marathon' },
    { name: 'Robotics', icon: '🤖', desc: 'Build and compete' },
    { name: 'Gaming', icon: '🎮', desc: 'Esports tournaments' },
    { name: 'Music Night', icon: '🎵', desc: 'Live performances' },
    { name: 'Tech Talks', icon: '🎤', desc: 'Industry experts' },
    { name: 'Workshops', icon: '🛠️', desc: 'Hands-on learning' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold">
            TechSolstice<span className="text-blue-500">&apos;26</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="#events" className="hidden text-sm text-gray-400 hover:text-white sm:block">
              Events
            </Link>
            <Link href="#about" className="hidden text-sm text-gray-400 hover:text-white sm:block">
              About
            </Link>
            {user ? (
              <Link
                href="/passes"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-700"
              >
                My Passes
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        {/* Animated Background Gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        {/* Hero Badge */}
        <div className="relative mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
          March 2026 • Manipal University
        </div>

        {/* Main Title */}
        <h1 className="relative text-6xl font-extrabold tracking-tight sm:text-8xl">
          Tech<span className="text-blue-500">Solstice</span>
          <span className="text-blue-600">&apos;26</span>
        </h1>
        <p className="relative mt-6 max-w-xl text-xl text-gray-400">
          The largest techno-cultural fest of Manipal is back. 
          Three days of innovation, creativity, and unforgettable experiences.
        </p>

        {/* Stats */}
        <div className="relative mt-10 flex gap-8 text-center sm:gap-16">
          <div>
            <div className="text-3xl font-bold text-blue-500">50+</div>
            <div className="text-sm text-gray-500">Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-500">10K+</div>
            <div className="text-sm text-gray-500">Participants</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-500">₹5L+</div>
            <div className="text-sm text-gray-500">Prize Pool</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="relative mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 text-lg font-bold transition hover:bg-blue-700 active:scale-95"
          >
            {user ? 'Go to Passes' : 'Get Your Pass →'}
          </Link>
          <Link
            href="#events"
            className="flex w-full items-center justify-center rounded-xl border border-gray-700 bg-gray-900/50 py-4 text-lg font-bold text-gray-300 transition hover:bg-gray-800 active:scale-95"
          >
            Explore Events
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">Featured Events</h2>
          <p className="mt-4 text-gray-400">Something for everyone</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.name}
              className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-blue-500/50 hover:bg-gray-900"
            >
              <div className="mb-4 text-4xl">{event.icon}</div>
              <h3 className="text-xl font-bold">{event.name}</h3>
              <p className="mt-2 text-gray-400">{event.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">And 40+ more events across Tech, Cultural, and Gaming categories</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold">About TechSolstice</h2>
              <p className="mt-6 text-lg text-gray-400">
                TechSolstice is the annual techno-cultural festival of Manipal University, 
                bringing together thousands of students from across the country.
              </p>
              <p className="mt-4 text-lg text-gray-400">
                From intense hackathons to electrifying music nights, from robotics battles 
                to creative workshops — there&apos;s something for every passion.
              </p>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-bold transition hover:bg-blue-700"
                >
                  Register Now →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6">
                <div className="text-3xl font-bold">3</div>
                <div className="text-blue-200">Days</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-purple-200">Events</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-800 p-6">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-green-200">Colleges</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-800 p-6">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-orange-200">Footfall</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-xl font-bold">
              TechSolstice<span className="text-blue-500">&apos;26</span>
            </span>
            <p className="text-sm text-gray-500">
              © 2026 TechSolstice. Manipal University.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}