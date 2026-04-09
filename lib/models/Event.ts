import mongoose, { Schema, Document } from "mongoose";
import { EVENTS_CATEGORIES } from "../constants/event-categories";

export type EventCategory = (typeof EVENTS_CATEGORIES)[number];

export interface IEvent extends Document {
  adminId: mongoose.Types.ObjectId;
  name: EventCategory;
  description?: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  minimumNoticeMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      enum: EVENTS_CATEGORIES,
      default: "Immigration & USCIS Support",
      required: true,
    },
    description: String,
    price: { type: Number, required: true, min: 0, default: 0 },
    durationMinutes: { type: Number, required: true, min: 1 },
    bufferMinutes: { type: Number, default: 0, min: 0 },
    minimumNoticeMinutes: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
