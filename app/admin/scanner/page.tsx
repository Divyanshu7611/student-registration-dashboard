// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { GraduationCap, ArrowLeft, QrCode, CheckCircle, XCircle, LogOut } from 'lucide-react';
// import { format } from 'date-fns';
// import { useToast } from '@/hooks/use-toast';
// import { markAttendance, getAllUsers, logout } from '@/app/actions/user';

// export default function ScannerPage() {
//   const router = useRouter();
//   const { toast } = useToast();
  
//   const [scanning, setScanning] = useState(false);
//   const [scanResult, setScanResult] = useState<null | { success: boolean; message: string; user?: any }>(null);
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [scannerSupported, setScannerSupported] = useState(true);

//   useEffect(() => {
//     // Check if we're in a browser environment
//     if (typeof window !== 'undefined') {
//       // Dynamically import the QR scanner component
//       import('react-qr-reader').then(({ QrReader }) => {
//         setScannerSupported(true);
//       }).catch(err => {
//         console.error("QR Scanner not supported:", err);
//         setScannerSupported(false);
//       });
//     }

//     // Fetch all users
//     async function fetchUsers() {
//       const result = await getAllUsers();
//       if (result.success) {
//         setUsers(result.users || []);
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: result.error || "Failed to fetch users",
//         });
//       }
//       setLoading(false);
//     }

//     fetchUsers();
//   }, [toast]);

//   const handleScan = async (data: string | null) => {
//     if (data) {
//       setScanning(false);
      
//       // Extract user ID from QR code URL
//       const urlParts = data.split('/');
//       const userId = urlParts[urlParts.length - 1];
      
//       if (!userId) {
//         setScanResult({
//           success: false,
//           message: "Invalid QR code"
//         });
//         return;
//       }
      
//       const result = await markAttendance(userId);
//       setScanResult({
//         ...result,
//         message: result.message || result.error || "Unknown error"
//       });
      
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: result.message,
//         });
        
//         // Refresh user list
//         const usersResult = await getAllUsers();
//         if (usersResult.success) {
//           setUsers(usersResult.users || []);
//         }
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: result.error || "Failed to mark attendance",
//         });
//       }
//     }
//   };

//   const handleError = (err: any) => {
//     console.error(err);
//     toast({
//       variant: "destructive",
//       title: "Scanner Error",
//       description: "Could not access camera or scanner encountered an error",
//     });
//     setScanning(false);
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
//   };

//   // Function to count attendance for today
//   const getTodayAttendanceCount = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     return users.filter(user => 
//       user.attendance && user.attendance.some((a: any) => {
//         const attendanceDate = new Date(a.date);
//         attendanceDate.setHours(0, 0, 0, 0);
//         return attendanceDate.getTime() === today.getTime();
//       })
//     ).length;
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <header className="border-b">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <GraduationCap className="h-6 w-6" />
//             <h1 className="text-xl font-bold">Placement Cell</h1>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Link href="/">
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Home
//               </Button>
//             </Link>
//             <Button variant="outline" size="sm" onClick={handleLogout}>
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          
//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Total Students</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{users.length}</p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Today's Attendance</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{getTodayAttendanceCount()}</p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Attendance Rate</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">
//                   {users.length > 0 
//                     ? `${Math.round((getTodayAttendanceCount() / users.length) * 100)}%` 
//                     : '0%'}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
          
//           <div className="grid md:grid-cols-2 gap-6 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>QR Scanner</CardTitle>
//                 <CardDescription>Scan student QR codes to mark attendance</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {scanning ? (
//                   <div className="overflow-hidden rounded-lg">
//                     {scannerSupported ? (
//                       <div className="aspect-square max-w-xs mx-auto">
//                         {/* Dynamic import of QrReader */}
//                         {typeof window !== 'undefined' && (() => {
//                           const QrReader = require('react-qr-reader').QrReader;
//                           return (
//                             <QrReader
//                               delay={300}
//                               onError={handleError}
//                               onScan={handleScan}
//                               style={{ width: '100%' }}
//                               constraints={{ facingMode: 'environment' }}
//                             />
//                           );
//                         })()}
//                       </div>
//                     ) : (
//                       <div className="text-center p-4">
//                         <p>QR scanner not supported in this environment.</p>
//                       </div>
//                     )}
//                     <Button 
//                       variant="outline" 
//                       className="w-full mt-4"
//                       onClick={() => setScanning(false)}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     {scanResult ? (
//                       <div className="mb-4">
//                         <Alert variant={scanResult.success ? "default" : "destructive"}>
//                           <div className="flex items-center">
//                             {scanResult.success ? (
//                               <CheckCircle className="h-4 w-4 mr-2" />
//                             ) : (
//                               <XCircle className="h-4 w-4 mr-2" />
//                             )}
//                             <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
//                           </div>
//                           <AlertDescription>
//                             {scanResult.message}
//                             {scanResult.user && (
//                               <div className="mt-2">
//                                 <p><strong>Name:</strong> {scanResult.user.name}</p>
//                                 <p><strong>Roll Number:</strong> {scanResult.user.rollNumber}</p>
//                               </div>
//                             )}
//                           </AlertDescription>
//                         </Alert>
//                       </div>
//                     ) : null}
                    
//                     <Button 
//                       className="w-full"
//                       onClick={() => {
//                         setScanResult(null);
//                         setScanning(true);
//                       }}
//                     >
//                       <QrCode className="h-4 w-4 mr-2" />
//                       Start Scanning
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Today's Attendance</CardTitle>
//                 <CardDescription>Students present today</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {loading ? (
//                   <div className="text-center py-8">
//                     <p>Loading...</p>
//                   </div>
//                 ) : (
//                   <div className="max-h-[300px] overflow-y-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Roll Number</TableHead>
//                           <TableHead>Time</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {users
//                           .filter(user => {
//                             const today = new Date();
//                             today.setHours(0, 0, 0, 0);
                            
//                             return user.attendance && user.attendance.some((a: any) => {
//                               const attendanceDate = new Date(a.date);
//                               attendanceDate.setHours(0, 0, 0, 0);
//                               return attendanceDate.getTime() === today.getTime();
//                             });
//                           })
//                           .map(user => {
//                             const today = new Date();
//                             today.setHours(0, 0, 0, 0);
                            
//                             const todayAttendance = user.attendance.find((a: any) => {
//                               const attendanceDate = new Date(a.date);
//                               attendanceDate.setHours(0, 0, 0, 0);
//                               return attendanceDate.getTime() === today.getTime();
//                             });
                            
//                             return (
//                               <TableRow key={user.id}>
//                                 <TableCell>{user.name}</TableCell>
//                                 <TableCell>{user.rollNumber}</TableCell>
//                                 <TableCell>
//                                   {todayAttendance ? format(new Date(todayAttendance.date), 'h:mm a') : ''}
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })}
//                         {users.filter(user => {
//                           const today = new Date();
//                           today.setHours(0, 0, 0, 0);
                          
//                           return user.attendance && user.attendance.some((a: any) => {
//                             const attendanceDate = new Date(a.date);
//                             attendanceDate.setHours(0, 0, 0, 0);
//                             return attendanceDate.getTime() === today.getTime();
//                           });
//                         }).length === 0 && (
//                           <TableRow>
//                             <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
//                               No attendance records for today
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
          
//           <Tabs defaultValue="all">
//             <TabsList className="mb-4">
//               <TabsTrigger value="all">All Students</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="all">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Student Records</CardTitle>
//                   <CardDescription>
//                     Complete list of registered students
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="text-center py-8">
//                       <p>Loading...</p>
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Roll Number</TableHead>
//                             <TableHead>Email</TableHead>
//                             <TableHead>Total Attendance</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {users.map(user => (
//                             <TableRow key={user.id}>
//                               <TableCell>{user.name}</TableCell>
//                               <TableCell>{user.rollNumber}</TableCell>
//                               <TableCell>{user.email}</TableCell>
//                               <TableCell>{user.attendance ? user.attendance.length : 0}</TableCell>
//                             </TableRow>
//                           ))}
//                           {users.length === 0 && (
//                             <TableRow>
//                               <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
//                                 No students registered yet
//                               </TableCell>
//                             </TableRow>
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>

//       <footer className="border-t py-6">
//         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
//           © {new Date().getFullYear()} Placement Cell. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GraduationCap, ArrowLeft, QrCode, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { markAttendance, getAllUsers, logout } from "@/app/actions/user";

export default function ScannerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string; user?: any }>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.users || []);
        } else {
          throw new Error(result.error || "Failed to fetch users");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);

  const handleScan = async (decodedText: string) => {
    if (!decodedText) return;
    setScanning(false);

    try {
      const url = decodedText.trim();
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split("/");
      const userId = segments.pop();

      if (!userId) {
        setScanResult({ success: false, message: "Invalid QR code" });
        return;
      }

      const attendanceResult = await markAttendance(userId);
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
      
      scanner.render(handleScan, (errorMessage) => {
        console.warn(errorMessage);
      });

      return () => {
        scanner.clear();
      };
    }
  }, [scanning]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const todayAttendanceCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return users.filter((user) =>
      user.attendance?.some((a: any) => new Date(a.date).setHours(0, 0, 0, 0) === today.getTime())
    ).length;
  }, [users]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{todayAttendanceCount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {users.length > 0 ? `${Math.round((todayAttendanceCount / users.length) * 100)}%` : "0%"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>QR Scanner</CardTitle>
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
      </main>
    </div>
  );
}
