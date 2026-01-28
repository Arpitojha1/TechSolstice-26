"use client";

import { useState, useEffect } from "react";
import ExpandableCard from "@/components/cards/expandable-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Trophy, CheckCircle2, Lock, Hourglass, Users, ArrowRight } from "lucide-react";
import TeamRegistrationForm from "@/components/teams/TeamRegistrationForm";
import TeamDashboard from "@/components/teams/TeamDashboard";
import { cn } from "@/lib/utils";

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
  rulebook_url: string | null;
};

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  hasAccess: boolean;
}

export function EventCard({ event, isRegistered, hasAccess }: EventCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const now = mounted ? new Date() : new Date(0);
  const regStart = event.registration_starts_at ? new Date(event.registration_starts_at) : new Date(0);

  const isComingSoon = mounted ? now < regStart : false;
  const isLocked = !event.is_reg_open;
  const isPassLocked = !hasAccess && !isRegistered;

  const eventDate = mounted && event.starts_at
    ? new Date(event.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "TBA";

  const eventTime = mounted && event.starts_at
    ? new Date(event.starts_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "TBA";

  const teamSizeDisplay =
    event.min_team_size === event.max_team_size
      ? event.min_team_size === 1
        ? "Solo"
        : `${event.min_team_size}`
      : `${event.min_team_size}-${event.max_team_size}`;

  let buttonText = "Register Now";
  let buttonIcon = <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />;
  let isDisabled = false;
  let variant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined = "default";

  if (isRegistered) {
    buttonText = isLocked ? "View Team (Locked)" : "Manage Team";
    buttonIcon = <Users size={16} className="ml-2" />;
    variant = "outline";
  } else if (isPassLocked) {
    buttonText = "Buy Pass to Register";
    buttonIcon = <Lock size={16} className="ml-2" />;
    variant = "destructive";
  } else {
    if (isComingSoon) {
      buttonText = "Registration Opens Soon";
      buttonIcon = <Hourglass size={16} className="ml-2" />;
      isDisabled = true;
      variant = "secondary";
    } else if (isLocked) {
      buttonText = "Registration Closed";
      buttonIcon = <Lock size={16} className="ml-2" />;
      isDisabled = true;
      variant = "secondary";
    }
  }

  // Back content (Forms) - Logic preserved
  const backContentElement = isRegistered ? (
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
    // Pass Required View (Expanded Overlay)
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-6">
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
        <Lock size={32} className="text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white michroma-regular">Access Restricted</h3>
        <p className="text-neutral-400 max-w-xs mx-auto">
          You need a TechSolstice pass to register for this event.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setIsFlipped(false)} variant="ghost">
          Back
        </Button>
        <Button
          onClick={() => {
            setIsFlipped(false);
            window.dispatchEvent(new CustomEvent("open-pass-modal", { detail: event.id }));
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Get Pass
        </Button>
      </div>
    </div>
  );

  // Status Badge for Collapsed State
  const StatusBadge = () => {
    if (isRegistered) return <span className="text-green-400">Registered</span>;
    if (isLocked && !isComingSoon) return <span className="text-neutral-500">Closed</span>;
    if (isComingSoon) return <span className="text-blue-400">Coming Soon</span>;
    if (event.is_reg_open) return <span className="text-red-400">Open</span>;
    return null;
  };

  return (
    <ExpandableCard
      title={event.name}
      src={event.imageUrl || undefined}
      description={event.shortDescription || ""}
      isFlipped={isFlipped}
      collapsedChildren={
        <div className="flex items-center gap-2">
          <StatusBadge />
        </div>
      }
      backContent={backContentElement}
      className={cn(isRegistered ? "border-green-500/30 bg-green-950/5" : "")}
      bottomRightContent={
        event.prize_pool ? (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Prize Pool</span>
            <span className="text-red-400 font-bold michroma-regular text-sm">₹{event.prize_pool}</span>
          </div>
        ) : null
      }
    >
      <div className="space-y-8 pb-8">

        {/* Key Info Grid - Sleek Glassy Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoBox icon={<Calendar />} label="Date" value={eventDate} />
          <InfoBox icon={<Clock />} label="Time" value={eventTime} />
          <InfoBox icon={<Users />} label="Team Size" value={teamSizeDisplay} />
          <InfoBox icon={<MapPin />} label="Venue" value={event.venue || "TBA"} />
        </div>

        {/* Prize Pool - Prominent Display */}
        {event.prize_pool && (
          <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/20 to-black p-6 text-center group">
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Prize Pool</span>
              <div className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-white michroma-regular text-shadow-red">
                <Trophy className="text-red-500 mb-1" size={24} />
                <span>₹{event.prize_pool}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rulebook Button - ALWAYS rendering as requested */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            disabled={!event.rulebook_url}
            onClick={() => event.rulebook_url && window.open(event.rulebook_url, "_blank")}
            className="border-white/20 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all gap-2"
          >
            {/* File icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-text"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            {event.rulebook_url ? "View Rulebook" : "Rulebook Coming Soon"}
          </Button>
        </div>

        {/* Long Description */}
        {event.longDescription && (
          <div className="prose prose-invert prose-sm max-w-none text-neutral-400">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2 border-l-2 border-red-500 pl-3">About Event</h4>
            <p className="leading-relaxed">{event.longDescription}</p>
          </div>
        )}

        {/* Action Button Area */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
          {mounted ? (
            <Button
              onClick={() => {
                if (isRegistered || hasAccess) {
                  setIsFlipped(true);
                } else if (isPassLocked) {
                  window.dispatchEvent(new CustomEvent("open-pass-modal", { detail: event.id }));
                }
              }}
              size="lg"
              disabled={isDisabled}
              variant={variant}
              className={cn(
                "w-full sm:w-auto min-w-[200px] py-6 text-base font-bold tracking-wide uppercase transition-all duration-300",
                !isRegistered && !isDisabled && !isPassLocked ? "bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-900/20 border-0" : "",
                isPassLocked ? "bg-neutral-800 hover:bg-neutral-700 text-white" : ""
              )}
            >
              {buttonText}
              {buttonIcon}
            </Button>
          ) : (
            <div className="h-12 w-48 bg-white/5 animate-pulse rounded-md" />
          )}

          {/* Helper Text */}
          {isPassLocked && (
            <p className="text-xs text-red-400/80 flex items-center gap-1.5">
              <Lock size={12} /> TechSolstice Pass required
            </p>
          )}
        </div>
      </div>
    </ExpandableCard>
  );
}

// Helper Component for consistency
function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors gap-2 text-center group">
      <div className="text-neutral-500 group-hover:text-red-400 transition-colors [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-0.5">{label}</p>
        <p className="text-white font-medium text-sm sm:text-base">{value}</p>
      </div>
    </div>
  );
}