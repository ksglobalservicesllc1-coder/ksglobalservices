"use server";

import { sendEmail } from "@/lib/email/sendEmail";

export async function handleContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  try {
    await sendEmail({
      to: "ksglobalservicesllc1@gmail.com",
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #1e3a8a;">New Inquiry from KS Global Services</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send message." };
  }
}
