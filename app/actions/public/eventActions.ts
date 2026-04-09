"use server";

import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import mongoose from "mongoose";

// Get events by adminId
export async function getEventsByAdmin(adminId: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
      return {
        success: false,
        error: "Invalid admin ID",
        data: [],
      };
    }

    const events = await Event.find({
      isActive: true,
      adminId: new mongoose.Types.ObjectId(adminId),
    })
      .select("name description price durationMinutes")
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedEvents = events.map((event) => ({
      _id: event._id.toString(),
      name: event.name,
      description: event.description || null,
      price: event.price,
      durationMinutes: event.durationMinutes,
    }));

    return {
      success: true,
      data: sanitizedEvents,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: "Failed to fetch events",
      data: [],
    };
  }
}

// Get a single event by id (only if active)
export async function getEventById(eventId: string) {
  try {
    await connectDB();

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return {
        success: false,
        error: "Invalid event ID",
        data: null,
      };
    }

    const event = await Event.findOne({
      _id: new mongoose.Types.ObjectId(eventId),
      isActive: true,
    })
      .select("name description price durationMinutes adminId")
      .lean();

    if (!event) {
      return {
        success: false,
        error: "Event not found",
        data: null,
      };
    }

    const sanitizedEvent = {
      _id: event._id.toString(),
      adminId: event.adminId.toString(),
      name: event.name,
      description: event.description || null,
      price: event.price,
      durationMinutes: event.durationMinutes,
    };

    return {
      success: true,
      data: sanitizedEvent,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: "Failed to fetch event",
      data: null,
    };
  }
}
