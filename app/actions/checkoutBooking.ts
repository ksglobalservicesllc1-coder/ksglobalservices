"use server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { Event } from "@/lib/models/Event";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createBookingCheckout({
  eventId,
  adminId,
  userId,
  startTime,
  endTime,
  consultationType,
  phoneNumber,
}: {
  eventId: string;
  adminId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  consultationType: "phone" | "video";
  phoneNumber?: string;
}) {
  await connectDB();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // ✅ CREATE BOOKING WITHOUT ZOOM
  const booking = await Booking.create({
    eventId: new mongoose.Types.ObjectId(eventId),
    adminId: new mongoose.Types.ObjectId(adminId),
    userId: new mongoose.Types.ObjectId(userId),
    startTime,
    endTime,
    consultationType,
    phoneNumber: consultationType === "phone" ? phoneNumber : undefined,

    status: "pending", // IMPORTANT
    paymentStatus: "unpaid",

    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: event.price * 100,
          product_data: { name: event.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?id=${booking._id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
    metadata: {
      bookingId: booking._id.toString(),
    },
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  return { checkoutUrl: session.url };
}
