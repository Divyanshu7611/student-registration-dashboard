"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createEvent, getEvents, deleteEvent as deleteEventAction,RemainerStudents } from "@/app/actions/events";

interface Attendance {
  name: string;
  email: string;
  rollNo: string;
  present: boolean;
}

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  attendance: Attendance[];
}

export default function EventManager() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await getEvents();
    if (res) {
      setEvents(res);
    } else {
      toast.error("Failed to fetch events");
    }
    setLoading(false);
  }

  async function createPTPEvent() {
    if (!eventName || !eventDate) {
      toast.error("Please fill in all fields");
      return;
    }
    if (new Date(eventDate) < new Date()) {
      toast.error("Event date cannot be in the past");
      return;
    }

    const res = await createEvent(eventName, eventDate);

    if (res?.ok) {
      toast.success("Event created successfully!");
      setEventName("");
      setEventDate("");
      fetchEvents(); // 👈 Refresh the list only
    } else {
      toast.error("Failed to create event");
    }
  }
  async function handleReminderEvent(id: string){
    const res = await RemainerStudents(id)
    if(res?.success){
      toast.success("Student Reminded Successfully")
      fetchEvents()
    }else{
      toast.error("Failed to reminded")
    }

  }

  async function handleDeleteEvent(id: string) {
    const res = await deleteEventAction(id);
    if (res?.ok) {
      toast.success("Event deleted successfully!");
      fetchEvents(); // 👈 Update the list automatically
    } else {
      toast.error("Failed to delete event");
    }
  }

  return (
    <Tabs defaultValue="create" className="w-full mb-10">
      <TabsList className="mb-4">
        <TabsTrigger value="create">New Event</TabsTrigger>
        <TabsTrigger value="list">All Events</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              type="date"
            />
            <Button onClick={createPTPEvent}>Create Event</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="list">
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground">No events found.</p>
            ) : (
              events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">{event.eventName}</h3>
                    <p className="text-sm">Date: {event.eventDate}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        Download Attendance
                      </Button>
                      <Button variant="destructive" className="hover hover:bg-red-700 hover:text-white" onClick={()=>handleReminderEvent(event._id)}>
                        Reminder
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
