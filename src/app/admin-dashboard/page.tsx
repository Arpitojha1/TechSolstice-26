"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/admin/event-form";
import { type Event } from "@/components/event-card";

// A simple skeleton loader for the table
const TableSkeleton = () => (
  <div className="border rounded-lg p-4">
    <div className="h-8 w-1/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
    <div className="space-y-2">
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (formData: Omit<Event, "id">) => {
    const isUpdating = !!selectedEvent;
    const url = "/api/events";
    const method = isUpdating ? "PATCH" : "POST";

    const payload = isUpdating
      ? { ...formData, id: selectedEvent.id }
      : formData;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isUpdating ? "update" : "create"} event`
        );
      }

      await fetchEvents();
      setIsFormOpen(false);
      setSelectedEvent(null);
      alert("Event saved successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    console.log("CLIENT DELETE ID : ", id);
  

    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE", body: JSON.stringify({ id })});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }
      
      // Refetch post deletion
      await fetchEvents();
      alert("Event deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const openCreateForm = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const openEditForm = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  if (loading) return <div className="container mx-auto py-10"><TableSkeleton /></div>;
  if (error) return <div className="container mx-auto py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Button onClick={openCreateForm}>Create New Event</Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(event)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>  
          </DialogHeader>
          <EventForm
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedEvent(null);
            }}
            onSave={handleSave}
            event={selectedEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}