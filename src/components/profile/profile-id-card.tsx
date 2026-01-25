import { Mail, Phone, QrCode, GraduationCap, FileDigit } from "lucide-react";
import FlipCard from "@/components/cards/FlipCard";

interface ProfileIdCardProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    solsticeId: string;
    college: string | null;
    regNumber: string | null;
    avatarUrl?: string;
  };
}

export default function ProfileIdCard({ user }: ProfileIdCardProps) {
  // --- FRONT DESIGN ---
  const Front = (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 flex flex-col items-center relative overflow-hidden">
      {/* Holographic Gradients */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

      {/* Avatar Section */}
      <div className="relative mb-3 mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-40 animate-pulse" />
        <img
          src={user.avatarUrl || "https://github.com/shadcn.png"}
          alt={user.name}
          className="relative w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-xl"
        />
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight text-center mb-1 line-clamp-1">
        {user.name || "Anonymous"}
      </h2>

      {/* ID Badge */}
      <div className="mb-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md group-hover:border-cyan-500/30 transition-colors">
        <span className="text-[10px] text-neutral-400 mr-2 uppercase tracking-widest font-medium">ID</span>
        <span className="font-mono font-extrabold text-cyan-400 tracking-wider text-sm shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
          {user.solsticeId || "PENDING"}
        </span>
      </div>

      {/* Details List */}
      <div className="w-full space-y-2.5 text-sm">
        {/* Contact Group */}
        <div className="bg-white/5 rounded-lg p-2.5 space-y-2 border border-white/5">
          <div className="flex items-center gap-3">
            <Mail className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
            <span className="truncate text-neutral-300 text-xs">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-3.5 h-3.5 text-purple-500/70 shrink-0" />
            <span className="text-neutral-300 text-xs">{user.phone || "No Phone"}</span>
          </div>
        </div>

        {/* Academic Group - VISIBILITY FIX: Removed the conditional check */}
        <div className="bg-white/5 rounded-lg p-2.5 space-y-2 border border-white/5">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-3.5 h-3.5 text-yellow-500/70 shrink-0 mt-0.5" />
            <span className={`text-xs line-clamp-2 leading-tight ${user.college ? "text-neutral-300" : "text-neutral-600 italic"}`}>
              {user.college || "College Not Set"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FileDigit className="w-3.5 h-3.5 text-pink-500/70 shrink-0" />
            <span className={`text-xs font-mono ${user.regNumber ? "text-neutral-300" : "text-neutral-600 italic"}`}>
              {user.regNumber || "Reg No. Not Set"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 text-[9px] text-neutral-600 uppercase tracking-widest animate-pulse">
        Click to Flip ↻
      </div>
    </div>
  );

  // --- BACK DESIGN ---
  const Back = (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 flex flex-col items-center justify-center relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-2">Access Pass</h3>

      <div className="bg-white p-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-300">
        <div className="w-40 h-40 bg-neutral-100 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg">
          <QrCode className="text-black/20 w-16 h-16" />
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <p className="text-xs font-mono text-cyan-500 font-bold">{user.solsticeId || "PENDING"}</p>
        <p className="text-[10px] text-neutral-500 max-w-[200px] leading-relaxed mx-auto">
          Official Entry Permit
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-[320px] h-[480px]">
      <FlipCard front={Front} back={Back} />
    </div>
  );
}