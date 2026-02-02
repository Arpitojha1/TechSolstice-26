import { Event } from "@/types/attendance";

type Props = {
  events: Event[];
  value: string | null;
  onChange: (value: string) => void;
};

export function EventSelect({ events, value, onChange }: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full h-14
        bg-black/40 backdrop-blur-md
        border border-white/10
        rounded-xl
        px-5
        text-white
        text-sm
        tracking-wide
        focus:outline-none
      "
    >
      <option value="" disabled>
        Select Event
      </option>
      {events.map((e) => (
        <option key={e.id} value={e.id} className="bg-black">
          {e.name}
        </option>
      ))}
    </select>
  );
}
