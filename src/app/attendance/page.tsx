"use client";

import { useState } from "react";
import { PatternText } from "@/components/animations/pattern-text";
import { AttendanceList } from "@/components/attendance/AttendanceList";
import { SearchBar } from "@/components/attendance/SearchBar";
import { CategorySelect } from "@/components/attendance/CategorySelect";
import { EventSelect } from "@/components/attendance/EventSelect";
import { StatsCards } from "@/components/attendance/StatsCards";
import { Event, Participant } from "@/types/attendance";

/* ---------------- MOCK DATA ---------------- */

const mockEvents: Event[] = [
  {
    id: "e1",
    name: "UI/UX Design Sprint",
    category: "Creative & Design",
    participants: [
      {
        id: "1",
        name: "A",
        solsticeId: "789465",
        team: "Pp",
        isCaptain: true,
        present: true,
      },
      {
        id: "2",
        name: "B",
        solsticeId: "456123",
        team: "Pp",
        present: false,
      },
    ],
  },
  {
    id: "e2",
    name: "Hackathon",
    category: "Coding & Dev",
    participants: [
      {
        id: "3",
        name: "C",
        solsticeId: "147852",
        team: "cse",
        isCaptain: true,
        present: false,
      },
    ],
  },
];

/* ---------------- PAGE ---------------- */

export default function AttendancePage() {
  const [category, setCategory] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");

  const categories = Array.from(new Set(mockEvents.map((e) => e.category)));

  const eventsByCategory = mockEvents.filter((e) => e.category === category);

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.solsticeId.toLowerCase().includes(search.toLowerCase()),
  );

  const totalTeams = new Set(participants.map((p) => p.team)).size;
  const presentCount = participants.filter((p) => p.present).length;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setEventId(null);
    setParticipants([]);
    setSearch("");
  };

  const handleEventChange = (value: string) => {
    setEventId(value);
    const event = mockEvents.find((e) => e.id === value);
    setParticipants(event ? event.participants : []);
    setSearch("");
  };

  const toggleAttendance = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, present: !p.present } : p)),
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Hero */}
      <div className="relative min-h-80 px-4 z-10 flex items-center justify-center py-24">
        <div className="max-w-7xl mx-auto text-center">
          <PatternText
            text="Attendance"
            className="michroma-regular text-[3.5rem]! sm:text-[5rem]! md:text-[6rem]! text-white/90!"
          />
          <p className="text-neutral-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mt-4">
            Manual Event Attendance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-32 relative z-10 space-y-10">
        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategorySelect
            categories={categories}
            value={category}
            onChange={handleCategoryChange}
          />
          <EventSelect
            events={eventsByCategory}
            value={eventId}
            onChange={handleEventChange}
          />
        </div>

        {/* Attendance Core */}
        {participants.length > 0 && (
          <>
            <StatsCards
              totalTeams={totalTeams}
              totalParticipants={participants.length}
              presentCount={presentCount}
            />

            <SearchBar value={search} onChange={setSearch} />

            <AttendanceList
              participants={filteredParticipants}
              onToggle={toggleAttendance}
            />
          </>
        )}
      </div>
    </div>
  );
}
