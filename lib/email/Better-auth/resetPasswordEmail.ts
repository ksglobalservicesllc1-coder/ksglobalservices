import { User } from "better-auth";
import { sendEmail } from "../sendEmail";

export const resetPasswordEmail = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hello ${user.name || "there"},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thanks,<br/>Wad</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html,
  });
};
