import { Participant } from "@/types/attendance";

type Props = {
  participant: Participant;
  onToggle: (id: string) => void;
};

export function ParticipantRow({ participant, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/5">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={participant.present}
          onChange={() => onToggle(participant.id)}
          className="accent-red-600 scale-110"
        />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{participant.name}</span>
            {participant.isCaptain && (
              <span className="text-[10px] uppercase tracking-widest border border-red-500/40 text-red-400 px-2 py-0.5 rounded-full">
                Captain
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">{participant.solsticeId}</p>
        </div>
      </div>

      {participant.present && (
        <span className="text-xs tracking-wide text-red-500">Present</span>
      )}
    </div>
  );
}
