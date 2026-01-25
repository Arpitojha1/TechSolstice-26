"use client";

import { useState, useEffect } from "react";
import ExpandableCard from "@/components/cards/expandable-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Trophy, CheckCircle2, Lock, Hourglass, Users } from "lucide-react";
import TeamRegistrationForm from "@/components/teams/TeamRegistrationForm";
import TeamDashboard from "@/components/teams/TeamDashboard";

export type Event = {
  id: string;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  category: string;
  starts_at: string | null;
  ends_at: string | null;
  venue: string | null;
  imageUrl: string | null;
  prize_pool: string | null;
  min_team_size: number;
  max_team_size: number;
  is_reg_open: boolean;
  registration_starts_at: string | null;
};

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  hasAccess: boolean;
}

export function EventCard({ event, isRegistered, hasAccess }: EventCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  // HYDRATION FIX: Only calculate dates after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe defaults for Server Side Rendering (SSR) to prevent #418 mismatch
  const now = mounted ? new Date() : new Date(0); // Default to epoch on server
  const regStart = event.registration_starts_at ? new Date(event.registration_starts_at) : new Date(0);

  // Logic
  const isComingSoon = mounted ? now < regStart : false; // Assume open on server to prevent lockout
  const isLocked = !event.is_reg_open;
  const isPassLocked = !hasAccess && !isRegistered;

  // Date Formatting - only computed when mounted to match client timezone
  const eventDate = mounted && event.starts_at
    ? new Date(event.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "TBA";

  const eventTime = mounted && event.starts_at
    ? new Date(event.starts_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "TBA";

  // Team Size Logic
  const teamSizeDisplay =
    event.min_team_size === event.max_team_size
      ? event.min_team_size === 1
        ? "Solo"
        : `${event.min_team_size}`
      : `${event.min_team_size}-${event.max_team_size}`;

  let buttonText = "Register Now";
  let buttonIcon = null;
  let isDisabled = false;

  if (isRegistered) {
    buttonText = isLocked ? "View Team (Locked)" : "Manage Team";
  } else if (isPassLocked) {
    buttonText = "Buy Pass";
    buttonIcon = <Lock size={16} className="mr-2" />;
  } else {
    if (isComingSoon) {
      buttonText = "Coming Soon";
      buttonIcon = <Hourglass size={16} className="mr-2" />;
      isDisabled = true;
    } else if (isLocked) {
      buttonText = "Registration Closed";
      buttonIcon = <Lock size={16} className="mr-2" />;
      isDisabled = true;
    }
  }

  // Prevent rendering unstable content until hydration is complete
  // (Optional: You can render a skeleton here if you prefer, but this prevents the crash)
  if (!mounted) {
    // Return a static "Server Safe" version or just the structure to prevent layout shift
    // We render the structure but with safe default text ("TBA")
  }

  return (
    <ExpandableCard
      title={event.name}
      description=""
      // Flip functionality temporarily disabled
      // isFlipped={isFlipped}
      isFlipped={false}
      // THEME UPDATE: Pitch black, sharp borders, red hover. 
      className="w-full h-full min-h-[340px] bg-black border border-white/10 hover:border-[#7a0c0c] transition-colors duration-300 group rounded-lg"
      collapsedChildren={
        <div className="space-y-5 w-full">
          {/* Meta Grid */}
          <div className="grid grid-cols-4 divide-x divide-white/10 border-t border-white/10 pt-5 w-full">
            <div className="flex flex-col items-center gap-1.5 px-1">
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Date</span>
              {/* suppressHydrationWarning added for extra safety on timestamps */}
              <span suppressHydrationWarning className="text-neutral-200 text-xs sm:text-sm font-medium truncate w-full text-center">
                {eventDate}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-1">
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Time</span>
              <span suppressHydrationWarning className="text-neutral-200 text-xs sm:text-sm font-medium truncate w-full text-center">
                {eventTime}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-1">
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Team</span>
              <div className="flex items-center gap-1">
                <Users size={12} className="text-red-500/80" />
                <span className="text-neutral-200 text-xs sm:text-sm font-medium truncate w-full text-center">
                  {teamSizeDisplay}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-1">
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Venue</span>
              <span className="text-neutral-200 text-xs sm:text-sm font-medium truncate w-full text-center" title={event.venue || "TBA"}>
                {event.venue || "TBA"}
              </span>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="flex items-center justify-center pt-2">
            {event.prize_pool && (
              <div className="flex items-baseline gap-2 text-red-500">
                <Trophy size={12} className="opacity-80" />
                <span className="text-xs sm:text-sm font-mono font-bold tracking-tight">
                  ₹{event.prize_pool}
                </span>
              </div>
            )}
          </div>
        </div>
      }
      // Back-side content (flip) temporarily commented out — preserve for later
      /*
      backContent={
        isRegistered ? (
          <TeamDashboard
            eventId={event.id}
            eventName={event.name}
            minSize={event.min_team_size}
            maxSize={event.max_team_size}
            isLocked={isLocked}
            onBack={() => setIsFlipped(false)}
          />
        ) : hasAccess ? (
          <TeamRegistrationForm
            eventId={event.id}
            eventName={event.name}
            minSize={event.min_team_size}
            maxSize={event.max_team_size}
            onBack={() => setIsFlipped(false)}
            onSuccess={() => setIsFlipped(false)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-6 bg-neutral-950 rounded-lg border border-white/5">
            <Lock size={32} className="text-red-500/80" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-white tracking-tight">Pass Required</p>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-[200px] mx-auto leading-relaxed">
                Access to this event is restricted to pass holders.
              </p>
            </div>
            <Button
              onClick={() => {
                setIsFlipped(false);
                window.dispatchEvent(new CustomEvent("open-pass-modal", { detail: event.id }));
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black font-medium text-xs uppercase tracking-wider"
            >
              Get Access
            </Button>
          </div>
        )
      }
      */
      backContent={null}
    >
      <div className="flex flex-col items-center justify-start sm:justify-center space-y-8 w-full h-full py-6">

        {/* Prize Pool */}
        {event.prize_pool && (
          <div className="flex items-center gap-3 px-5 py-2.5 border border-red-900/30 rounded-md bg-red-950/5">
            <Trophy size={18} className="text-red-500" />
            <div className="w-px h-4 bg-red-900/30"></div>
            <span className="text-sm sm:text-base font-bold text-red-100 font-mono tracking-tight">₹{event.prize_pool}</span>
          </div>
        )}

        {/* Meta Grid - 4 Columns */}
        <div className="grid grid-cols-4 w-full divide-x divide-white/10 mt-2">
          <div className="flex flex-col items-center justify-center px-2 gap-2">
            <p className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-[0.2em]">Date</p>
            <p suppressHydrationWarning className="text-sm sm:text-base font-medium text-neutral-200 text-center">
              {eventDate}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center px-2 gap-2">
            <p className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-[0.2em]">Time</p>
            <p suppressHydrationWarning className="text-sm sm:text-base font-medium text-neutral-200 text-center">
              {eventTime}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center px-2 gap-2">
            <p className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-[0.2em]">Team</p>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-red-500" />
              <p className="text-sm sm:text-base font-medium text-neutral-200 text-center">
                {teamSizeDisplay}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-2 gap-2">
            <p className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-[0.2em]">Venue</p>
            <p className="text-sm sm:text-base font-medium text-neutral-200 truncate w-full text-center px-1" title={event.venue || "TBA"}>
              {event.venue || "TBA"}
            </p>
          </div>
        </div>

        {/* Description */}
        {event.longDescription && (
          <div className="w-full px-4 sm:px-6">
            <div className="border-l-2 border-red-500/50 pl-4 py-2">
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-4 text-left">
                {event.longDescription}
              </p>
            </div>
          </div>
        )}

        {/* STATUS BADGES */}
        {(isRegistered || isPassLocked || (isLocked && !isRegistered && !isComingSoon)) && (
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {isRegistered && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/30">
                <CheckCircle2 className="text-white" size={12} />
                <span className="text-white font-medium text-[10px] uppercase tracking-wider">Registered</span>
              </div>
            )}

            {isPassLocked && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/40">
                <Lock className="text-red-500" size={12} />
                <span className="text-red-400 font-medium text-[10px] uppercase tracking-wider">Pass Required</span>
              </div>
            )}

            {isLocked && !isRegistered && !isComingSoon && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-700">
                <Lock className="text-neutral-500" size={12} />
                <span className="text-neutral-500 font-medium text-[10px] uppercase tracking-wider">Closed</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button - Only renders when mounted to avoid button mismatch */}
        <div className="w-full flex items-center justify-center pt-2">
          {mounted ? (
            <Button
              // Flip action disabled temporarily
              onClick={() => { }}
              size="lg"
              disabled={isDisabled}
              variant={isRegistered ? "outline" : "default"}
              className={`font-bold text-sm sm:text-base px-8 py-6 w-full sm:w-auto transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider ${isRegistered
                ? "border border-white/20 text-white hover:bg-white hover:text-black rounded-none"
                : "bg-[#7a0c0c] hover:bg-[#5a0909] text-white border border-transparent rounded-none"
                }`}
            >
              {buttonIcon}
              {buttonText}
            </Button>
          ) : (
            // Skeleton / Loading Button state for SSR
            <div className="h-14 w-40 bg-white/5 animate-pulse rounded-none" />
          )}
        </div>
      </div>
    </ExpandableCard>
  );
}