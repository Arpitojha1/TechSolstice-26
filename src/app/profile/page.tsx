import { Layout } from "@/components/layout";
import { Helmet } from "react-helmet-async";
import { User, Mail, Phone, Users, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - replace with real data from backend
const userData = {
  name: "some thing",
  email: "something@unkown.com",
  phone: "+91 1234567890",
  avatar:
    "https://static.scientificamerican.com/dam/m/6c6324834b10211b/original/facial_expression_eyebrow_raised.jpg?m=1737990739.405&w=600",
};

const teams = [
  { id: 1, name: "36 Hour Hackathon", category: "AI", role: "Leader" },
  { id: 2, name: "RoboRace", category: "Robotics", role: "Member" },
  { id: 3, name: "CTF", category: "Design", role: "Mentor" },
];

const registeredEvents = [
  {
    id: 1,
    name: "AI Hackathon",
    category: "AI",
    teamName: "36 Hour Hackathon",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "RoboWars Championship",
    category: "Robotics",
    teamName: "RoboRace",
    status: "Pending",
  },
  {
    id: 3,
    name: "Design Sprint",
    category: "Design",
    teamName: "CTF",
    status: "Confirmed",
  },
  {
    id: 4,
    name: "App-a-thon",
    category: "Coding",
    teamName: null,
    status: "Confirmed",
  },
];

const categoryColors: Record<
  string,
  { bg: string; text: string; glow: string }
> = {
  AI: {
    bg: "bg-pastel-cyan/10",
    text: "text-pastel-cyan",
    glow: "shadow-[0_0_20px_rgba(159,246,246,0.3)]",
  },
  Robotics: {
    bg: "bg-pastel-purple/10",
    text: "text-pastel-purple",
    glow: "shadow-[0_0_20px_rgba(200,168,255,0.3)]",
  },
  Design: {
    bg: "bg-pastel-pink/10",
    text: "text-pastel-pink",
    glow: "shadow-[0_0_20px_rgba(255,189,230,0.3)]",
  },
  Coding: {
    bg: "bg-pastel-mint/10",
    text: "text-pastel-mint",
    glow: "shadow-[0_0_20px_rgba(168,255,212,0.3)]",
  },
  Gaming: {
    bg: "bg-pastel-yellow/10",
    text: "text-pastel-yellow",
    glow: "shadow-[0_0_20px_rgba(255,241,168,0.3)]",
  },
};

const roleStyles: Record<string, string> = {
  Leader: "bg-pastel-cyan/20 text-pastel-cyan border-pastel-cyan/30",
  Member: "bg-pastel-blue/20 text-pastel-blue border-pastel-blue/30",
  Mentor: "bg-pastel-purple/20 text-pastel-purple border-pastel-purple/30",
};

const statusStyles: Record<string, string> = {
  Confirmed: "bg-pastel-mint/20 text-pastel-mint",
  Pending: "bg-pastel-yellow/20 text-pastel-yellow",
};

export const metadata = {
  title: "Profile | TechSolstice '26",
  description: "Your personal identity hub at TechSolstice '26",
};

const Profile = () => {
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-pastel-cyan/5 via-transparent to-pastel-purple/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pastel-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pastel-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
            <span className="text-pastel-cyan drop-shadow-[0_0_30px_rgba(159,246,246,0.5)]">
              YOUR PROFILE
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Identity Card */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 hover:border-pastel-cyan/30 transition-all duration-500">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pastel-cyan via-pastel-purple to-pastel-blue blur-md opacity-60 animate-pulse" />
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {userData.name}
                  </h2>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4 text-pastel-cyan" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Phone className="w-4 h-4 text-pastel-cyan" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pastel-cyan">
                      {teams.length}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Teams
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pastel-purple">
                      {registeredEvents.length}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Events
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Teams & Events */}
            <div className="lg:col-span-2 space-y-8">
              {/* Teams Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-pastel-purple" />
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    Teams Joined
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teams.map((team) => {
                    const colors =
                      categoryColors[team.category] || categoryColors.AI;

                    return (
                      <div
                        key={team.id}
                        className={cn(
                          "group p-5 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5",
                          "hover:border-white/20 hover:bg-white/10 transition-all duration-300",
                          "hover:translate-y-[-2px]",
                          colors.glow.replace("shadow-", "hover:shadow-")
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              {team.name}
                            </h4>
                            <span
                              className={cn(
                                "inline-block px-3 py-1 rounded-full text-xs font-medium",
                                colors.bg,
                                colors.text
                              )}
                            >
                              {team.category}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium border",
                              roleStyles[team.role]
                            )}
                          >
                            {team.role}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Events Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-pastel-cyan" />
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    Registered Events
                  </h3>
                </div>

                <div className="space-y-4">
                  {registeredEvents.map((event) => {
                    const colors =
                      categoryColors[event.category] || categoryColors.AI;

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "group p-5 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5",
                          "hover:border-white/20 hover:bg-white/10 transition-all duration-300",
                          "hover:translate-x-1 cursor-pointer"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                colors.bg
                              )}
                            >
                              <Calendar
                                className={cn("w-5 h-5", colors.text)}
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {event.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    colors.bg,
                                    colors.text
                                  )}
                                >
                                  {event.category}
                                </span>
                                {event.teamName && (
                                  <span className="text-xs text-muted-foreground">
                                    with {event.teamName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                statusStyles[event.status]
                              )}
                            >
                              {event.status}
                            </span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
