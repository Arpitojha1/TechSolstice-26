/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, QrCode, GraduationCap, FileDigit, Ticket } from "lucide-react";
import FlipCard from "@/components/cards/FlipCard";
import { useEffect, useState } from "react";
// import QRCode from "qrcode"
import QRCode from "qrcode";

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
  passes?: {
    id: string;
    user_id: string;
    pass_id: string;
    ticket_cut?: boolean;
    phone_no?: number | null;
    reg_no?: number | null;
    created_at?: string;
    pass: {
      name: string;
      price: number;
    };
    [key: string]: any;
  }[];
}

export default function ProfileIdCard({ user, passes = [] }: ProfileIdCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [activePassIndex, setActivePassIndex] = useState(0);
  const SPECIAL_PASS_ID = "20046249-fecd-4dd3-a6aa-888328312623";

  useEffect(() => {
    const generateQr = async () => {
      if (passes.length > 0) {
        const activePass = passes[activePassIndex];
        if (activePass.pass_id === SPECIAL_PASS_ID) {
          try {
            // Generate QR for the active pass ID
            const url = await QRCode.toDataURL(activePass.id);
            setQrCodeUrl(url);
          } catch (err) {
            console.error(err);
            setQrCodeUrl("");
          }
        } else {
          setQrCodeUrl("");
        }
      }
    };
    generateQr();
  }, [passes, activePassIndex]);

  // --- FRONT DESIGN ---
  const Front = (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-5 flex flex-col items-center relative overflow-hidden group">
      {/* Holographic Gradients */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl" />

      {/* Avatar Section */}
      <div className="relative mb-3 mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-40 animate-pulse" />
        {/* <img
          src={user.avatarUrl || "https://github.com/shadcn.png"}
          alt={user.name}
          className="relative w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-2xl"
        /> */}
        {/* <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> */}
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight text-center mb-1 line-clamp-1 michroma-regular uppercase">
        {user.name || "Anonymous"}
      </h2>

      {/* ID Badge */}
      <div className="mb-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md group-hover:border-red-500/30 transition-colors">
        <span className="text-[10px] text-neutral-500 mr-2 uppercase tracking-widest font-medium">ID</span>
        <span className="font-mono font-extrabold text-red-500 tracking-wider text-sm shadow-red-500/50 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
          {user.solsticeId || "PENDING"}
        </span>
      </div>

      {/* Details List */}
      <div className="w-full space-y-2.5 text-sm">
        {/* Contact Group */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2 border border-white/5">
          <div className="flex items-center gap-3">
            <Mail className="w-3.5 h-3.5 text-red-500/70 shrink-0" />
            <span className="truncate text-neutral-300 text-xs font-mono">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-3.5 h-3.5 text-red-500/70 shrink-0" />
            <span className="text-neutral-300 text-xs font-mono">{user.phone || "No Phone"}</span>
          </div>
        </div>

        {/* Academic Group - VISIBILITY FIX: Removed the conditional check */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2 border border-white/5">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-3.5 h-3.5 text-red-500/70 shrink-0 mt-0.5" />
            <span className={`text-xs line-clamp-2 leading-tight uppercase tracking-wide ${user.college ? "text-neutral-300" : "text-neutral-600 italic"}`}>
              {user.college || "College Not Set"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FileDigit className="w-3.5 h-3.5 text-red-500/70 shrink-0" />
            <span className={`text-xs font-mono ${user.regNumber ? "text-neutral-300" : "text-neutral-600 italic"}`}>
              {user.regNumber || "Reg No. Not Set"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 text-[9px] text-neutral-300 uppercase tracking-widest group-hover:text-red-500 transition-colors">
        Click to Flip 
      </div>
    </div>
  );

  // --- BACK DESIGN ---
  const Back = (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 flex flex-col items-center relative overflow-hidden text-center group">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2 michroma-regular w-full">
        Access Pass
      </h3>

      {passes.length > 0 ? (
        <>
          <div className="bg-white p-2 rounded-xl shadow-lg transform transition-transform group-hover:scale-105 duration-300 mb-4 h-36 flex items-center justify-center">
            {passes[activePassIndex].pass_id === SPECIAL_PASS_ID ? (
              <div className="w-32 h-32 bg-neutral-100 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg overflow-hidden">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Pass QR" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="text-black/80 w-24 h-24 animate-pulse" />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                <Ticket className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-[10px] uppercase tracking-wider font-semibold">No QR for this pass</p>
              </div>
            )}
          </div>
          
          <div className="w-full space-y-2 overflow-y-auto max-h-[120px] pr-1 custom-scrollbar">
            {passes.map((pass, idx) => (
              <div 
                key={pass.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePassIndex(idx);
                }}
                className={`p-2 rounded-md border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                  idx === activePassIndex 
                    ? "bg-red-500/10 border-red-500/50 text-red-400" 
                    : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                }`}
              >
                <Ticket className="w-3 h-3 shrink-0" />
                <div className="text-left overflow-hidden">
                  <p className="font-mono truncate w-full" title={pass.pass?.name}>{pass.pass?.name || "Event Pass"}</p>
                  <p className="text-[10px] opacity-70">
                    {pass.ticket_cut ? "Used" : "Active"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-neutral-500">
          <Ticket className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-sm">No active passes found</p>
          <p className="text-xs mt-1 text-neutral-600">Purchase a pass to access events</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[320px] h-[480px]">
      <FlipCard front={Front} back={Back} />
    </div>
  );
}