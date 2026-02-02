type Props = {
  totalTeams: number;
  totalParticipants: number;
  presentCount: number;
};

export function StatsCards({
  totalTeams,
  totalParticipants,
  presentCount,
}: Props) {
  const items = [
    { label: "Total Teams", value: totalTeams },
    { label: "Total Participants", value: totalParticipants },
    { label: "Present", value: presentCount, highlight: true },
    { label: "Attendance Mode", value: "Manual" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-[0_0_30px_rgba(255,0,0,0.05)]"
        >
          <p className="text-[11px] tracking-widest uppercase text-gray-400">
            {item.label}
          </p>
          <p
            className={`text-2xl font-light mt-1 ${
              item.highlight ? "text-red-500" : "text-white"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
