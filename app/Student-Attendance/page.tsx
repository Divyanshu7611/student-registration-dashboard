'use client'
import React from 'react'
import { useState,useEffect } from 'react';
import { toast, useToast } from '@/hooks/use-toast';
import { markAttendance, getAllUsers, logout } from '@/app/actions/user';
import {Html5QrcodeScanner} from 'html5-qrcode';
import { Card,CardContent,CardHeader,CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert,AlertTitle,AlertDescription } from '@/components/ui/alert';
import { QrCode,CheckCircle,XCircle } from 'lucide-react';
import { markStudentAttendence } from '../actions/events';


export default function page() {
    const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string; user?: any }>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerSupported, setScannerSupported] = useState(true);


    const handleScan = async (decodedText: string) => {
    if (!decodedText) return;
    setScanning(false);

    try {
      const url = decodedText.trim();
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split("/");
      const userId = segments.pop();
      console.log("User UserID ",userId)

      if (!userId) {
        setScanResult({ success: false, message: "Invalid QR code" });
        return;
      }

      const attendanceResult = await markStudentAttendence(userId);
      setScanResult({
        success: attendanceResult.success,
        message: attendanceResult.message || attendanceResult.error || "Unknown error",
        user: attendanceResult.user,
      });

      if (attendanceResult.success) {
        toast({ title: "Success", description: attendanceResult.message });

        const usersResult = await getAllUsers();
        if (usersResult.success) setUsers(usersResult.users || []);
      } else {
        throw new Error(attendanceResult.error || "Failed to mark attendance");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false // Set verbose mode (true for debugging, false for normal use)
      );
      
      scanner.render(handleScan, (errorMessage:any) => {
        console.warn(errorMessage);
      });

      return () => {
        scanner.clear();
      };
    }
  }, [scanning]);

  const handleError = (err: any) => {
    console.error(err);
    toast({
      variant: "destructive",
      title: "Scanner Error",
      description: "Could not access camera or scanner encountered an error",
    });
    setScanning(false);
  };

  return (
    <div className='flex justify-between items-center flex-col'>
        <h1 className='mx-auto font-bold md:text-4xl text-2xl mt-32'>Student Attendence</h1>

        <div className='mt-16'>
        <Card>
              <CardHeader>
                <CardTitle>QR Scanner</CardTitle>
                <CardDescription>Scan student QR codes to mark attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {scanning ? (
                  <div>
                    <div id="qr-reader" className="w-full h-64" />
                    <Button variant="outline" className="w-full mt-4" onClick={() => setScanning(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    {scanResult && (
                      <Alert variant={scanResult.success ? "default" : "destructive"} className="mb-4">
                        {scanResult.success ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                        <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
                        <AlertDescription>{scanResult.message}</AlertDescription>
                      </Alert>
                    )}
                    <Button className="w-full" onClick={() => setScanning(true)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                )}
                
              </CardContent>
            </Card>
        </div>
    </div>
  )
}
