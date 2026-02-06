import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { twoFactor } from "better-auth/plugins";
import client from "./db";
import { verificationEmail } from "./email/Better-auth/verificationEmail";
import { sendEmail } from "./email/sendEmail";
import { resetPasswordEmail } from "./email/Better-auth/resetPasswordEmail";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("auth_db")),
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
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
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail({
            to: user.email,
            subject: "Your 2FA Code",
            html: `<p>Your verification code is: <b>${otp}</b></p>`,
          });
        },
      },
    }),
  ],
});
