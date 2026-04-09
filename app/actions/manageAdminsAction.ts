"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { verifySuperAdmin } from "@/lib/auth/check-auth";

/**
 * Super Admin Action: Create a pre-verified Admin user
 */
export async function createAdmin(formData: FormData) {
  verifySuperAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const image = formData.get("image") as string;

  try {
    // Create the user with 'admin' role and verified email
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: "admin",
        data: {
          image: image,
          emailVerified: true,
        },
      },
      headers: await headers(),
    });

    return { success: true, user: newUser };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create admin.",
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
