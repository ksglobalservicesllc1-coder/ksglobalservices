"use server";

import connectDB from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { Event } from "@/lib/models/Event";
import { verifyUser } from "@/lib/auth/check-auth";
import { Types } from "mongoose";
import client from "@/lib/db-client";
import { ObjectId } from "mongodb";

export async function fetchBookingByUserIdAction() {
  try {
    const user = await verifyUser();
    await connectDB();

    // 1. Fetch bookings for the logged-in user
    const bookings = await Booking.find({
      userId: new Types.ObjectId(user.id),
    })
      .populate({
        path: "eventId",
        model: Event,
        select: "name price",
      })
      .sort({ startTime: -1 })
      .lean();

    if (!bookings.length) return [];

    // 2. Extract unique Admin IDs from the bookings
    const adminIds = bookings.map((b: any) => new ObjectId(b.adminId));

    // 3. Query the auth_db user collection for admin details
    const db = client.db("auth_db");
    const admins = await db
      .collection("user")
      .find({ _id: { $in: adminIds } }, { projection: { name: 1, email: 1 } })
      .toArray();

    // 4. Create a map for efficient lookups
    const adminsMap = new Map(
      admins.map((admin) => [admin._id.toString(), admin]),
    );

    // 5. Map the bookings to include the admin details and format IDs/Dates
    return bookings.map((booking: any) => {
      const adminData = adminsMap.get(booking.adminId.toString());

      return {
        ...booking,
        _id: booking._id.toString(),

        // NEW: Ensure these fields are passed to the frontend
        consultationType: booking.consultationType,
        zoomJoinUrl: booking.zoomJoinUrl,
        phoneNumber: booking.phoneNumber,

        // Attach Admin Info
        adminId: adminData
          ? {
              _id: adminData._id.toString(),
              name: adminData.name,
              email: adminData.email,
            }
          : null,

        eventId: booking.eventId
          ? {
              ...booking.eventId,
              _id: booking.eventId._id.toString(),
            }
          : null,

        startTime: booking.startTime?.toISOString(),
        endTime: booking.endTime?.toISOString(),
        createdAt: booking.createdAt?.toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}
