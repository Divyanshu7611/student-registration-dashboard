// "use server";

// import path from "path";
// import { sendMail } from "@/lib/email";
// import { recruiterInvitationTemplate } from "@/mail/InvitationMail";

// export async function sendInvitationAction(email: string) {
//     console.log("Sending invitation to:", email);


//   if (!email || !email.includes("@")) {
//     return { success: false, error: "Valid email is required" };
//   }

//   // Brochure path is always fixed
//   const brochurePath = path.join(process.cwd(), "public", "placement-brochure.pdf");

//   const result = await sendMail({
//     to: email,
//     subject: "Invitation for Campus Placement Drive - RTU Kota 2026 Batch",
//     html: recruiterInvitationTemplate(),
//     attachments: [
//       {
//         filename: "RTU_Placement_Brochure.pdf",
//         path: brochurePath,
//         contentType: "application/pdf",
//       },
//     ],
//   });

//   return result.success
//     ? { success: true, message: "Email sent successfully" }
//     : { success: false, error: result.error || "Failed to send email" };
// }




"use server";

import { sendMail } from "@/lib/email";
import { recruiterInvitationTemplate } from "@/mail/InvitationMail";

export async function sendInvitationAction(email: string) {
  console.log("Sending invitation to:", email);

  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email is required" };
  }

  try {
    // Use public URL instead of file path
    const brochureUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://student-dashboard-sable.vercel.app"}/placement-brochure.pdf`;

    // Fetch file as Buffer
    const response = await fetch(brochureUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch brochure from ${brochureUrl}`);
    }
    const brochureBuffer = Buffer.from(await response.arrayBuffer());

    // Send email with attachment
    const result = await sendMail({
      to: email,
      subject: "Invitation for Campus Placement Drive - RTU Kota 2026 Batch",
      html: recruiterInvitationTemplate(),
      attachments: [
        {
          filename: "RTU_Placement_Brochure.pdf",
          content: brochureBuffer, // Use buffer instead of path
          contentType: "application/pdf",
        },
      ],
    });

    return result.success
      ? { success: true, message: "Email sent successfully" }
      : { success: false, error: result.error || "Failed to send email" };

  } catch (err:any) {
    console.error("Error sending invitation:", err);
    return { success: false, error: err.message };
  }
}
