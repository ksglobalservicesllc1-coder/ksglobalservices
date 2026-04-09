import * as z from "zod";
import { EVENTS_CATEGORIES } from "@/lib/constants/event-categories";

export const eventSchema = z.object({
  name: z.enum(EVENTS_CATEGORIES).default("Immigration & USCIS Support"),
  description: z.string().optional(),

  price: z.coerce
    .number()
    .positive("Price cannot be 0")
    .max(10000, "Price cannot exceed $10,000"),

  durationMinutes: z.coerce
    .number()
    .min(30, "Duration must be at least 30 minutes")
    .max(480, "Duration cannot exceed 8 hours"),

  bufferMinutes: z.coerce
    .number()
    .min(10, "Buffer time must be at least 10 minutes")
    .max(120, "Buffer too long"),

  minimumNoticeMinutes: z.coerce
    .number()
    .min(60, "Minimum notice must be at least 60 minutes")
    .max(480, "Minimum notice too long"),

  isActive: z.boolean().default(true),
});

export type EventFormData = z.input<typeof eventSchema>;
