import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "expired";
  consultationType: "phone" | "video";
  phoneNumber?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  stripeSessionId?: string;
  expiresAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "expired"],
      default: "pending",
    },
    consultationType: {
      type: String,
      enum: ["phone", "video"],
      required: true,
    },
    phoneNumber: { type: String },
    zoomJoinUrl: { type: String },
    zoomStartUrl: { type: String },
    stripeSessionId: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
