import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Email is required and must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpType = z.infer<typeof signupSchema>;
