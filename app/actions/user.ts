'use server';

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import { any } from 'zod';
import jwt from 'jsonwebtoken';
import { useToast } from '@/hooks/use-toast';

export async function registerUser(userData: { name: string; email: string; rollNumber: string }) {
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { rollNumber: userData.rollNumber }
      ]
    });
    
    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email or roll number already exists'
      };
    }
    
    // Generate QR code URL (this will be the URL to verify attendance)
    const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scan/${userId}`;
    
    // Create new user
    const newUser = new User({
      ...userData,
      qrCode: qrCodeUrl
    });
    
    await newUser.save();
    
    revalidatePath('/dashboard');
    
    return {
      success: true,
      userId: newUser._id.toString()
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: 'Failed to register user'
    };
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

export async function getUserByRollNumber(rollNumber: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ rollNumber });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

export async function markAttendance(userId: string) {
  try {
    await connectToDatabase();
    const { toast } = useToast();
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      
      return { success: false, error: 'Unauthorized access' };
    }

    const decodedToken: any = jwt.decode(token);
    if (decodedToken?.role !== 'admin') {
      
      return { success: false, error: 'Unauthorized access' };
    }

    
    const user = await User.findOne({qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scan/${userId}`});
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if attendance already marked for today
    const attendanceToday = user.attendance.find((a:any) => {
      const attendanceDate = new Date(a.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return attendanceDate.getTime() === today.getTime();
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
    
    // Mark attendance
    user.attendance.push({
      date: today,
      present: true
    });
    
    await user.save();
    revalidatePath('/admin/scanner');
    
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

export async function getAllUsers() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ name: 1 });
    
    return {
      success: true,
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        attendance: user.attendance,
      }))
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function adminLogin(username: string, password: string) {
  try {
    // Fixed admin credentials (in a real app, these would be in env variables)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@rtu';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rtu@superadmin@2025';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = generateToken({ 
        id: 'admin',
        username,
        role: 'admin'
      });
      
      // Set cookie
      cookies().set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, error: 'Login failed' };
  }
}

export async function logout() {
  cookies().delete('auth-token');
  return { success: true };
}