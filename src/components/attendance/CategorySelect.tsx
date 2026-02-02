type Props = {
  categories: string[];
  value: string | null;
  onChange: (value: string) => void;
};

export function CategorySelect({ categories, value, onChange }: Props) {
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
        Select Event Category
      </option>
      {categories.map((c) => (
        <option key={c} value={c} className="bg-black">
          {c}
        </option>
      ))}
    </select>
  );
}
