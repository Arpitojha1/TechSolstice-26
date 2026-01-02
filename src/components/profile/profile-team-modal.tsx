"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, UserMinus, ShieldAlert, LogOut, Lock, X } from "lucide-react";
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
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const isSolo = maxSize === 1;

  useEffect(() => {
    if (isOpen && eventId) {
      fetchTeam();
    }
  }, [isOpen, eventId]);

  const fetchTeam = async () => {
    setLoading(true);
    const { data: result, error } = await supabase.rpc("get_user_team_for_event", { p_event_id: eventId });

    if (result) {
      setData(result);
      setEditMembers(result.members.map((m: Member) => m.solstice_id));
    } else {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  const handleUnregister = async () => {
    if (isLocked) return;
    const msg = isSolo ? "Unregister from this event?" : "Delete Team? This removes everyone.";
    if (!confirm(msg)) return;
    setSaving(true);
    const { data: res, error } = await supabase.rpc("delete_team", { p_team_id: data?.team.id });
    if (error || !res?.success) alert(res?.message || "Failed to delete");
    else {
      alert("Unregistered successfully");
      router.refresh();
      onClose();
    }
    setSaving(false);
  };

  const handleLeave = async () => {
    if (isLocked) return;
    if (!confirm("Leave this team?")) return;
    setSaving(true);
    const { data: res, error } = await supabase.rpc("leave_team", { p_team_id: data?.team.id });
    if (error || !res?.success) alert(res?.message || "Failed to leave");
    else {
      alert("Left team successfully");
      router.refresh();
      onClose();
    }
    setSaving(false);
  };

  const handleSaveChanges = async () => {
    if (isLocked) return;
    setSaving(true);
    const validIds = editMembers.filter(id => id.trim() !== "");

    if (validIds.length < minSize) {
      alert(`Team needs at least ${minSize} members.`);
      setSaving(false); return;
    }

    const { data: res, error } = await supabase.rpc("update_team_structure", {
      p_event_id: eventId,
      p_team_id: data?.team.id,
      p_new_members: validIds
    });

    if (error || !res?.success) {
      alert("Error: " + (res?.message || error?.message));
    } else {
      alert("Saved!");
      setIsEditing(false);
      fetchTeam();
      router.refresh();
    }
    setSaving(false);
  };

  const addField = () => { if (editMembers.length < maxSize) setEditMembers([...editMembers, ""]); };
  const updateField = (i: number, val: string) => {
    const arr = [...editMembers]; arr[i] = val.toUpperCase(); setEditMembers(arr);
  };
  const removeField = (i: number) => {
    const arr = [...editMembers]; arr.splice(i, 1); setEditMembers(arr);
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
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 flex gap-2">
                    <ShieldAlert className="text-blue-400 shrink-0" size={18} />
                    <p className="text-xs text-blue-200">
                      Editing team members. Ensure everyone is eligible and has a valid Solstice ID.
                    </p>
                  </div>
                  <div className="space-y-3 overflow-y-auto pr-2 max-h-[300px]">
                    {editMembers.map((id, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={id}
                          onChange={(e) => updateField(idx, e.target.value)}
                          className="font-mono uppercase bg-white/5 border-white/10 text-white focus:border-cyan-500"
                          placeholder="TS-XXXX"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeField(idx)} className="hover:bg-red-500/20 hover:text-red-400">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    {editMembers.length < maxSize && (
                      <Button variant="outline" size="sm" onClick={addField} className="w-full border-dashed border-white/20 hover:bg-white/5 text-neutral-400">
                        + Add Member Slot
                      </Button>
                    )}
                  </div>
                  <div className="mt-auto flex gap-3 pt-4">
                    <Button variant="ghost" className="flex-1 hover:bg-white/10" onClick={() => setIsEditing(false)}>Cancel</Button>
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