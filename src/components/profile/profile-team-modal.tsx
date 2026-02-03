"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, UserMinus, LogOut, Lock, X, AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

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
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean;
}

export default function ProfileTeamModal({ eventId, eventName, minSize, maxSize, isOpen, onClose, isLocked = false }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: number]: string }>({});

  const isSolo = maxSize === 1;
  const captainSolsticeId = data?.members.find(m => m.is_captain)?.solstice_id || "";

  useEffect(() => {
    if (isOpen && eventId) {
      fetchTeam();
    }
  }, [isOpen, eventId]);

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/team?eventId=${eventId}`);
      const result = await res.json();
      if (result.success) {
        setData(result);
        setEditMembers(result.members.filter((m: Member) => !m.is_captain).map((m: Member) => m.solstice_id));
      } else {
        setError(result.message || "Failed to load team");
      }
    } catch (err) {
      setError("Error loading team data");
    }
    setLoading(false);
  };

  const validateField = (id: string) => {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return null;
    if (!trimmed.startsWith("TS-")) return "Must start with TS-";
    if (trimmed.length < 6) return "Format: TS-XXXXXX";
    if (trimmed === captainSolsticeId) return "You cannot add yourself";
    return null;
  };

  const handleUnregister = async () => {
    if (isLocked) return;
    const msg = isSolo ? "Unregister from this event?" : "Delete Team? This removes everyone.";
    if (!confirm(msg)) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: data?.team.id, action: 'delete' })
      });
      const result = await res.json();
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.message || "Failed to delete");
      }
    } catch (err) {
      setError("Error deleting team");
    }
    setSaving(false);
  };

  const handleLeave = async () => {
    if (isLocked) return;
    if (!confirm("Leave this team?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: data?.team.id, action: 'leave' })
      });
      const result = await res.json();
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.message || "Failed to leave");
      }
    } catch (err) {
      setError("Error leaving team");
    }
    setSaving(false);
  };

  const handleSaveChanges = async () => {
    if (isLocked) return;
    setError(null);
    setSaving(true);

    const validIds = editMembers
      .filter(id => id.trim() !== "" && id.trim().toUpperCase() !== captainSolsticeId);

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the format errors in Solstice IDs");
      setSaving(false);
      return;
    }

    const uniqueIds = [...new Set(validIds)];
    if (uniqueIds.length !== validIds.length) {
      setError("Duplicate Solstice IDs found");
      setSaving(false);
      return;
    }

    if (uniqueIds.length + 1 < minSize) {
      setError(`Team needs at least ${minSize} members (you + ${minSize - 1} teammates)`);
      setSaving(false);
      return;
    }

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
        setError(null);
        fetchTeam();
        router.refresh();
      } else {
        setError(result.message || "Failed to save");
      }
    } catch (err) {
      setError("Error saving changes");
    }
    setSaving(false);
  };

  const addField = () => {
    if (editMembers.length + 1 < maxSize) setEditMembers([...editMembers, ""]);
  };

  const updateField = (i: number, val: string) => {
    const formatted = val.toUpperCase().trim();
    const arr = [...editMembers];
    arr[i] = formatted;
    setEditMembers(arr);

    const fieldError = validateField(formatted);
    const newErrors = { ...fieldErrors };
    if (fieldError) {
      newErrors[i] = fieldError;
    } else {
      delete newErrors[i];
    }
    setFieldErrors(newErrors);
    setError(null);
  };

  const removeField = (i: number) => {
    const arr = [...editMembers];
    arr.splice(i, 1);
    setEditMembers(arr);
    const newErrors = { ...fieldErrors };
    delete newErrors[i];
    setFieldErrors(newErrors);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div>
            <h3 className="text-lg font-bold text-cyan-400 leading-none">
              {isSolo ? "Registration Details" : "Team Management"}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">{eventName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-cyan-400" /></div>
          ) : !data ? (
            <div className="text-red-400 text-center">Error loading team data.</div>
          ) : (
            <>
              {/* Team Code Badge */}
              {!isSolo && (
                <div className="mb-6 bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm text-cyan-200/70">Team Code:</span>
                  <span className="font-mono text-xl font-bold text-cyan-400 tracking-wider select-all">{data.team.team_code}</span>
                </div>
              )}

              {isLocked && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3 items-center">
                  <Lock className="text-red-500 shrink-0" size={20} />
                  <div className="text-xs text-red-200">
                    <span className="font-bold block text-red-400 mb-0.5">Registration Locked</span>
                    Event registration is closed. You cannot edit members or leave the team.
                  </div>
                </div>
              )}

              {!isEditing ? (
                <div className="flex-1 flex flex-col gap-4">
                  {!isSolo && <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">{data.team.name}</h2>}

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                      {isSolo ? "Participant" : "Team Members"}
                    </h4>
                    {data.members.map((m) => (
                      <div key={m.user_id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{m.full_name}</span>
                            {!isSolo && m.is_captain && (
                              <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">CAPTAIN</span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">{m.solstice_id}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isLocked && (
                    <div className="mt-8 space-y-3 pt-4 border-t border-white/10">
                      {data.team.is_captain && !isSolo && (
                        <Button onClick={() => setIsEditing(true)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-11">
                          Edit Members
                        </Button>
                      )}
                      {data.team.is_captain && (
                        <Button onClick={handleUnregister} variant="destructive" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 h-11">
                          <LogOut className="mr-2 h-4 w-4" />
                          {isSolo ? "Unregister Event" : "Delete Team"}
                        </Button>
                      )}
                      {!data.team.is_captain && (
                        <Button onClick={handleLeave} variant="destructive" className="w-full h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                          <UserMinus className="mr-2 h-4 w-4" /> Leave Team
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Instructions */}
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 flex gap-2">
                    <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-blue-200 space-y-1">
                      <p>Enter the <span className="font-mono text-cyan-400">full Solstice ID</span> (e.g., <span className="font-mono text-cyan-300">TS-ABC123</span>)</p>
                      <p>Minimum {minSize} members required (including you)</p>
                    </div>
                  </div>

                  <div className="space-y-3 overflow-y-auto pr-2 max-h-[300px]">
                    {/* Captain (read-only) */}
                    <div className="flex gap-2 opacity-60">
                      <Input
                        value={captainSolsticeId}
                        disabled
                        className="font-mono uppercase bg-white/5 border-white/10 text-neutral-400"
                      />
                      <div className="px-3 flex items-center">
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">YOU</span>
                      </div>
                    </div>

                    {editMembers.map((id, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex gap-2">
                          <Input
                            value={id}
                            onChange={(e) => updateField(idx, e.target.value)}
                            className={`font-mono uppercase bg-white/5 border-white/10 text-white focus:border-cyan-500 ${fieldErrors[idx] ? 'border-red-500/50 focus:border-red-500' : ''
                              }`}
                            placeholder="TS-XXXXXX"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeField(idx)} className="hover:bg-red-500/20 hover:text-red-400">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {fieldErrors[idx] && (
                          <p className="text-xs text-red-400 ml-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {fieldErrors[idx]}
                          </p>
                        )}
                      </div>
                    ))}
                    {editMembers.length + 1 < maxSize && (
                      <Button variant="outline" size="sm" onClick={addField} className="w-full border-dashed border-white/20 hover:bg-white/5 text-neutral-400">
                        + Add Member Slot
                      </Button>
                    )}
                  </div>
                  <div className="mt-auto flex gap-3 pt-4">
                    <Button variant="ghost" className="flex-1 hover:bg-white/10" onClick={() => { setIsEditing(false); setError(null); setFieldErrors({}); }}>Cancel</Button>
                    <Button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold" onClick={handleSaveChanges} disabled={saving}>
                      {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}