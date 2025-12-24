"use client";

import React, { useState } from "react";
import { toast } from "sonner";

type TeamregformProps = {
  eventId: string;
  captainId: string;
  captainName?: string | null;
  minSize?: number;
  maxSize?: number;
  onSuccess?: (teamId: string) => void;
  actionPath?: string;
  useEmails?: boolean;
  onBack?: () => void;        // for flipping back
};

export default function Teamregform({
  eventId,
  captainId,
  captainName,
  minSize = 1,
  maxSize,
  onSuccess,
  actionPath,
  useEmails = true,
  onBack,
}: TeamregformProps) {

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>(
    Array.from({ length: minSize }, () => ""),
  );
  const [leaderEmail, setLeaderEmail] = useState<string>(captainName || "");
  const [leaderValidation, setLeaderValidation] =
    useState<{ ok: boolean; message?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  React.useEffect(() => {
    if (captainName) setLeaderEmail(captainName);
  }, [captainName]);

  function updateMember(i: number, val: string) {
    setMembers((prev) => prev.map((m, idx) => (idx === i ? val : m)));
  }

  function addMember() {
    setMembers((prev) => {
      if (maxSize && prev.length >= maxSize) {
        toast.error(`Maximum team size is ${maxSize}`);
        return prev;
      }
      return [...prev, ""];
    });
  }

  function removeMember(i: number) {
    setMembers((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filtered = members.map((m) => m.trim()).filter(Boolean);

    if (!teamName.trim()) {
      toast.error("Team name required");
      return;
    }
    if (filtered.length < minSize) {
      toast.error(`Need at least ${minSize} member${minSize > 1 ? "s" : ""}`);
      return;
    }
    if (maxSize && filtered.length > maxSize) {
      toast.error(`Cannot exceed ${maxSize} members`);
      return;
    }

    // Frontend-only: simulate async request and always succeed (mock)
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast.success("Team registered (mock)");
      onSuccess?.(`mock-team-${Date.now()}`);
    }, 700);
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-2xl font-semibold">Team Registration</h2>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm px-3 py-1 rounded-full border border-white/40 hover:bg-white/10"
          >
            Back
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 px-6 pb-8 pt-4 overflow-auto space-y-4"
      >
        {/* Team name */}
        <div className="space-y-1 text-left">
          <label className="text-base font-medium">Team Name</label>
          <input
            className="w-full border border-white/20 bg-black/20 rounded px-3 py-2 text-base outline-none focus:border-cyan-400"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
          />
        </div>

        {/* Leader email */}
        <div className="space-y-1 text-left">
          <label className="text-base font-medium">Team Leader (email)</label>
          <input
            className="w-full border border-white/20 bg-black/20 rounded px-3 py-2 text-base outline-none focus:border-cyan-400"
            value={leaderEmail}
            onChange={(e) => {
              setLeaderEmail(e.target.value);
              setLeaderValidation(null);
            }}
            onBlur={() => {
              const v = (leaderEmail || "").trim().toLowerCase();
              if (!v) {
                setLeaderValidation({ ok: false, message: "Leader email required" });
                return;
              }
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
                setLeaderValidation({ ok: false, message: "Invalid email format" });
                return;
              }
              // Frontend-only: assume valid if format checks out
              setLeaderValidation({ ok: true });
            }}
          />
          {leaderValidation && !leaderValidation.ok && (
            <div className="text-xs text-red-400">
              {leaderValidation.message}
            </div>
          )}
        </div>

        {/* Members */}
        {maxSize === 0 && minSize === 0 ? (
          <div className="text-sm text-gray-300">
            Solo event – no additional members required.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">
                Team Members ({useEmails ? "Emails" : "User IDs"})
              </label>
              <button
                type="button"
                onClick={addMember}
                disabled={!!maxSize && members.length >= maxSize}
                className="text-xs px-2 py-1 rounded bg-black text-white disabled:opacity-40"
              >
                Add Member
              </button>
            </div>
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="w-full border border-white/20 bg-black/20 rounded px-3 py-2 text-base outline-none focus:border-cyan-400"
                  value={m}
                  onChange={(e) => updateMember(i, e.target.value)}
                  placeholder={`Member #${i + 1} ${
                    useEmails ? "email" : "user ID"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="text-sm px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                  disabled={members.length <= minSize}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 disabled:opacity-50"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
