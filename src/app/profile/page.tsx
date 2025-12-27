import Image from "next/image";
import { Mail, Phone, Users, BadgeCheck } from "lucide-react";
import clsx from "clsx";

/* ---------------- MOCK PROFILE DATA ---------------- */

const profile = {
  name: "Something ",
  email: "Something@unkown.com",
  phone: "+91 9XXXXXXXXX",
  avatar: "/pfp.jpg",
};

const teams = [
  {
    id: 1,
    name: "Nebula Coders",
    category: "AI",
    role: "Leader",
    accent: "cyan",
  },
  {
    id: 2,
    name: "Orbital Designers",
    category: "Design",
    role: "Member",
    accent: "purple",
  },
];

const passes = [
  {
    id: 1,
    name: "Explorer",
    tier: "Basic",
    status: "Active",
    accent: "cyan",
  },
  {
    id: 2,
    name: "Pioneer",
    tier: "Premium",
    status: "Upcoming",
    accent: "purple",
  },
];

/* ---------------- STYLE MAPS ---------------- */

const accentStyles: Record<string, string> = {
  cyan: "border-cyan-300/30 text-cyan-200 shadow-[0_0_25px_rgba(159,246,246,0.25)]",
  purple:
    "border-purple-300/30 text-purple-200 shadow-[0_0_25px_rgba(200,168,255,0.3)]",
  blue: "border-blue-300/30 text-blue-200 shadow-[0_0_25px_rgba(167,199,255,0.3)]",
};

const passStatusStyles: Record<string, string> = {
  Active: "text-emerald-300",
  Upcoming: "text-yellow-300",
  Used: "text-zinc-400",
};

/* ---------------- PAGE ---------------- */

export default function ProfilePage() {
  return (
    <main className="min-h-screen px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ================= LEFT COLUMN ================= */}
        <section>
          {/* Identity Card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border border-cyan-300/40 shadow-[0_0_30px_rgba(159,246,246,0.35)]">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {profile.name}
                </h1>
                <div className="mt-3 space-y-1 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT COLUMN ================= */}
        <section className="space-y-14">
          {/* Teams Section */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Users className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold tracking-tight">
                Teams Joined
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={clsx(
                    "rounded-2xl border bg-white/5 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1",
                    accentStyles[team.accent]
                  )}
                >
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <div className="mt-2 text-sm text-zinc-300">
                    {team.category}
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-wide opacity-80">
                    Role: {team.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passes Section */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-purple-300" />
              <h2 className="text-xl font-semibold tracking-tight">
                Your Passes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {passes.map((pass) => (
                <div
                  key={pass.id}
                  className={clsx(
                    "rounded-2xl border bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:-translate-y-1",
                    accentStyles[pass.accent]
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{pass.name}</h3>
                    <span
                      className={clsx(
                        "text-xs uppercase tracking-wider",
                        passStatusStyles[pass.status]
                      )}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-300">
                    Tier:{" "}
                    <span className="text-white font-medium">{pass.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
