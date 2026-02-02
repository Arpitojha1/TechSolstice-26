import { Participant } from "@/types/attendance";
import { TeamSection } from "./TeamSection";

type Props = {
  participants: Participant[];
  onToggle: (id: string) => void;
};

export function AttendanceList({ participants, onToggle }: Props) {
  const teams = Array.from(new Set(participants.map((p) => p.team)));

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <TeamSection
          key={team}
          teamName={team}
          members={participants.filter((p) => p.team === team)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
