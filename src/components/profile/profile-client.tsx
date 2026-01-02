"use client";

import { useState } from "react";
import { Users, Calendar, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileIdCard from "./profile-id-card";
import ProfileTeamModal from "./profile-team-modal";
import { Button } from "@/components/ui/button";

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
  // New Fields
  college_name: string | null;
  registration_number: string | null;
};

interface ProfileClientProps {
  userData: ProfileData;
  joinedEvents: JoinedEvent[];
}

// Visual Themes for Categories
const categoryColors: Record<string, string> = {
  AI: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Robotics: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Coding: "bg-green-500/10 text-green-400 border-green-500/20",
  Gaming: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Default: "bg-white/5 text-white border-white/10"
};

export default function ProfileClient({ userData, joinedEvents }: ProfileClientProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Helper to find the currently selected event data
  const selectedEventData = joinedEvents.find(e => e.event.id === selectedEventId);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

      {/* --- LEFT COLUMN: ID CARD --- */}
      <div className="lg:col-span-4 flex flex-col items-center">
        <div className="sticky top-24 space-y-8">
          <ProfileIdCard
            user={{
              name: userData.full_name || "Unknown User",
              email: userData.email,
              phone: userData.mobile_number,
              solsticeId: userData.solstice_id,
              college: userData.college_name,       // Passing new field
              regNumber: userData.registration_number, // Passing new field
              avatarUrl: userData.avatar_url
            }}
          />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-cyan-400">{joinedEvents.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Events</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-400">
                {joinedEvents.filter(e => e.is_captain).length}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Led Teams</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full max-w-[320px] border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* --- RIGHT COLUMN: EVENTS LIST --- */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <Calendar className="w-6 h-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Registered Events
          </h3>
        </div>

        {joinedEvents.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            <p className="text-neutral-400 mb-4">You haven't registered for any events yet.</p>
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" onClick={() => window.location.href = '/events'}>
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
                  className="group relative p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      {/* Icon Box */}
                      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center border", theme)}>
                        <Users className="w-6 h-6" />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {item.event.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide", theme)}>
                            {item.event.category}
                          </span>
                          <span className="text-sm text-neutral-400 flex items-center gap-1">
                            <span className="text-neutral-600">•</span> {item.team.name}
                          </span>
                          {item.is_captain && (
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded">LEADER</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isLocked ? (
                        <span className="hidden sm:inline-block text-xs text-red-400 font-mono bg-red-900/10 px-2 py-1 rounded border border-red-500/10">CLOSED</span>
                      ) : (
                        <span className="hidden sm:inline-block text-xs text-green-400 font-mono bg-green-900/10 px-2 py-1 rounded border border-green-500/10">ACTIVE</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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