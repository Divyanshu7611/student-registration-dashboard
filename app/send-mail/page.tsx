"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendInvitationAction } from "@/app/actions/invitation";

export default function SendRegistrationMail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const res = await sendInvitationAction(email);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setEmail("");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg my-auto space-y-4">
      <h2 className="text-xl font-bold">Send Registration Mail</h2>
      <Input
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={sendMail} disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
      </Button>
    </div>
  );
}
