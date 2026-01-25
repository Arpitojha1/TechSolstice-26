"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowLeft, Loader2, UserMinus, ShieldAlert, LogOut, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

export default function TeamDashboard({ eventId, eventName, minSize, maxSize, onBack, isLocked }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const isSolo = maxSize === 1;

  useEffect(() => {
    fetchTeam();
  }, [eventId]);

  const fetchTeam = async () => {
    const { data: result } = await supabase.rpc("get_user_team_for_event", { p_event_id: eventId });
    if (result) {
      setData(result);
      setEditMembers(result.members.map((m: Member) => m.solstice_id));
    }
    setLoading(false);
  };

  const handleUnregister = async () => {
    if (isLocked) return;
    const msg = isSolo ? "Unregister from this event?" : "Delete Team? This removes everyone.";
    if (!confirm(msg)) return;
    setSaving(true);
    const { data: res, error } = await supabase.rpc("delete_team", { p_team_id: data?.team.id });
    if (error || !res.success) alert(res?.message || "Failed");
    else { router.refresh(); onBack(); }
  };

  const handleLeave = async () => {
    if (isLocked) return;
    if (!confirm("Leave this team?")) return;
    setSaving(true);
    const { data: res, error } = await supabase.rpc("leave_team", { p_team_id: data?.team.id });
    if (error || !res.success) alert(res?.message || "Failed");
    else { router.refresh(); onBack(); }
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

    if (error || !res.success) {
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

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-cyan-400" /></div>;
  if (!data) return <div className="p-6 text-red-400">Error loading team.</div>;

  return (
    <div className="h-full flex flex-col p-6 bg-[#0a0a0a] text-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-neutral-400 hover:text-white">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h3 className="text-lg font-bold text-cyan-400 leading-none">
            {isSolo ? "My Registration" : "My Team"}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{eventName}</p>
        </div>
        {!isSolo && (
          <div className="ml-auto bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-md text-right">
            <span className="text-[10px] text-cyan-400 block uppercase tracking-wider">Code</span>
            <span className="font-mono font-bold text-cyan-300">{data.team.team_code}</span>
          </div>
        )}
      </div>

      {isLocked && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3 items-center">
          <Lock className="text-red-500 shrink-0" size={20} />
          <div className="text-xs text-red-200">
            <span className="font-bold block text-red-400 mb-0.5">Registration Locked</span>
            Event registration is closed. You cannot edit members or leave the team anymore.
          </div>
        </div>
      )}

      {!isEditing ? (
        <div className="flex-1 flex flex-col gap-4">
          {!isSolo && <h2 className="text-xl font-bold text-white">{data.team.name}</h2>}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
              {isSolo ? "Participant" : "Members"}
            </h4>
            {data.members.map((m) => (
              <div key={m.user_id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{m.full_name}</span>
                    {!isSolo && m.is_captain && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 rounded">LEADER</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 font-mono">{m.solstice_id}</div>
                </div>
              </div>
            ))}
          </div>

          {!isLocked && (
            <div className="mt-auto space-y-3">
              {data.team.is_captain && !isSolo && (
                <Button onClick={() => setIsEditing(true)} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                  Edit Members
                </Button>
              )}
              {data.team.is_captain && (
                <Button onClick={handleUnregister} variant="destructive" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  {isSolo ? "Unregister" : "Delete Team"}
                </Button>
              )}
              {!data.team.is_captain && (
                <Button onClick={handleLeave} variant="destructive" className="w-full">
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
              Editing team members. Ensure everyone is eligible.
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2">
            {editMembers.map((id, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={id}
                  onChange={(e) => updateField(idx, e.target.value)}
                  className="font-mono uppercase bg-white/5 border-white/10"
                  placeholder="TS-XXXX"
                />
                <Button variant="ghost" size="icon" onClick={() => removeField(idx)}>
                  <Trash2 className="text-red-400" size={16} />
                </Button>
              </div>
            ))}
            {editMembers.length < maxSize && (
              <Button variant="outline" size="sm" onClick={addField} className="w-full border-dashed">
                + Add Member
              </Button>
            )}
          </div>
          <div className="mt-auto flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button className="flex-1 bg-cyan-500 text-black font-bold" onClick={handleSaveChanges} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}