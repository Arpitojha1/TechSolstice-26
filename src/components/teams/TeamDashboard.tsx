"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2, ArrowLeft, Loader2, LogOut, Lock, AlertCircle,
  CheckCircle2, User, Plus, X, Copy, Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Member {
  user_id: string;
  solstice_id: string;
  full_name: string;
  is_captain: boolean;
}

interface TeamData {
  team: {
    id: string;
    name: string;
    team_code: string;
    is_captain: boolean;
  };
  members: Member[];
}

interface Props {
  eventId: string;
  eventName: string;
  minSize: number;
  maxSize: number;
  onBack: () => void;
  isLocked: boolean;
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

export default function TeamDashboard({ eventId, eventName, minSize, maxSize, onBack, isLocked }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [namePreviews, setNamePreviews] = useState<Record<number, string | null>>({});
  const [lookupLoading, setLookupLoading] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const isSolo = maxSize === 1;
  const captainSolsticeId = data?.members.find(m => m.is_captain)?.solstice_id || "";

  useEffect(() => {
    fetchTeam();
  }, [eventId]);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/team?eventId=${eventId}`);
      const result = await res.json();
      if (result.success) {
        setData(result);
        const nonCaptainMembers = result.members.filter((m: Member) => !m.is_captain);
        setEditMembers(nonCaptainMembers.map((m: Member) => m.solstice_id));

        const previews: Record<number, string> = {};
        nonCaptainMembers.forEach((m: Member, i: number) => {
          previews[i] = m.full_name;
        });
        setNamePreviews(previews);
      }
    } catch {
      // minimal failure handling
    }
    setLoading(false);
  };

  const validateFormat = (id: string): string | null => {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return null;
    if (!SOLSTICE_ID_PATTERN.test(trimmed)) return "Invalid Format";
    if (trimmed === captainSolsticeId) return "Cannot add yourself";
    return null;
  };

  const lookupName = async (id: string, index: number) => {
    if (!id || !SOLSTICE_ID_PATTERN.test(id)) {
      setNamePreviews(prev => ({ ...prev, [index]: null }));
      return;
    }

    setLookupLoading(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch(`/api/profile-lookup?solsticeId=${id}`);
      const result = await res.json();
      if (result.success && result.profile) {
        setNamePreviews(prev => ({ ...prev, [index]: result.profile.full_name }));
      } else {
        setNamePreviews(prev => ({ ...prev, [index]: null }));
      }
    } catch {
      setNamePreviews(prev => ({ ...prev, [index]: null }));
    }
    setLookupLoading(prev => ({ ...prev, [index]: false }));
  };

  const debouncedLookup = useDebounce(lookupName, 500);

  const copyTeamCode = async () => {
    if (data?.team.team_code) {
      await navigator.clipboard.writeText(data.team.team_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnregister = async () => {
    if (isLocked) return;
    if (!confirm(isSolo ? "Unregister?" : "Delete team?")) return;
    performDelete('delete');
  };

  const handleLeave = async () => {
    if (isLocked) return;
    if (!confirm("Leave team?")) return;
    performDelete('leave');
  };

  const performDelete = async (action: 'delete' | 'leave') => {
    setSaving(true);
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: data?.team.id, action })
      });
      const result = await res.json();
      if (result.success) {
        router.refresh();
        onBack();
      } else {
        setError(result.message || "Failed");
      }
    } catch {
      setError("Error occurred");
    }
    setSaving(false);
  };

  const handleSaveChanges = async () => {
    setError(null);
    if (Object.keys(fieldErrors).length > 0) return;

    const validIds = editMembers.filter(id => id.trim() !== "" && id.trim().toUpperCase() !== captainSolsticeId);
    const uniqueIds = [...new Set(validIds)];

    if (uniqueIds.length !== validIds.length) {
      setError("Duplicate IDs");
      return;
    }

    if (1 + uniqueIds.length < minSize) {
      setError(`Min ${minSize} members required`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: data?.team.id,
          eventId,
          eventName,
          newMemberIds: uniqueIds
        })
      });
      const result = await res.json();

      if (result.success) {
        setIsEditing(false);
        fetchTeam();
        router.refresh();
      } else {
        setError(result.message || "Failed to save");
      }
    } catch {
      setError("Error saving");
    }
    setSaving(false);
  };

  const updateField = (i: number, val: string) => {
    const formatted = val.toUpperCase().trim();
    const arr = [...editMembers];
    arr[i] = formatted;
    setEditMembers(arr);

    const formatError = validateFormat(formatted);
    const newErrors = { ...fieldErrors };
    if (formatError) {
      newErrors[i] = formatError;
      setNamePreviews(prev => ({ ...prev, [i]: null }));
    } else {
      delete newErrors[i];
      debouncedLookup(formatted, i);
    }
    setFieldErrors(newErrors);
  };

  const removeField = (i: number) => {
    const arr = [...editMembers];
    arr.splice(i, 1);
    setEditMembers(arr);

    const newErrors = { ...fieldErrors };
    delete newErrors[i];
    setFieldErrors(newErrors);
    setNamePreviews(prev => { const p = { ...prev }; delete p[i]; return p; });
  };

  // Loading
  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-neutral-500" /></div>;
  if (!data) return <div className="p-6 text-red-500">Error loading team.</div>;

  const validEditCount = editMembers.filter(id => id.trim() !== "").length;
  const currentTotal = 1 + validEditCount;

  return (
    <div className="h-full flex flex-col bg-[#050505] text-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="ml-2">
          <h3 className="text-sm font-medium text-neutral-200 leading-tight">
            {isEditing ? "Edit Team" : (isSolo ? "Registration" : data.team.name)}
          </h3>
          {!isSolo && !isEditing && (
            <button onClick={copyTeamCode} className="flex items-center gap-2 mt-0.5 group">
              <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                {data.team.team_code}
              </span>
              {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-neutral-600 group-hover:text-neutral-400" />}
            </button>
          )}
        </div>
        {!isSolo && isEditing && (
          <span className="ml-auto text-[10px] text-neutral-600 uppercase tracking-widest border border-white/5 px-2 py-1 rounded-sm">
            {currentTotal}/{maxSize}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 text-red-400 text-xs px-4 py-3 rounded border border-red-500/20 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-3 text-neutral-500 bg-neutral-900/50 p-4 rounded-lg">
            <Lock size={16} />
            <span className="text-xs">Registration Closed</span>
          </div>
        )}

        {!isEditing ? (
          // VIEW MODE
          <div className="space-y-4">
            {!isSolo && <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Members</label>}

            {data.members.map((m) => (
              <div key={m.user_id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                    m.is_captain ? "bg-white text-black font-bold" : "bg-neutral-900 text-neutral-400"
                  )}>
                    {m.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-neutral-200">{m.full_name}</p>
                    <p className="text-[10px] text-neutral-600 font-mono">{m.solstice_id}</p>
                  </div>
                </div>
                {m.is_captain && <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-400">Captain</span>}
              </div>
            ))}

            {!isLocked && (
              <div className="pt-8 space-y-3">
                {data.team.is_captain && !isSolo && (
                  <Button onClick={() => setIsEditing(true)} className="w-full bg-white text-black hover:bg-neutral-200 rounded-full h-12">
                    Edit Members
                  </Button>
                )}
                <Button
                  onClick={data.team.is_captain ? handleUnregister : handleLeave}
                  disabled={saving}
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-full"
                >
                  {isSolo ? "Unregister" : (data.team.is_captain ? "Delete Team" : "Leave Team")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // EDIT MODE
          <div className="space-y-4">
            {/* Captain (Readonly) */}
            <div className="flex items-center gap-3 py-2 border-b border-white/5 opacity-50">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">You</div>
              <span className="text-sm font-mono text-neutral-400">{captainSolsticeId}</span>
            </div>

            {/* Editable Members */}
            {editMembers.map((id, i) => (
              <div key={i} className="group relative flex items-center gap-3">
                {lookupLoading[i] ? (
                  <Loader2 size={14} className="animate-spin text-neutral-600" />
                ) : namePreviews[i] ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User size={12} className="text-green-500" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-neutral-600">{i + 1}</div>
                )}

                <div className="flex-1 relative">
                  <input
                    value={id}
                    onChange={(e) => updateField(i, e.target.value)}
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
                  onClick={() => removeField(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-600 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {editMembers.length + 1 < maxSize && (
              <button
                onClick={() => setEditMembers([...editMembers, ""])}
                className="flex items-center gap-3 py-3 text-sm text-neutral-500 hover:text-white transition-colors w-full"
              >
                <div className="w-6 h-6 rounded-full border border-dashed border-neutral-700 flex items-center justify-center">
                  <Plus size={12} />
                </div>
                <span>Add Member</span>
              </button>
            )}

            <div className="pt-6 grid grid-cols-2 gap-4">
              <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-full h-12 text-neutral-400">Cancel</Button>
              <Button onClick={handleSaveChanges} disabled={saving} className="rounded-full h-12 bg-white text-black hover:bg-neutral-200">
                {saving ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}