"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Helper to format ISO date for datetime-local input (YYYY-MM-DDTHH:mm)
const formatDateForInput = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

interface EventFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  event?: any;
}

export function EventForm({ onCancel, onSave, event }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    // Default must match one of your DB Enums
    category: "Coding and Development",
    mode: "Offline",
    venue: "",
    imageUrl: "",
    prize_pool: "",
    min_team_size: 1,
    max_team_size: 1,
    starts_at: "",
    ends_at: "",
    registration_starts_at: "",
    rulebook_url: ""
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        shortDescription: event.shortDescription || "",
        longDescription: event.longDescription || "",
        // Ensure fallback matches DB Enum
        category: event.category || "Coding and Development",
        mode: event.mode || "Offline",
        venue: event.venue || "",
        imageUrl: event.imageUrl || "",
        prize_pool: event.prize_pool || "",
        min_team_size: event.min_team_size || 1,
        max_team_size: event.max_team_size || 1,
        starts_at: formatDateForInput(event.starts_at),
        ends_at: formatDateForInput(event.ends_at),
        registration_starts_at: formatDateForInput(event.registration_starts_at),
        rulebook_url: event.rulebook_url || ""
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">

      {/* Row 1: Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name" name="name"
            value={formData.name} onChange={handleChange} required
            className="bg-white/5 border-white/10 focus:border-cyan-500/50"
            placeholder="e.g. Hackathon 2026"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {/* EXACT MATCHES TO YOUR DB ENUM */}
              <SelectItem value="Coding and Development">Coding and Development</SelectItem>
              <SelectItem value="Robotics and Hardware">Robotics and Hardware</SelectItem>
              <SelectItem value="Finance and Strategy">Finance and Strategy</SelectItem>
              <SelectItem value="Quizzes and Tech Games">Quizzes and Tech Games</SelectItem>
              <SelectItem value="Creative and Design">Creative and Design</SelectItem>
              <SelectItem value="Gaming Zone">Gaming Zone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Mode & Venue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mode">Event Mode</Label>
          <Select
            value={formData.mode}
            onValueChange={(val) => setFormData(prev => ({ ...prev, mode: val }))}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              {/* EXACT MATCHES TO YOUR DB ENUM */}
              <SelectItem value="Offline">Offline</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue" name="venue"
            value={formData.venue} onChange={handleChange} required
            className="bg-white/5 border-white/10"
            placeholder="e.g. Main Auditorium"
          />
        </div>
      </div>

      {/* Row 3: Team Size Limits */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_team_size">Min Members</Label>
          <Input
            type="number" id="min_team_size" name="min_team_size"
            value={formData.min_team_size} onChange={handleChange} min={1} required
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_team_size">Max Members</Label>
          <Input
            type="number" id="max_team_size" name="max_team_size"
            value={formData.max_team_size} onChange={handleChange} min={1} required
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>

      {/* Row 4: Descriptions */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description (Card)</Label>
        <Input
          id="shortDescription" name="shortDescription"
          value={formData.shortDescription} onChange={handleChange}
          className="bg-white/5 border-white/10"
          placeholder="Brief summary for the event card..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description (Details)</Label>
        <Textarea
          id="longDescription" name="longDescription"
          value={formData.longDescription} onChange={handleChange} rows={4}
          className="bg-white/5 border-white/10"
          placeholder="Full event details, rules, and rounds..."
        />
      </div>

      {/* Row 5: Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="starts_at">Event Starts</Label>
          <Input
            type="datetime-local" id="starts_at" name="starts_at"
            value={formData.starts_at} onChange={handleChange} required
            className="bg-white/5 border-white/10 text-neutral-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ends_at">Event Ends</Label>
          <Input
            type="datetime-local" id="ends_at" name="ends_at"
            value={formData.ends_at} onChange={handleChange} required
            className="bg-white/5 border-white/10 text-neutral-300"
          />
        </div>
      </div>

      {/* Row 6: Registration & Prize */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration_starts_at">Registration Opens</Label>
          <Input
            type="datetime-local" id="registration_starts_at" name="registration_starts_at"
            value={formData.registration_starts_at} onChange={handleChange}
            className="bg-white/5 border-white/10 text-neutral-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prize_pool">Prize Pool (₹)</Label>
          <Input
            id="prize_pool" name="prize_pool"
            value={formData.prize_pool} onChange={handleChange}
            className="bg-white/5 border-white/10"
            placeholder="e.g. 50,000"
          />
        </div>
      </div>

      {/* Row 7: Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Banner Image URL</Label>
          <Input
            id="imageUrl" name="imageUrl"
            value={formData.imageUrl} onChange={handleChange}
            className="bg-white/5 border-white/10"
            placeholder="/events/banner.jpg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rulebook_url">Rulebook URL</Label>
          <Input
            id="rulebook_url" name="rulebook_url"
            value={formData.rulebook_url} onChange={handleChange}
            className="bg-white/5 border-white/10"
            placeholder="https://drive.google.com/..."
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-white/10 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="hover:bg-white/10 text-neutral-400 hover:text-white">
          Cancel
        </Button>
        <Button type="submit" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8">
          {event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}