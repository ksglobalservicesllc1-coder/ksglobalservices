import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import client from "@/lib/db-client";
import { Booking } from "@/lib/models/Booking";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email/sendEmail";

export async function GET(req: Request) {
  // 1. Security Check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await connectDB();
    const db = client.db("auth_db");

    const now = new Date();
    // Target bookings starting 23 to 25 hours from now
    const startWindow = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const endWindow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const upcomingBookings = await Booking.find({
      startTime: { $gte: startWindow, $lte: endWindow },
      status: "confirmed",
      reminderSent: { $ne: true },
    });

    if (upcomingBookings.length === 0) {
      return NextResponse.json({ message: "No reminders to send." });
    }

    const results = await Promise.allSettled(
      upcomingBookings.map(async (booking) => {
        // 2. Fetch User and Admin Details
        const userDetails = await db
          .collection("user")
          .findOne(
            { _id: new ObjectId(booking.userId) },
            { projection: { name: 1, email: 1 } },
          );

        const adminDetails = await db
          .collection("user")
          .findOne(
            { _id: new ObjectId(booking.adminId) },
            { projection: { name: 1, email: 1 } },
          );

        const formattedTime = new Date(booking.startTime).toLocaleString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        const subject = "Reminder: Your Consultation is Tomorrow";

        // 3. Styled User Email Template
        const userHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">Consultation Reminder</h1>
              </div>
              <div style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Hello ${userDetails?.name || "there"},</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  This is a friendly reminder that your professional consultation with KS Global Services is scheduled for tomorrow.
                </p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: bold; text-transform: uppercase;">Appointment Details</p>
                  <p style="margin: 5px 0; font-size: 16px; color: #1e293b;"><strong>Time:</strong> <span style="color: #2563eb;">${formattedTime}</span></p>
                  <p style="margin: 5px 0; font-size: 16px; color: #1e293b;"><strong>Booking ID:</strong> #${booking._id.toString().slice(-8)}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 32px;">
                  Please ensure you are available at the scheduled time.
                </p>
              </div>
            </div>
          </div>
        `;

        // 4. Styled Admin Email Template
        const adminHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px 20px; border-top: 4px solid #1e293b;">
            <div style="max-width: 600px; margin: 0 auto;">
              <span style="color: #2563eb; font-weight: bold; font-size: 12px; text-transform: uppercase;">Admin Alert: Schedule Reminder</span>
              <h2 style="color: #111827; font-size: 28px; margin-top: 8px;">Consultation Tomorrow</h2>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
              <div style="margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Client Name</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold; text-align: right;">${userDetails?.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Scheduled Time</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; text-align: right;">${formattedTime}</td>
                  </tr>
                </table>
              </div>
              
            </div>
          </div>
        `;

        // 5. Execution: Send Emails & Update DB
        if (userDetails?.email) {
          await sendEmail({ to: userDetails.email, subject, html: userHtml });
        }

        if (adminDetails?.email) {
          await sendEmail({
            to: adminDetails.email,
            subject: `Admin Reminder: Consultation with ${userDetails?.name}`,
            html: adminHtml,
          });
        }

        await Booking.updateOne(
          { _id: booking._id },
          { $set: { reminderSent: true } },
        );
      }),
    );

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    console.error("Cron Reminder Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
