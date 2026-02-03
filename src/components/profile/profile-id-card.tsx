/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, QrCode, GraduationCap, FileDigit, Ticket, Copy, Check } from "lucide-react";
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
    phone_no?: number | string | null;
    reg_no?: number | string | null;
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
  const [copied, setCopied] = useState(false);
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
    <div className="h-full w-full rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 flex flex-col relative overflow-hidden group shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold mb-1">Pass ID</span>
          <h3 className="text-white font-bold michroma-regular tracking-wide text-xs">TECHSOLSTICE</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 opacity-80 animate-pulse blur-sm" />
      </div>

      {/* Main Identity */}
      <div className="flex flex-col items-center mb-6">
        {/* ID Badge with Copy */}
        <div className="mb-3 flex items-center justify-center gap-2 w-full">
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (user.solsticeId) {
                navigator.clipboard.writeText(user.solsticeId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            }}
            className="group/id relative bg-white/5 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md hover:border-red-500/50 hover:bg-white/10 transition-all cursor-pointer w-full text-center flex items-center justify-between"
            title="Click to copy ID"
          >
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-medium">Solstice ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-red-500 tracking-wider shadow-red-500/50 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                {user.solsticeId || "PENDING"}
              </span>
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-neutral-600 group-hover/id:text-white transition-colors" />}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight text-center michroma-regular capitalize leading-tight">
          {user.name || "Anonymous"}
        </h2>
        <span className="text-xs text-neutral-400 mt-1 font-mono">{user.email}</span>
      </div>

      {/* Details Grid */}
      <div className="w-full space-y-3 mt-auto mb-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
          <div className="grid grid-cols-2 gap-y-3">
            {/* College */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-3 h-3 text-red-500/70" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">Institution</span>
              </div>
              <p className="text-xs text-neutral-300 font-medium truncate pl-5">
                {user.college || "Not Set"}
              </p>
            </div>

            {/* Reg No */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileDigit className="w-3 h-3 text-red-500/70" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">Reg No.</span>
              </div>
              <p className="text-xs text-neutral-300 font-mono pl-5">
                {user.regNumber || "N/A"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-3 h-3 text-red-500/70" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">Phone</span>
              </div>
              <p className="text-xs text-neutral-300 font-mono pl-5">
                {user.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-0 w-full text-center">
        <span className="text-[9px] text-neutral-600 uppercase tracking-[0.2em] group-hover:text-red-500 transition-colors">
          Tap to view Passes
        </span>
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
                className={`p-2 rounded-md border text-xs cursor-pointer transition-all flex items-center gap-2 ${idx === activePassIndex
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