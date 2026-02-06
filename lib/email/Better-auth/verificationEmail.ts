import { User } from "better-auth";
import { sendEmail } from "../sendEmail";

export const verificationEmail = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Hello ${user.name},</h2>

        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Thank you for signing up at our platform! To start using your account, please verify your email address by clicking the button below.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="display: inline-block; background-color: #4ade80; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Verify My Email
          </a>
        </div>

        <p style="color: #999; font-size: 14px; text-align: center;">
          If the button above does not work, you can also click on the link below or copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; color: #555; font-size: 14px; text-align: center;">
          <a href="${url}" style="color: #4ade80;">${url}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

        <p style="color: #999; font-size: 12px; text-align: center;">
          If you did not create an account, no action is needed.  
          © ${new Date().getFullYear()}
        </p>
      </div>
    `,
  });
};
