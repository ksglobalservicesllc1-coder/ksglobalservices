"use server";

import connectDB from "@/lib/db";
import { Types } from "mongoose";
import { Schedule } from "@/lib/models/Schedule";
import { Booking } from "@/lib/models/Booking";
import { getAdminTimezone } from "@/app/actions/timezoneAction";

interface AvailableDate {
  date: string;
  dayOfWeek: string;
  availableSlots: number;
}

// Maximum days to look ahead (prevent memory issues)
const MAX_DAYS_AHEAD = 60;

// Helper function to get date in admin's timezone
function getDateInTimezone(date: Date, timezone: string): Date {
  // Format the date to the admin's timezone and parse back
  const formattedDate = date.toLocaleString("en-US", { timeZone: timezone });
  return new Date(formattedDate);
}

// Helper to get day of week in admin's timezone
function getDayOfWeekInTimezone(date: Date, timezone: string): string {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dateInTz = getDateInTimezone(date, timezone);
  return dayNames[dateInTz.getDay()];
}

// Helper to get date string in admin's timezone (YYYY-MM-DD)
function getDateStringInTimezone(date: Date, timezone: string): string {
  const dateInTz = getDateInTimezone(date, timezone);
  const year = dateInTz.getFullYear();
  const month = String(dateInTz.getMonth() + 1).padStart(2, "0");
  const day = String(dateInTz.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to get start of day in UTC for a given date in admin's timezone
function getStartOfDayUTC(dateString: string, timezone: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const dateInTz = new Date(year, month - 1, day);

  return new Date(Date.UTC(year, month - 1, day));
}

export async function getAvailableDates(
  adminId: string,
  startDate?: Date,
  endDate?: Date,
  maxBookingsPerSlot: number = 1,
): Promise<AvailableDate[]> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(adminId)) {
      throw new Error("Invalid adminId");
    }

    // Get admin's timezone
    let adminTimezone: string;
    try {
      adminTimezone = await getAdminTimezone();
    } catch (error) {
      console.error("Admin timezone not set, defaulting to UTC");
      adminTimezone = "UTC";
    }

    const adminObjectId = new Types.ObjectId(adminId);

    // Get current date in admin's timezone
    const now = new Date();
    const nowInTz = getDateInTimezone(now, adminTimezone);
    const todayInTz = new Date(
      nowInTz.getFullYear(),
      nowInTz.getMonth(),
      nowInTz.getDate(),
    );

    // Convert today to UTC for comparison with MongoDB dates
    const todayUTC = new Date(
      Date.UTC(
        todayInTz.getFullYear(),
        todayInTz.getMonth(),
        todayInTz.getDate(),
        0,
        0,
        0,
        0,
      ),
    );

    // Validate and sanitize date range (dates are in admin's timezone)
    let start = startDate
      ? getDateInTimezone(startDate, adminTimezone)
      : todayInTz;
    let end = endDate ? getDateInTimezone(endDate, adminTimezone) : null;

    // Ensure start date is not in the past (in admin's timezone)
    if (start < todayInTz) {
      start = todayInTz;
    }

    // Set end date limit
    if (!end) {
      end = new Date(start);
      end.setDate(end.getDate() + 30);
    }

    // Cap the date range to prevent performance issues
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff > MAX_DAYS_AHEAD) {
      end = new Date(start);
      end.setDate(end.getDate() + MAX_DAYS_AHEAD);
    }

    // Generate date strings in admin's timezone
    const dateStrings: string[] = [];
    const daysOfWeekInRange = new Set<number>();
    const currentDate = new Date(start);

    while (currentDate <= end) {
      if (currentDate >= todayInTz) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        dateStrings.push(`${year}-${month}-${day}`);
        daysOfWeekInRange.add(currentDate.getDay());
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (dateStrings.length === 0) return [];

    // Fetch schedules with lean for performance
    const daysOfWeekArray = Array.from(daysOfWeekInRange);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayNamesInRange = daysOfWeekArray.map((d) => dayNames[d]);

    const schedules = await Schedule.find({
      adminId: adminObjectId,
      dayOfWeek: { $in: dayNamesInRange },
    }).lean();

    // Create schedule map
    const scheduleMap = new Map(
      schedules.map((schedule) => [schedule.dayOfWeek, schedule]),
    );

    // Optimize booking query with projection
    // Convert the date range to UTC for MongoDB queries
    const startUTC = getStartOfDayUTC(dateStrings[0], adminTimezone);
    const endUTC = getStartOfDayUTC(
      dateStrings[dateStrings.length - 1],
      adminTimezone,
    );
    endUTC.setUTCDate(endUTC.getUTCDate() + 1);

    const allBookings = await Booking.find(
      {
        adminId: adminObjectId,
        startTime: { $gte: startUTC, $lt: endUTC },
        status: { $nin: ["cancelled", "rejected"] },
      },
      {
        startTime: 1,
        _id: 0,
      },
    ).lean();

    // Group bookings by date in admin's timezone and slot timestamp
    const bookingsByDate = new Map<string, Map<number, number>>();

    for (const booking of allBookings) {
      const bookingDateUTC = new Date(booking.startTime);
      // Convert booking time to admin's timezone to get the correct date
      const bookingDateInTz = getDateInTimezone(bookingDateUTC, adminTimezone);
      const dateKey = `${bookingDateInTz.getFullYear()}-${String(bookingDateInTz.getMonth() + 1).padStart(2, "0")}-${String(bookingDateInTz.getDate()).padStart(2, "0")}`;

      if (!bookingsByDate.has(dateKey)) {
        bookingsByDate.set(dateKey, new Map());
      }

      // Store slot timestamp in UTC for consistent comparison
      const slotTimestamp = bookingDateUTC.getTime();
      const dateBookings = bookingsByDate.get(dateKey)!;
      dateBookings.set(
        slotTimestamp,
        (dateBookings.get(slotTimestamp) || 0) + 1,
      );
    }

    // Calculate availability
    const availableDates: AvailableDate[] = [];

    for (const dateString of dateStrings) {
      // Parse date in admin's timezone
      const [year, month, day] = dateString.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dayNames[dateObj.getDay()];
      const schedule = scheduleMap.get(dayOfWeek);

      if (!schedule?.timeSlots?.length) continue;

      const enabledSlots = schedule.timeSlots.filter(
        (slot: any) => slot.isEnabled,
      );
      if (enabledSlots.length === 0) continue;

      const bookingsForDate = bookingsByDate.get(dateString) || new Map();

      // Calculate available slots count
      let availableSlotsCount = 0;
      for (const slot of enabledSlots) {
        const slotStart = new Date(slot.startTime);

        if (isNaN(slotStart.getTime())) continue;

        // Create UTC timestamp for this slot on the specific date
        const startUTC = new Date(Date.UTC(year, month - 1, day));
        startUTC.setUTCHours(
          slotStart.getUTCHours(),
          slotStart.getUTCMinutes(),
          0,
          0,
        );

        const startTimestamp = startUTC.getTime();
        const bookedCount = bookingsForDate.get(startTimestamp) || 0;

        if (bookedCount < maxBookingsPerSlot) {
          availableSlotsCount++;
        }
      }

      if (availableSlotsCount > 0) {
        availableDates.push({
          date: dateString,
          dayOfWeek,
          availableSlots: availableSlotsCount,
        });
      }
    }

    return availableDates;
  } catch (error) {
    console.error("Error fetching available dates:", error);
    // Return empty array instead of throwing for better UX
    return [];
  }
}
