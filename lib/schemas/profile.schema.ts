import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
    image: z.string().optional(),

    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (
        data.newPassword &&
        data.newPassword.length > 0 &&
        !data.currentPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  );

export type ProfileType = z.infer<typeof profileSchema>;
