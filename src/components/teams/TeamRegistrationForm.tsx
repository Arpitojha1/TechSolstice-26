"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  eventId: string;
  eventName: string;
  minSize: number;
  maxSize: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function TeamRegistrationForm({
  eventId, eventName, minSize, maxSize, onBack, onSuccess
}: Props) {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [teammateIds, setTeammateIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isSolo = maxSize === 1;

  const addTeammate = () => { if (teammateIds.length + 1 < maxSize) setTeammateIds([...teammateIds, ""]); };
  const removeTeammate = (index: number) => { const newIds = [...teammateIds]; newIds.splice(index, 1); setTeammateIds(newIds); };
  const updateTeammateId = (index: number, value: string) => { const newIds = [...teammateIds]; newIds[index] = value.toUpperCase().trim(); setTeammateIds(newIds); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isSolo && !teamName.trim()) {
        alert("Please enter a Team Name"); setLoading(false); return;
      }

      const validTeammateIds = teammateIds.filter(id => id.trim() !== "");

      if (!isSolo && (validTeammateIds.length + 1) < minSize) {
        alert(`This event requires at least ${minSize} members.`); setLoading(false); return;
      }

      const { data, error } = await supabase.rpc('register_team', {
        p_event_id: eventId,
        p_team_name: isSolo ? null : teamName,
        p_teammate_codes: validTeammateIds
      });

      if (error) throw error;

      if (data.success) {
        alert(isSolo ? "Registered Successfully!" : `Team Created Successfully!`);
        router.refresh();
        onSuccess();
      } else {
        alert("Registration Failed: " + data.message);
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-[#0a0a0a] text-white">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-neutral-400">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h3 className="text-lg font-bold text-cyan-400 leading-none">
            {isSolo ? "Solo Entry" : "Create Team"}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{eventName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
        {!isSolo && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400 ml-1">Team Name</label>
            <Input
              placeholder="e.g. Code Warriors"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        )}

        {!isSolo && (
          <div className="space-y-3">
            <div className="flex justify-between items-end pb-1 border-b border-white/5">
              <label className="text-xs font-medium text-neutral-400 ml-1">Teammates (Solstice IDs)</label>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-cyan-400">
                {teammateIds.length + 1} / {maxSize} Members
              </span>
            </div>
            {teammateIds.map((id, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="TS-XXXXXX"
                  value={id}
                  onChange={(e) => updateTeammateId(index, e.target.value)}
                  className="bg-white/5 border-white/10 font-mono uppercase text-sm"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeTeammate(index)}>
                  <Trash2 size={16} className="text-red-400" />
                </Button>
              </div>
            ))}
            {teammateIds.length + 1 < maxSize && (
              <Button type="button" variant="outline" size="sm" onClick={addTeammate} className="w-full border-dashed text-xs h-9">
                <Plus size={14} className="mr-2" /> Add Teammate
              </Button>
            )}
          </div>
        )}

        <div className="mt-auto bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl text-xs text-blue-200/80 leading-relaxed">
          {isSolo ? (
            <p>You are registering as an individual. Your Solstice ID will be used for entry.</p>
          ) : (
            <p>You will be the team Captain. Add your friends' Solstice IDs now, or edit the team later.</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-70">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : (isSolo ? "Confirm Registration" : "Create Team")}
        </Button>
      </form>
    </div>
  );
}