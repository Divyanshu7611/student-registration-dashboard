
"use client";

import { useEffect, useState } from "react";
import { getAllRecruitments, review as reviewStudent } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  universityRollNo: string;
  year: string;
  eventName: string;
  phoneNumber: string;
  qrCode: string;
  attendance: any[];
  cgpa: string;
  back: string;
  summary: string;
  clubs: string;
  aim: string;
  believe: string;
  expect: string;
  domain: string[];
  review?: number;
  comment?: string;
  roundOneAttendance?: boolean;
  roundTwoAttendance?: boolean;
  roundOneQualified?: boolean;
  roundTwoQualified?: boolean;
}

export default function AdminReviewPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const res = await getAllRecruitments();
    if (res.success) {
      setStudents(res.students ?? []);
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
    setLoading(false);
  };

  const handleUpdate = async (student: Student) => {
    const data = {
      studentId: student.id,
      review: student.review,
      comment: student.comment,
      roundOneAttendance: student.roundOneAttendance,
      roundTwoAttendance: student.roundTwoAttendance,
      roundOneQualified: student.roundOneQualified,
      roundTwoQualified: student.roundTwoQualified,
    };
    const res = await reviewStudent(data);
    if (res.success) {
      toast({ title: "Success", description: "Student updated successfully" });
      fetchStudents();
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
  };

  const handleInputChange = (id: string, field: string, value: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
     
        

    <div className="container mx-auto p-4">
       <div className="flex justify-end">
 <Link href="/">
                    <Button variant="ghost" size="sm" >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
      </div>
     
      <h1 className="text-2xl font-bold mb-4">Admin: Review Students</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
               <th className="px-2 py-1 border bg-gray-500">Name</th>
<th className="px-2 py-1 border bg-gray-500">Roll Number</th>
<th className="px-2 py-1 border bg-gray-500">Email</th>
<th className="px-2 py-1 border bg-gray-500">Review (0-10)</th>
<th className="px-2 py-1 border bg-gray-500">Comment</th>
<th className="px-2 py-1 border bg-gray-500">Round 1 Attendance</th>
<th className="px-2 py-1 border bg-gray-500">Round 2 Attendance</th>
<th className="px-2 py-1 border bg-gray-500">Round 1 Qualified</th>
<th className="px-2 py-1 border bg-gray-500">Round 2 Qualified</th>
<th className="px-2 py-1 border bg-gray-500">Action</th>

              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-2 py-1 border">{student.name}</td>
                  <td className="px-2 py-1 border">{student.rollNumber}</td>
                  <td className="px-2 py-1 border">{student.email}</td>

                  <td className="px-2 py-1 border">
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={student.review ?? ""}
                      onChange={(e) =>
                        handleInputChange(student.id, "review", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border">
                    <Input
                      type="text"
                      value={student.comment ?? ""}
                      onChange={(e) =>
                        handleInputChange(student.id, "comment", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundOneAttendance ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundOneAttendance", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundTwoAttendance ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundTwoAttendance", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundOneQualified ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundOneQualified", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundTwoQualified ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundTwoQualified", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Button onClick={() => handleUpdate(student)}>Save</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    
  );
}
