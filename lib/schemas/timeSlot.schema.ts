import {z} from "zod"

export const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  isEnabled: z.boolean(),
}).refine((data) => {
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;