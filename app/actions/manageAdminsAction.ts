"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { verifySuperAdmin } from "@/lib/auth/check-auth";
import { revalidatePath } from "next/cache";

const createAdminSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().max(2048, "Image URL is too long").optional(),
});

export async function createAdmin(formData: FormData) {
  await verifySuperAdmin();

  const parsed = createAdminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { name, email, password, image } = parsed.data;

  try {
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: "admin",
        data: { image: image || undefined, emailVerified: true },
      },
      headers: await headers(),
    });

    revalidatePath("/admin/manageAdmin");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("[createAdmin] failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create admin.",
    };
  }
}

/**
 * Super Admin Action: Delete an Admin
 */
export async function deleteAdmin(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "super-admin") {
    throw new Error("Unauthorized");
  }

  try {
    await auth.api.removeUser({
      body: {
        userId: userId,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
