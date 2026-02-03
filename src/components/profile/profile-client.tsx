/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronRight, LogOut, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileIdCard from "./profile-id-card";
import ProfileTeamModal from "./profile-team-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/auth-context";

// Types matching the join query structure from Supabase
type JoinedEvent = {
  reg_id: string;
  is_captain: boolean;
  event: {
    id: string;
    name: string;
    category: string;
    is_reg_open: boolean;
    min_team_size: number;
    max_team_size: number;
  };
  team: {
    id: string;
    name: string;
  };
};

type ProfileData = {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  solstice_id: string;
  avatar_url?: string;
  college_name: string | null;
  registration_number: string | null;
};

type Pass = {
  id: string;
  user_id: string;
  pass_id: string;
  ticket_cut?: boolean;
  phone_no?: number | string | null;
  reg_no?: number | string | null;
  pass: {
    name: string;
    price: number;
  };
  [key: string]: any;
};

interface ProfileClientProps {
  userData: ProfileData;
  joinedEvents: JoinedEvent[];
  passes: Pass[];
}

// Visual Themes for Categories - Updated for Solstice Brand (Red/Black)
const categoryColors: Record<string, string> = {
  AI: "bg-red-500/10 text-red-500 border-red-500/20",
  Robotics: "bg-red-500/10 text-red-500 border-red-500/20",
  Coding: "bg-neutral-500/10 text-white border-white/20",
  Gaming: "bg-red-900/10 text-red-400 border-red-500/20",
  Design: "bg-neutral-800/50 text-neutral-200 border-white/10",
  Default: "bg-red-500/5 text-red-500/80 border-red-500/10"
};

export default function ProfileClient({ userData, joinedEvents, passes }: ProfileClientProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { signOut } = useAuth();
  const router = useRouter();

  // Helper to find the currently selected event data
  const selectedEventData = joinedEvents.find(e => e.event.id === selectedEventId);

  // Sign out handler - uses Supabase Auth
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };


  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6 sm:pt-12 pb-24">

      {/* --- LEFT COLUMN: ID CARD --- */}
      <div className="lg:col-span-4 flex flex-col items-center order-1 lg:order-1">
        <div className="sticky top-24 space-y-6 w-full max-w-[320px] mx-auto">

          <ProfileIdCard
            user={{
              name: userData.full_name || "Unknown User",
              email: userData.email,
              phone: userData.mobile_number,
              solsticeId: userData.solstice_id,
              college: userData.college_name,
              regNumber: userData.registration_number,
              avatarUrl: userData.avatar_url
            }}
            passes={passes}
          />

          {/* Desktop Sign Out - Minimal Text Link */}
          <div className="hidden lg:flex justify-center">
            <button
              onClick={handleSignOut}
              className="text-xs text-neutral-600 hover:text-red-500 transition-colors uppercase tracking-widest font-medium flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>

          {/* Mobile Sign Out - Evident but Minimal Button */}
          <div className="lg:hidden w-full">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full bg-black/40 border-red-900/30 text-red-400 hover:bg-red-950/30 hover:border-red-500/50 hover:text-red-300 transition-all uppercase tracking-widest text-xs h-10"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: DASHBOARD CONTENT --- */}
      <div className="lg:col-span-8 space-y-10 order-2 lg:order-2">

        {/* 1. Header & Stats Row */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight michroma-regular">
                Dashboard
              </h1>
            </div>

            {/* Stats - Centered on mobile */}
            <div className="flex gap-4 justify-start w-full lg:w-auto mt-4 md:mt-0">
              <div className="flex-1 lg:flex-none bg-black/40 border border-white/10 rounded-lg p-3 min-w-[100px] text-center backdrop-blur-sm group hover:border-red-500/30 transition-colors">
                <div className="text-2xl font-bold text-red-500 group-hover:scale-110 transition-transform">{joinedEvents.length}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mt-1 font-medium">Events</div>
              </div>
              <div className="flex-1 lg:flex-none bg-black/40 border border-white/10 rounded-lg p-3 min-w-[100px] text-center backdrop-blur-sm group hover:border-red-500/30 transition-colors">
                <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                  {joinedEvents.filter(e => e.is_captain).length}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mt-1 font-medium">Leading</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1.5 Passes List */}
        {passes && passes.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-yellow-500 rounded-full" />
              <h3 className="text-xl font-bold text-white tracking-widest michroma-regular uppercase">
                Your Passes
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {passes.map((pass) => (
                <div
                  key={pass.id}
                  className="group relative p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-yellow-500/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center border bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-yellow-500 transition-colors uppercase tracking-wide michroma-regular text-sm">
                          {pass.pass?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-neutral-500 text-xs font-mono">
                            ₹{pass.pass?.price}
                          </span>
                          <span className="text-neutral-700">|</span>
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider", pass.ticket_cut ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20")}>
                            {pass.ticket_cut ? "Redeemed" : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Events List */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-red-500 rounded-full" />
            <h3 className="text-xl font-bold text-white tracking-widest michroma-regular uppercase">
              Your Events
            </h3>
          </div>

          {joinedEvents.length === 0 ? (
            <div className="text-center py-20 bg-black/20 rounded-2xl border border-white/10 border-dashed">
              <p className="text-neutral-400 mb-6 text-sm tracking-wide">You haven&apos;t registered for any events yet.</p>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs" onClick={() => window.location.href = '/events'}>
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {joinedEvents.map((item) => {
                const theme = categoryColors[item.event.category] || categoryColors.Default;
                const isLocked = !item.event.is_reg_open;

                return (
                  <div
                    key={item.reg_id}
                    onClick={() => setSelectedEventId(item.event.id)}
                    className="group relative p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-red-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        {/* Icon Box */}
                        <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center border bg-black/50 backdrop-blur-sm", theme)}>
                          <Users className="w-5 h-5" />
                        </div>

                        <div>
                          <h4 className="font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-wide michroma-regular text-sm md:text-base">
                            {item.event.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider", theme)}>
                              {item.event.category}
                            </span>
                            <span className="text-neutral-500 flex items-center gap-2 font-mono text-xs">
                              <span className="text-neutral-700">|</span> {item.team.name}
                            </span>
                            {item.is_captain && (
                              <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">Captain</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isLocked ? (
                          <span className="hidden sm:inline-block text-[10px] text-neutral-500 font-mono bg-neutral-900 px-2 py-1 rounded border border-neutral-800 tracking-wider">CLOSED</span>
                        ) : (
                          <span className="hidden sm:inline-block text-[10px] text-green-500 font-mono bg-green-950/10 px-2 py-1 rounded border border-green-900/20 tracking-wider">ACTIVE</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>



      {/* --- DASHBOARD MODAL --- */}
      {selectedEventData && (
        <ProfileTeamModal
          eventId={selectedEventData.event.id}
          eventName={selectedEventData.event.name}
          minSize={selectedEventData.event.min_team_size}
          maxSize={selectedEventData.event.max_team_size}
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          isLocked={!selectedEventData.event.is_reg_open}
        />
      )}
    </div>
  );
}
