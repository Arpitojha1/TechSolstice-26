"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Trash2, ArrowLeft, Loader2, AlertCircle,
  CheckCircle2, User, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/common/auth-context";

interface Props {
  eventId: string;
  eventName: string;
  minSize: number;
  maxSize: number;
  onBack: () => void;
  onSuccess: () => void;
}

const SOLSTICE_ID_PATTERN = /^TS-[A-Z0-9]{4,10}$/i;

function useDebounce(fn: (id: string, index: number) => void, delay: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return useCallback((id: string, index: number) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newId = setTimeout(() => fn(id, index), delay);
    setTimeoutId(newId);
  }, [fn, delay, timeoutId]);
}

export default function TeamRegistrationForm({
  eventId, eventName, minSize, maxSize, onBack, onSuccess
}: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [teammateIds, setTeammateIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [successData, setSuccessData] = useState<{ teamCode?: string } | null>(null);
  const [namePreviews, setNamePreviews] = useState<Record<number, string | null>>({});
  const [lookupLoading, setLookupLoading] = useState<Record<number, boolean>>({});

  const isSolo = maxSize === 1;

  const validateFormat = (id: string): string | null => {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return null;
    if (!SOLSTICE_ID_PATTERN.test(trimmed)) return "Invalid Format";
    return null;
  };

  const lookupName = async (id: string, index: number) => {
    if (!id || !SOLSTICE_ID_PATTERN.test(id)) {
      setNamePreviews(prev => ({ ...prev, [index]: null }));
      return;
    }

    setLookupLoading(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch(`/api/profile-lookup?solsticeId=${id}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setNamePreviews(prev => ({ ...prev, [index]: data.profile.full_name }));
      } else {
        setNamePreviews(prev => ({ ...prev, [index]: null }));
      }
    } catch {
      setNamePreviews(prev => ({ ...prev, [index]: null }));
    }
    setLookupLoading(prev => ({ ...prev, [index]: false }));
  };

  const debouncedLookup = useDebounce(lookupName, 500);

  const addTeammate = () => {
    if (teammateIds.length + 1 < maxSize) {
      setTeammateIds([...teammateIds, ""]);
    }
  };

  const removeTeammate = (index: number) => {
    const newIds = [...teammateIds];
    newIds.splice(index, 1);
    setTeammateIds(newIds);

    // Clean up state
    const newErrors = { ...fieldErrors };
    delete newErrors[index];
    setFieldErrors(newErrors);
    setNamePreviews(prev => { const p = { ...prev }; delete p[index]; return p; });
  };

  const updateTeammateId = (index: number, value: string) => {
    const formatted = value.toUpperCase().trim();
    const newIds = [...teammateIds];
    newIds[index] = formatted;
    setTeammateIds(newIds);

    const formatError = validateFormat(formatted);
    const newErrors = { ...fieldErrors };
    if (formatError) {
      newErrors[index] = formatError;
      setNamePreviews(prev => ({ ...prev, [index]: null }));
    } else {
      delete newErrors[index];
      debouncedLookup(formatted, index);
    }
    setFieldErrors(newErrors);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isSolo && !teamName.trim()) {
      setError("Team name required");
      return;
    }
    if (Object.keys(fieldErrors).length > 0) {
      setError("Fix ID errors");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const validTeammateIds = teammateIds.filter(id => id.trim() !== "");

      const res = await fetch('/api/register-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId,
          eventName,
          teamName: isSolo ? null : teamName,
          teammateIds: validTeammateIds,
          userId: user?.id // Fallback for 401 issues
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessData({ teamCode: data.teamCode });
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const validTeammateCount = teammateIds.filter(id => id.trim() !== "").length;
  const totalMembers = 1 + validTeammateCount;
  const meetsMinimum = totalMembers >= minSize;

  // ===== SUCCESS =====
  if (successData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-6">
          {isSolo ? "Registration Confirmed" : "Team Created"}
        </h3>
        {!isSolo && successData.teamCode && (
          <div className="mb-8">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Team Code</span>
            <p className="text-3xl font-mono font-bold text-white mt-1">{successData.teamCode}</p>
          </div>
        )}
        <Button onClick={() => { router.refresh(); onSuccess(); }} className="rounded-full px-8 bg-white text-black hover:bg-neutral-200">
          Done
        </Button>
      </div>
    );
  }

  // ===== FORM =====
  return (
    <div className="h-full flex flex-col bg-[#050505] text-white">
      {/* Minimal Header */}
      <div className="flex items-center px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="ml-2 text-sm font-medium text-neutral-200">
          {isSolo ? "Solo Register" : "Create Team"}
        </span>
        <span className="ml-auto text-[10px] text-neutral-600 uppercase tracking-widest border border-white/5 px-2 py-1 rounded-sm">
          {totalMembers}/{maxSize}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Error Toast */}
        {error && (
          <div className="bg-red-500/10 text-red-400 text-xs px-4 py-3 rounded border border-red-500/20 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Team Name */}
        {!isSolo && (
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-2xl font-medium focus-visible:ring-0 focus-visible:border-white/40 placeholder:text-neutral-700 transition-colors h-auto py-2"
            />
          </div>
        )}

        {/* Teammates */}
        {!isSolo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Teammates</label>
              {!isSolo && !meetsMinimum && (
                <span className="text-[10px] text-red-500/70">Min {minSize} required</span>
              )}
            </div>

            {/* Captain (You) */}
            <div className="flex items-center gap-3 py-2 border-b border-white/5 text-neutral-400">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]">You</div>
              <span className="text-sm">Captain</span>
            </div>

            {teammateIds.map((id, i) => (
              <div key={i} className="group relative">
                <div className="flex items-center gap-3">
                  {lookupLoading[i] ? (
                    <Loader2 size={14} className="animate-spin text-neutral-600" />
                  ) : namePreviews[i] ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <User size={12} className="text-green-500" />
                    </div>
                  ) : fieldErrors[i] ? (
                    <AlertCircle size={14} className="text-red-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-neutral-600">{i + 1}</div>
                  )}

                  <div className="flex-1 relative">
                    <input
                      value={id}
                      onChange={(e) => updateTeammateId(i, e.target.value)}
                      placeholder="TS-XXXXXX"
                      className={cn(
                        "w-full bg-transparent border-b border-white/5 py-3 text-sm font-mono uppercase focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-800",
                        fieldErrors[i] && "border-red-500/50 text-red-400",
                        namePreviews[i] && "text-green-500"
                      )}
                    />
                    {namePreviews[i] && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none">
                        {namePreviews[i]}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeTeammate(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-600 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}

            {teammateIds.length + 1 < maxSize && (
              <button
                onClick={addTeammate}
                className="flex items-center gap-3 py-3 text-sm text-neutral-500 hover:text-white transition-colors w-full"
              >
                <div className="w-6 h-6 rounded-full border border-dashed border-neutral-700 flex items-center justify-center">
                  <Plus size={12} />
                </div>
                <span>Add Teammate</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5">
        <Button
          onClick={handleSubmit}
          disabled={loading || (!isSolo && !meetsMinimum)}
          className="w-full h-12 rounded-full bg-white text-black hover:bg-neutral-200 font-medium disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isSolo ? "Register" : "Create Team")}
        </Button>
      </div>
    </div>
  );
}