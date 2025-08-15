"use server";

import path from "path";
import { sendMail } from "@/lib/email";
import { recruiterInvitationTemplate } from "@/mail/InvitationMail";

export async function sendInvitationAction(email: string) {
    console.log("Sending invitation to:", email);


  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email is required" };
  }

  // Brochure path is always fixed
  const brochurePath = path.join(process.cwd(), "public", "placement-brochure.pdf");

  const result = await sendMail({
    to: email,
    subject: "Invitation for Campus Placement Drive - RTU Kota 2026 Batch",
    html: recruiterInvitationTemplate(),
    attachments: [
      {
        filename: "RTU_Placement_Brochure.pdf",
        path: brochurePath,
        contentType: "application/pdf",
      },
    ],
  });

  return result.success
    ? { success: true, message: "Email sent successfully" }
    : { success: false, error: result.error || "Failed to send email" };
}



