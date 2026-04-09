"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import mongoose from "mongoose";
import { verifyAdmin } from "@/lib/auth/check-auth";
import { EventFormData } from "@/lib/schemas/event.schema";
import { notFound } from "next/navigation";

const validateObjectId = (id: unknown) => {
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }
  return id;
};

// Create a new event
export const createEvent = async (data: EventFormData) => {
  await connectDB();
  const user = await verifyAdmin();

  const event = await Event.create({
    adminId: user.id,
    ...data,
  });

  revalidatePath("/dashboard/events");
  return JSON.parse(JSON.stringify(event));
};

// Get all events for an admin based on the admin's id
export const getAdminEvents = async () => {
  await connectDB();
  const user = await verifyAdmin();

  const events = await Event.find({ adminId: user.id })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(events));
};

// Get an event by id
export const getEventById = async (eventId: unknown) => {
  await connectDB();
  const user = await verifyAdmin();
  const id = validateObjectId(eventId);

  const event = await Event.findOne({
    _id: id,
    adminId: user.id,
  }).lean();

  if (!event) throw new Error("Event not found");

  return JSON.parse(JSON.stringify(event));
};

// Update an event
export const updateEvent = async (
  eventId: unknown,
  data: Partial<EventFormData>,
) => {
  await connectDB();
  const user = await verifyAdmin();
  const id = validateObjectId(eventId);

  const updated = await Event.findOneAndUpdate(
    { _id: id, adminId: user.id },
    data,
    { new: true },
  ).lean();

  if (!updated) throw new Error("Event not found or unauthorized");

  revalidatePath("/dashboard/events");
  return JSON.parse(JSON.stringify(updated));
};

// Delete an event
export const deleteEvent = async (eventId: unknown) => {
  await connectDB();
  const user = await verifyAdmin();
  const id = validateObjectId(eventId);

  const deleted = await Event.findOneAndDelete({ _id: id, adminId: user.id });

  if (!deleted) throw new Error("Event not found or unauthorized");

  revalidatePath("/dashboard/events");
  return { success: true };
};

// Get admins by event name
export async function getAdminsByEventName(eventName: string) {
  await connectDB();

  try {
    const admins = await Event.aggregate([
      {
        $match: {
          name: eventName.toLowerCase(),
        },
      },

      {
        $group: {
          _id: "$adminId",
        },
      },

      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "admin",
        },
      },

      { $unwind: "$admin" },

      {
        $project: {
          _id: "$admin._id",
          name: "$admin.name",
          email: "$admin.email",
        },
      },
    ]);

    return { success: true, data: admins };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch admins" };
  }
}
