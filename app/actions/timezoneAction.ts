"use server";

import Timezone from "@/lib/models/Timezone";
import connectDB from "@/lib/db";
import { verifyAdmin } from "@/lib/auth/check-auth";

// Set admin timezone
export async function setAdminTimezone(timezone: string) {
  await connectDB();

  const user = await verifyAdmin();
  const adminId = user.id;

  const config = await Timezone.findOneAndUpdate(
    { adminId },
    { timezone },
    { returnDocument: "after", upsert: true, runValidators: true },
  );

  return {
    success: true,
    data: JSON.parse(JSON.stringify(config)),
  };
}

// Get admin timezone
export async function getAdminTimezone() {
  await connectDB();

  const user = await verifyAdmin();
  const adminId = user.id;

  const config = await Timezone.findOne({ adminId });

  if (!config) {
    throw new Error("Timezone not set");
  }

  return config.timezone;
}
