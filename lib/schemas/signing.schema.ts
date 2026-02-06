import { z } from "zod";

export const signingSchema = z.object({
  email: z.email("You must enter a valid email"),
  password: z.string().min(6, "You must enter your password"),
});

export type SignIngType = z.infer<typeof signingSchema>;
