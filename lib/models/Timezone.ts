import mongoose, { Schema, Document } from "mongoose";

export interface ITimezone extends Document {
  adminId: mongoose.Types.ObjectId;
  timezone: string;
}

const TimezoneSchema = new Schema<ITimezone>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Timezone =
  mongoose.models.Timezone ||
  mongoose.model<ITimezone>("Timezone", TimezoneSchema);

export default Timezone;