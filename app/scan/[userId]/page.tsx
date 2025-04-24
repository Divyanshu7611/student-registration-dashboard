"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { markAttendance } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";

export default function ScanPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    user?: {
      name: string;
      rollNumber: string;
    };
  } | null>(null);

  useEffect(() => {
    async function processAttendance() {
      try {
        const result = await markAttendance(params.userId);
        if (result.error) {
          if (result.error === "Unauthorized access") {
            toast({
              title: "Unauthorized Access",
              description: "Unauthorized access",
            });
            router.push("/login");
          }
          setResult(result);
          return;
        }
        setResult(result);
      } catch (err: any) {
        if (err.message === "Unauthorized access") {
          toast({
            title: "Unauthorized Access",
            description: "Unauthorized access",
          });
          router.push("/login");
        }
        setResult({
          success: false,
          message: "Failed to process attendance. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }

    processAttendance();
  }, [params.userId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              Attendance Verification
            </CardTitle>
            <CardDescription className="text-center">
              Processing your attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Processing attendance...</p>
              </div>
            ) : result ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  {result.success ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {result.success ? "Success!" : "Error!"}
                </h3>
                <p className="mb-4">{result.message}</p>

                {result.user && (
                  <div className="bg-muted p-4 rounded-lg mb-4 text-left">
                    <p>
                      <strong>Name:</strong> {result.user.name}
                    </p>
                    <p>
                      <strong>Roll Number:</strong> {result.user.rollNumber}
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <Link href="/">
                    <Button>Return to Home</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {(result as any)?.error === "Unauthorized access" ? (
                  <p className="text-red-500 font-bold">Unauthorized Access</p>
                ) : (
                  <p>Something Went Wrong</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
