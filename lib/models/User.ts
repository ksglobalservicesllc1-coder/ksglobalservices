import mongoose, { Schema, Document, Model } from "mongoose";

// -------------------
// User Interface
// -------------------
export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  socialAccounts?: {
    provider: "google";
    id: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// -------------------
// User Schema
// -------------------
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    socialAccounts: [
      {
        provider: {
          type: String,
          enum: ["google"],
          required: true,
        },
        id: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

// -------------------
// Session Interface
// -------------------
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// -------------------
// Session Schema
// -------------------
const SessionSchema: Schema<ISession> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// -------------------
// Models
// -------------------
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export const Session: Model<ISession> = mongoose.model<ISession>(
  "Session",
  SessionSchema,
);
