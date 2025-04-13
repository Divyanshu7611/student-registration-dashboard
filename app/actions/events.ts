'use server'
import Event from "@/models/Event";




export async function createEvent(eventName: string, eventDate: string) {
  try {
    const newEvent = new Event({ eventName, eventDate });
    await newEvent.save();
    console.log("Event created:", newEvent);
    return newEvent;
    
  } catch (error) {
    console.error("Error creating event:", error);

  }
}


export async function getEvents() {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    console.log('Event Data',events)
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}


export async function deleteEvent(id: string) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      console.error("Event not found:", id);
      return null;
    }
    console.log("Event deleted:", deletedEvent);
    return deletedEvent;
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}