"use client";

import { useState } from "react";
import ExpandableCard from "@/components/ui/expandable-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react"; // Added Trophy
import Teamregform from "./ui/Teamregform";

export type Event = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  imageUrl: string;
  prize_pool: string;
};

export function EventCard({ event }: { event: Event }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const currentUserId = "CURRENT_USER_ID";
  const currentUserName = "Your Name";

  return (
    <ExpandableCard
      title={event.name}
      src={event.imageUrl}
      description={event.shortDescription}
      isFlipped={isFlipped}
      backContent={
        <Teamregform
          eventId={event.id}
          captainId={currentUserId}
          captainName={currentUserName}
          minSize={1}
          maxSize={5}
          useEmails={true}
          onBack={() => setIsFlipped(false)}
          onSuccess={() => {
            setIsFlipped(false);
          }}
        />
      }
    >
      {/* FRONT content of overlay */}
      <div className="space-y-6 pt-2 w-full">
        <p className="text-neutral-300 leading-relaxed">{event.longDescription}</p>

        {/* Prize Section */}
        <div className="flex items-center justify-center gap-2 w-40 h-10 px-2 py-2 border-3 outline-2 outline-[#C9A227] border-black bg-linear-to-r from-[#FF9500] via-[#FFCC00] to-[#FFCC00] rounded-2xl">
          <span className="text-base font-bold text-white">
            <Trophy size={17} className="text-white shrink-0 inline-flex" /> Prize
          </span>
          <span className="text-base font-bold text-white">₹{event.prize_pool}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <Calendar size={18} className="text-cyan-400 shrink-0" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <Clock size={18} className="text-cyan-400 shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <MapPin size={18} className="text-cyan-400 shrink-0" />
            <span className="text-sm">{event.venue}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center pt-4">
          <Button
            onClick={() => setIsFlipped(true)}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-12"
          >
            Register Now
          </Button>
        </div>
      </div>
    </ExpandableCard>
  );
}

export default EventCard;