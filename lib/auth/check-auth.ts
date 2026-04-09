import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

// Check if the user is authenticated and if the user is a super admin
export async function verifySuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Authentication required: Please log in to continue.");
  }

  if (session.user.role !== "super-admin") {
    throw new Error("Forbidden: super admin privileges required");
  }

  return session.user;
}

// Check if the user is authenticated and if the user is an admin or super admin
export async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Authentication required: Please log in to continue.");
  }

  if (session.user.role !== "admin" && session.user.role !== "super-admin") {
    throw new Error("Forbidden: Admin privileges required");
  }

  return session.user;
}

// Check if the user is authenticated
export async function verifyUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Authentication required: Please log in to continue.");
  }

  return session.user;
}
