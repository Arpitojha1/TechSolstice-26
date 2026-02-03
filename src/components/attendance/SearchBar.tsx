type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by Solstice ID or Name..."
      className="w-full mb-10 rounded-xl bg-black/40 border border-white/10 px-5 py-3 text-white placeholder-gray-500 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-red-500/50"
    />
  );
}
