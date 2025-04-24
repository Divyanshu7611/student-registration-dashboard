'use server'
import Event from "@/models/Event";
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Students from '@/models/Students'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import { any } from 'zod';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/email';
import { registrationTemplate } from '@/mail/studentRegistration';
import { AttendanceTemplate } from "@/mail/StudentAttendanceMail";
import { reminderEmailTemplate } from "@/mail/Remind";




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



import { toZonedTime, format } from "date-fns-tz";
import { QrCode } from 'lucide-react';
import { yearsToDays } from 'date-fns';
import { eventNames } from "process";

const indiaTimeZone = "Asia/Kolkata"; // IST

export async function markStudentAttendence(userId: string) {
  try {
    await connectToDatabase();
 

    let user = await Students.findOne({
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
    });


    if(!user){
      return { success: false, error: 'User not found' };

    }

    // ✅ Convert today's date to IST (without time)
    const todayIST = format(toZonedTime(new Date(), indiaTimeZone), 'yyyy-MM-dd');

    // ✅ Check if attendance is already marked for today
    const attendanceToday = user.attendance.find((a: any) => {
      const attendanceDateIST = format(
        toZonedTime(new Date(a.date), indiaTimeZone),
        'yyyy-MM-dd'
      );

      return attendanceDateIST === todayIST; // Compare only the date part
    });

    if (attendanceToday) {
      return {
        success: true,
        message: 'Attendance already marked for today',
        user: {
          id: user._id.toString(),
          name: user.name,
          rollNumber: user.rollNumber
        }
      };
    }

    // ✅ Store attendance date in UTC (safe for database)
    user.attendance.push({
      date: new Date().toISOString(),
      present: true
    });

    await user.save();
    const html = AttendanceTemplate(user.name,user.rollNumber,user.eventName)
    const mailResponse = await sendMail({
      to: user.email,
      subject: 'Thanks For Attending the Event',
      html
    });
    revalidatePath('/Student-Attendance');

    return {
      success: true,
      message: 'Attendance marked successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        rollNumber: user.rollNumber
      }
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'Failed to mark attendance' };
  }
}




export async function RemainerStudents(id: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(id);
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    const students = await Students.find({ eventName: event.eventName });
    if (!students || students.length === 0) {
      return { success: false, message: 'No students found for this event' };
    }

    const mailPromises = students.map((student: any) =>
      sendMail({
        to: student.email,
        subject: `Reminder: PTP - ${event.eventName}`,
        html: reminderEmailTemplate(student.name, event.eventName, "PTP - HALL", "3:00 PM"),
      })
    );

    await Promise.all(mailPromises);

    return { success: true, message: 'Reminder emails sent successfully' };
  } catch (error) {
    console.error('Error in RemainerStudents:', error);
    return { success: false, message: 'Something went wrong' };
  }
}
