// "use client";

// import { useState } from "react";
// import ExpandableCard from "@/components/ui/expandable-card";
// import { Button } from "@/components/ui/button";
// import { Calendar, Clock, MapPin, Trophy, CheckCircle2, Lock, Hourglass } from "lucide-react";
// import TeamRegistrationForm from "@/components/ui/TeamRegistrationForm";
// import TeamDashboard from "@/components/ui/TeamDashboard";

// export type Event = {
//   id: string;
//   name: string;
//   shortDescription: string | null;
//   longDescription: string | null;
//   category: string;
//   starts_at: string | null;
//   ends_at: string | null;
//   venue: string | null;
//   imageUrl: string | null;
//   prize_pool: string | null;
//   min_team_size: number;
//   max_team_size: number;
//   is_reg_open: boolean;
//   registration_starts_at: string | null;
// };

// interface EventCardProps {
//   event: Event;
//   isRegistered: boolean;
//   hasAccess: boolean;   
// }

// export function EventCard({ event, isRegistered, hasAccess }: EventCardProps) {
//   const [isFlipped, setIsFlipped] = useState(false);

//   // --- STATE LOGIC ---
//   const now = new Date();
//   const regStart = event.registration_starts_at ? new Date(event.registration_starts_at) : new Date(0);
//   const isComingSoon = now < regStart;
//   const isLocked = !event.is_reg_open;

//   const eventDate = event.starts_at
//     ? new Date(event.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
//     : "TBA";
//   const eventTime = event.starts_at
//     ? new Date(event.starts_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
//     : "TBA";

//   // --- BUTTON TEXT LOGIC ---
//   let buttonText = "Register Now";
//   let buttonIcon = null;
//   let isDisabled = false;

//   if (isRegistered) {
//     buttonText = isLocked ? "View Team (Locked)" : "Manage Team";
//   } else {
//     if (isComingSoon) {
//       buttonText = "Coming Soon";
//       buttonIcon = <Hourglass size={16} className="mr-2" />;
//       isDisabled = true;
//     } else if (isLocked) {
//       buttonText = "Registration Closed";
//       buttonIcon = <Lock size={16} className="mr-2" />;
//       isDisabled = true;
//     }
//   }

//   return (
//     <ExpandableCard
//       title={event.name}
//       src={event.imageUrl || "/placeholder.jpg"}
//       description={event.shortDescription || ""}
//       isFlipped={isFlipped}
//       backContent={
//         isRegistered ? (
//           <TeamDashboard
//             eventId={event.id}
//             eventName={event.name}
//             minSize={event.min_team_size}
//             maxSize={event.max_team_size}
//             isLocked={isLocked}
//             onBack={() => setIsFlipped(false)}
//           />
//         ) : (
//           <TeamRegistrationForm
//             eventId={event.id}
//             eventName={event.name}
//             minSize={event.min_team_size}
//             maxSize={event.max_team_size}
//             onBack={() => setIsFlipped(false)}
//             onSuccess={() => setIsFlipped(false)}
//           />
//         )
//       }
//     >
//       <div className="space-y-6 pt-2 w-full">
//         <p className="text-neutral-300 leading-relaxed line-clamp-4">
//           {event.longDescription}
//         </p>

//         {/* STATUS BADGES */}
//         <div className="flex flex-wrap gap-2 justify-center">
//           {isRegistered && (
//             <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 p-2 rounded-lg">
//               <CheckCircle2 className="text-green-500" size={16} />
//               <span className="text-green-400 font-bold text-sm">Registered</span>
//             </div>
//           )}
//           {isLocked && !isRegistered && !isComingSoon && (
//             <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
//               <Lock className="text-red-500" size={16} />
//               <span className="text-red-400 font-bold text-sm">Closed</span>
//             </div>
//           )}
//         </div>

//         {event.prize_pool && (
//           <div className="flex items-center justify-center gap-2 w-fit mx-auto px-4 py-2 border-2 border-[#C9A227] bg-gradient-to-r from-[#FF9500] via-[#FFCC00] to-[#FFCC00] rounded-2xl shadow-lg">
//             <Trophy size={17} className="text-white shrink-0" />
//             <span className="text-base font-bold text-black drop-shadow-sm">Prize: ₹{event.prize_pool}</span>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
//             <Calendar size={18} className="text-cyan-400 shrink-0" />
//             <span className="text-sm text-neutral-200">{eventDate}</span>
//           </div>
//           <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
//             <Clock size={18} className="text-cyan-400 shrink-0" />
//             <span className="text-sm text-neutral-200">{eventTime}</span>
//           </div>
//           <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
//             <MapPin size={18} className="text-cyan-400 shrink-0" />
//             <span className="text-sm text-neutral-200 truncate" title={event.venue || "TBA"}>
//               {event.venue || "TBA"}
//             </span>
//           </div>
//         </div>

//         <div className="w-full flex items-center justify-center pt-4">
//           <Button
//             onClick={() => !isDisabled && setIsFlipped(true)}
//             size="lg"
//             disabled={isDisabled}
//             variant={isRegistered ? "outline" : "default"}
//             className={`font-bold px-12 w-full md:w-auto transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none ${isRegistered
//               ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
//               : "bg-cyan-500 hover:bg-cyan-600 text-black"
//               }`}
//           >
//             {buttonIcon}
//             {buttonText}
//           </Button>
//         </div>
//       </div>
//     </ExpandableCard>
//   );
// }
"use client";

import { useState } from "react";
import ExpandableCard from "@/components/ui/expandable-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Trophy, CheckCircle2, Lock, Hourglass } from "lucide-react";
import TeamRegistrationForm from "@/components/ui/TeamRegistrationForm";
import TeamDashboard from "@/components/ui/TeamDashboard";

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

  const now = new Date();
  const regStart = event.registration_starts_at ? new Date(event.registration_starts_at) : new Date(0);
  const isComingSoon = now < regStart;
  const isLocked = !event.is_reg_open;

  const isPassLocked = !hasAccess && !isRegistered;

  const eventDate = event.starts_at
    ? new Date(event.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "TBA";

  const eventTime = event.starts_at
    ? new Date(event.starts_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "TBA";

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

  return (
    <ExpandableCard
      title={event.name}
      description=""
      isFlipped={isFlipped}
      className="bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-all duration-300"
      collapsedChildren={
        <div className="space-y-3">
          {/* Meta Grid - Always 3 columns */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-lg">
              <Calendar size={16} className="text-cyan-400 shrink-0" />
              <span className="text-neutral-200 text-xs truncate w-full text-center">{eventDate}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-lg">
              <Clock size={16} className="text-cyan-400 shrink-0" />
              <span className="text-neutral-200 text-xs truncate w-full text-center">{eventTime}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-lg">
              <MapPin size={16} className="text-cyan-400 shrink-0" />
              <span className="text-neutral-200 text-xs truncate w-full text-center" title={event.venue || "TBA"}>
                {event.venue || "TBA"}
              </span>
            </div>
          </div>
          
          {/* Prize Pool - Fixed position */}
          <div className="flex items-center justify-center min-h-[28px]">
            {event.prize_pool && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg">
                <Trophy size={14} className="text-yellow-400 shrink-0" />
                <span className="text-xs font-semibold text-yellow-300">₹{event.prize_pool}</span>
              </div>
            )}
          </div>
        </div>
      }
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
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-6">
            <Lock size={48} className="text-red-400" />
            <p className="text-xl font-bold text-white">Pass Required</p>
            <p className="text-neutral-400">
              You need to purchase a pass to register for this event.
            </p>
            <Button
              onClick={() => {
                setIsFlipped(false);
                window.dispatchEvent(new CustomEvent("open-pass-modal", { detail: event.id }));
              }}
              className="bg-cyan-500 text-black font-bold"
            >
              Buy Pass
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 w-full max-w-2xl mx-auto py-4">
        {/* Prize Pool - Top position */}
        {event.prize_pool && (
          <div className="flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-500/25 to-amber-500/25 rounded-xl border border-yellow-500/30 shadow-lg">
            <Trophy size={18} className="text-yellow-400 shrink-0 sm:w-[20px] sm:h-[20px]" />
            <span className="text-sm sm:text-lg font-bold text-yellow-300">₹{event.prize_pool}</span>
          </div>
        )}

        {/* Meta Grid - Centered */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <Calendar size={20} className="text-cyan-400 shrink-0 sm:w-[24px] sm:h-[24px]" />
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-0.5">Date</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-200">{eventDate}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <Clock size={20} className="text-cyan-400 shrink-0 sm:w-[24px] sm:h-[24px]" />
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-0.5">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-200">{eventTime}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <MapPin size={20} className="text-cyan-400 shrink-0 sm:w-[24px] sm:h-[24px]" />
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-0.5">Venue</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-200 truncate w-full" title={event.venue || "TBA"}>
                {event.venue || "TBA"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Description - Centered */}
        {event.longDescription && (
          <div className="w-full p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold text-sm sm:text-base mb-2 text-center">About This Event</h4>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-6 text-center">
              {event.longDescription}
            </p>
          </div>
        )}

        {/* STATUS BADGES - Centered */}
        {(isRegistered || isPassLocked || (isLocked && !isRegistered && !isComingSoon)) && (
          <div className="flex flex-wrap gap-2 justify-center">
            {isRegistered && (
              <div className="flex items-center gap-2 bg-green-500/15 px-4 py-2 rounded-lg border border-green-500/30">
                <CheckCircle2 className="text-green-400" size={16} />
                <span className="text-green-400 font-semibold text-xs sm:text-sm">Registered</span>
              </div>
            )}

            {isPassLocked && (
              <div className="flex items-center gap-2 bg-yellow-500/15 px-4 py-2 rounded-lg border border-yellow-500/30">
                <Lock className="text-yellow-400" size={16} />
                <span className="text-yellow-300 font-semibold text-xs sm:text-sm">Pass Required</span>
              </div>
            )}

            {isLocked && !isRegistered && !isComingSoon && (
              <div className="flex items-center gap-2 bg-red-500/15 px-4 py-2 rounded-lg border border-red-500/30">
                <Lock className="text-red-400" size={16} />
                <span className="text-red-400 font-semibold text-xs sm:text-sm">Closed</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button - Centered */}
        {/* TEMPORARILY DISABLED - Registration and Pass Purchase */}
        {/* <div className="w-full flex items-center justify-center pt-2">
          <Button
            onClick={() => !isDisabled && setIsFlipped(true)}
            size="lg"
            disabled={isDisabled}
            variant={isRegistered ? "outline" : "default"}
            className={`font-bold text-sm sm:text-base px-10 sm:px-12 w-full sm:w-auto transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isRegistered
                ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                : "bg-cyan-500 hover:bg-cyan-600 text-black shadow-lg"
              }`}
          >
            {buttonIcon}
            {buttonText}
          </Button>
        </div> */}
      </div>
    </ExpandableCard>
  );
}
