import { Participant } from "@/types/attendance";
import { ParticipantRow } from "./ParticipantRow";

type Props = {
  teamName: string;
  members: Participant[];
  onToggle: (id: string) => void;
};

export function TeamSection({ teamName, members, onToggle }: Props) {
  const presentCount = members.filter((m) => m.present).length;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.04)]">
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-lg font-light tracking-wide text-white">
          {teamName}
        </h3>
        <span className="text-xs tracking-widest text-gray-400">
          {presentCount}/{members.length}
        </span>
      </div>

      <div className="px-6 pb-4">
        {members.map((member) => (
          <ParticipantRow
            key={member.id}
            participant={member}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
