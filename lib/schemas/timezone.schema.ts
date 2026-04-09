import { z } from "zod";

export const timezoneSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
});