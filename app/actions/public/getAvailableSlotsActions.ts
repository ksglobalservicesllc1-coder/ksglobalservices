"use server";

import connectDB from "@/lib/db";
import { Schedule } from "@/lib/models/Schedule";
import { Booking } from "@/lib/models/Booking";
import { Event } from "@/lib/models/Event";
import { Types } from "mongoose";
import { getAdminTimezone } from "@/app/actions/timezoneAction";
import { convertToUTC, convertFromUTC } from "@/lib/timezone-converter";

export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
  availableSpots: number;
  isAvailable: boolean;
}

interface TimeRange {
  start: Date;
  end: Date;
}

// Cache for timezone (5 minutes TTL)
let timezoneCache: { timezone: string; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function getAvailableSlots(
  adminId: string,
  eventId: string,
  dateString: string,
): Promise<AvailableSlot[]> {
  try {
    await connectDB();

    // Validate IDs
    if (!Types.ObjectId.isValid(adminId)) {
      throw new Error("Invalid adminId");
    }
    if (!Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid eventId");
    }

    // Validate date string format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error("Invalid date format. Expected YYYY-MM-DD");
    }

    const adminObjectId = new Types.ObjectId(adminId);
    const eventObjectId = new Types.ObjectId(eventId);

    // Get admin timezone with caching
    let adminTimezone = "UTC";
    try {
      const now = Date.now();
      if (timezoneCache && now - timezoneCache.timestamp < CACHE_TTL) {
        adminTimezone = timezoneCache.timezone;
      } else {
        adminTimezone = await getAdminTimezone();
        timezoneCache = { timezone: adminTimezone, timestamp: now };
      }
    } catch (error) {
      console.warn("Using default timezone UTC:", error);
    }

    // Get event details with projection for performance
    const event = await Event.findById(eventObjectId)
      .select("durationMinutes bufferMinutes minimumNoticeMinutes")
      .lean();

    if (!event) {
      throw new Error("Event not found");
    }

    const eventDuration = event.durationMinutes;
    const bufferMinutes = event.bufferMinutes || 0;
    const minimumNoticeMinutes = event.minimumNoticeMinutes || 0;

    // Parse date and get day of week
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    if (isNaN(startOfDay.getTime())) {
      throw new Error("Invalid date");
    }

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = dayNames[startOfDay.getUTCDay()];

    // Get schedule with lean
    const schedule = await Schedule.findOne({
      adminId: adminObjectId,
      dayOfWeek,
    }).lean();

    if (!schedule?.timeSlots?.length) {
      return [];
    }

    // Get enabled slots
    const enabledSlots = schedule.timeSlots.filter(
      (slot: any) => slot.isEnabled,
    );
    if (enabledSlots.length === 0) {
      return [];
    }

    // Get existing bookings with projection
    const existingBookings = await Booking.find(
      {
        adminId: adminObjectId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "confirmed"] },
      },
      {
        startTime: 1,
        endTime: 1,
        _id: 0,
      },
    ).lean();

    // Calculate minimum allowed start time
    const now = new Date();
    const minStartTime = new Date(
      now.getTime() + minimumNoticeMinutes * 60 * 1000,
    );

    // Generate all possible slots
    const allPossibleSlots: TimeRange[] = [];

    for (const timeSlot of enabledSlots) {
      const slotStart = new Date(timeSlot.startTime);
      const slotEnd = new Date(timeSlot.endTime);

      if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
        continue;
      }

      // Create datetime objects for the selected date
      const dayStart = new Date(startOfDay);
      dayStart.setUTCHours(
        slotStart.getUTCHours(),
        slotStart.getUTCMinutes(),
        0,
        0,
      );

      const dayEnd = new Date(startOfDay);
      dayEnd.setUTCHours(slotEnd.getUTCHours(), slotEnd.getUTCMinutes(), 0, 0);

      // Generate slots
      let currentStart = new Date(dayStart);
      const slotDurationMs = eventDuration * 60 * 1000;
      const stepMs = (eventDuration + bufferMinutes) * 60 * 1000;

      while (currentStart.getTime() + slotDurationMs <= dayEnd.getTime()) {
        allPossibleSlots.push({
          start: new Date(currentStart),
          end: new Date(currentStart.getTime() + slotDurationMs),
        });

        currentStart = new Date(currentStart.getTime() + stepMs);
      }
    }

    // Sort slots by start time
    allPossibleSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Check for overlaps with existing bookings
    const bookedRanges = existingBookings.map((booking) => ({
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
    }));

    // Filter available slots
    const availableSlots: AvailableSlot[] = [];

    for (const slot of allPossibleSlots) {
      // Check minimum notice period
      if (slot.start < minStartTime) {
        continue;
      }

      // Check if slot is in the past
      if (slot.start < now) {
        continue;
      }

      // Check for overlaps
      let isOverlapping = false;
      for (const booked of bookedRanges) {
        if (slot.start < booked.end && slot.end > booked.start) {
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        availableSlots.push({
          startTime: slot.start,
          endTime: slot.end,
          availableSpots: 1,
          isAvailable: true,
        });
      }
    }

    // Limit slots to prevent overwhelming UI (max 50 slots per day)
    const limitedSlots = availableSlots.slice(0, 50);

    return limitedSlots.map((slot) => ({
      ...slot,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    }));
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }
}
