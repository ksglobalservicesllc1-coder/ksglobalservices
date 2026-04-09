import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "../db-client";
import { verificationEmail } from "../email/Better-auth/verificationEmail";
import { resetPasswordEmail } from "../email/Better-auth/resetPasswordEmail";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["create", "read", "update", "delete", "ban"],
  admin: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

// Define your specific roles
const userRole = ac.newRole({
  user: ["read", "update"],
});

const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],
  // Notice admins don't have access to the 'admin' entity here
});

const superAdminRole = ac.newRole({
  user: ["create", "read", "update", "delete", "ban"],
  admin: ["create", "read", "update", "delete"],
});

export const auth = betterAuth({
  database: mongodbAdapter(client.db("auth_db")),
  plugins: [
    admin({
      ac: ac,
      roles: {
        user: userRole,
        admin: adminRole,
        "super-admin": superAdminRole,
      },
      defaultRole: "user",
      adminRoles: ["admin", "super-admin"],
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
    user: {
      fields: {
        role: true,
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
    deleteUser: {
      enabled: true,
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resetPasswordEmail({ user, url });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await verificationEmail({ user, url });
    },
  },

  passwordReset: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
