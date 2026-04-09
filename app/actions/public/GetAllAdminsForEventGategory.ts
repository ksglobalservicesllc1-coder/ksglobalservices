"use server";

import connectDB from "@/lib/db";
import client from "@/lib/db-client"; // Your MongoDB client for auth_db access
import { Event } from "@/lib/models/Event";
import { ObjectId } from "mongodb";

export default async function fetchAdminsByEventCategory(category: string) {
  try {
    await connectDB();

    const events = await Event.find({
      name: category,
      isActive: true,
    })
      .select("adminId")
      .lean();

    if (!events.length) return [];

    // 2. Collect unique admin IDs from the events
    const adminIds = Array.from(
      new Set(events.map((e) => e.adminId.toString())),
    ).map((id) => new ObjectId(id));

    // 3. Connect to the auth database to fetch user details
    const db = client.db("auth_db");

    // 4. Fetch the admin details (Filtering by role here)
    const admins = await db
      .collection("user")
      .find(
        {
          _id: { $in: adminIds },
          role: { $in: ["admin", "super-admin"] },
        },
        {
          projection: { name: 1, email: 1, image: 1 },
        },
      )
      .toArray();

    // 5. Convert to plain objects for Next.js (POJOs)
    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}
