"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Supabase client for database operations only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Search,
  Trophy,
  Users,
  MapPin,
  Link as LinkIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/components/admin/event-form";

// Exact Schema Types
export type AdminEvent = {
  id: string;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  category: string;
  mode: "Offline" | "Online" | "Hybrid";
  venue: string | null;
  imageUrl: string | null;
  prize_pool: string | null;
  starts_at: string | null;
  ends_at: string | null;
  min_team_size: number;
  max_team_size: number;
  rulebook_url: string | null;
  is_reg_open: boolean;
  registration_starts_at: string | null;
};

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      if (status === 'loading' || !session?.user?.id) {
        return;
      }

      // Check if user exists in admins table
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) {
        // Not an admin - redirect to profile
        router.push('/profile');
      } else {
        setIsAdmin(true);
      }
    }

    checkAdminStatus();
  }, [session, status, router]);

  // --- FETCH DATA ---
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      alert("Failed to load events.");
    } else {
      setEvents(data as AdminEvent[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin]);

  // --- ACTIONS ---

  const handleToggleReg = async (id: string, currentStatus: boolean) => {
    // Optimistic Update
    setEvents(events.map(e => e.id === id ? { ...e, is_reg_open: !currentStatus } : e));

    const { error } = await supabase
      .from("events")
      .update({ is_reg_open: !currentStatus })
      .eq("id", id);

    if (error) {
      alert("Failed to update status");
      fetchEvents(); // Revert
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This will remove all registered teams too.")) return;

    // Optimistic Delete
    const previousEvents = [...events];
    setEvents(events.filter(e => e.id !== id));

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      alert("Error deleting event: " + error.message);
      setEvents(previousEvents);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      // --- CRITICAL FIX: Data Cleaning ---
      // Convert "" to null for Timestamps
      // Convert strings to Integers for Numbers
      const payload = {
        ...formData,
        starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
        registration_starts_at: formData.registration_starts_at ? new Date(formData.registration_starts_at).toISOString() : null,
        min_team_size: parseInt(formData.min_team_size) || 1,
        max_team_size: parseInt(formData.max_team_size) || 1,
        prize_pool: formData.prize_pool || null, // Convert empty prize to null
        imageUrl: formData.imageUrl || null,
        venue: formData.venue || null,
      };

      if (selectedEvent) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", selectedEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .insert([payload]);
        if (error) throw error;
      }

      await fetchEvents();
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error: any) {
      alert("Save failed: " + error.message);
    }
  };

  // --- FILTERING ---
  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.is_reg_open).length;

  // Show loading while checking admin status or fetching data
  if (status === 'loading' || isAdmin === null || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-cyan-400">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // If not admin, don't render anything (redirect happens in useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Event Control Center
          </h1>
          <p className="text-neutral-500 mt-1">Manage events, registrations, and logic.</p>
        </div>

        <div className="flex gap-4">
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-bold">{totalEvents} <span className="text-neutral-500 font-normal">Events</span></span>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <Users size={16} className="text-green-500" />
            <span className="text-sm font-bold">{activeEvents} <span className="text-neutral-500 font-normal">Active Regs</span></span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 rounded-xl text-white"
          />
        </div>
        <Button
          onClick={() => { setSelectedEvent(null); setIsFormOpen(true); }}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-neutral-400">Event</TableHead>
              <TableHead className="text-neutral-400">Type</TableHead>
              <TableHead className="text-neutral-400">Info</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  {/* Name & Mode */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{event.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] bg-white/5 text-neutral-400 border-white/10 h-5 px-1.5">
                          {event.mode}
                        </Badge>
                        {event.max_team_size === 1 && (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20 h-5 px-1.5">
                            SOLO
                          </Badge>
                        )}
                        {event.rulebook_url && (
                          <a href={event.rulebook_url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-cyan-400" title="View Rulebook">
                            <LinkIcon size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="outline" className="bg-white/5 text-neutral-300 border-white/10">
                      {event.category}
                    </Badge>
                  </TableCell>

                  {/* Date & Venue */}
                  <TableCell className="text-neutral-400 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-cyan-500/70" />
                        {event.starts_at
                          ? new Date(event.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : "TBA"}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-cyan-500/70" />
                        <span className="truncate max-w-[120px]" title={event.venue || ""}>
                          {event.venue || "TBA"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Toggle */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={event.is_reg_open}
                        onCheckedChange={() => handleToggleReg(event.id, event.is_reg_open)}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                      <span className={`text-xs font-bold tracking-wide ${event.is_reg_open ? "text-green-400" : "text-red-400"}`}>
                        {event.is_reg_open ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelectedEvent(event); setIsFormOpen(true); }}
                        className="hover:bg-cyan-500/10 hover:text-cyan-400 text-neutral-400 h-8 w-8"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="hover:bg-red-500/10 hover:text-red-400 text-neutral-400 h-8 w-8"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] bg-[#111] border-white/10 text-white p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-cyan-400">
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <EventForm
              onCancel={() => { setIsFormOpen(false); setSelectedEvent(null); }}
              onSave={handleSave}
              event={selectedEvent}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { memo } from 'react';
export default memo(AdminDashboard);