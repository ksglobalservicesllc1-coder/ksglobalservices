"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const COOLDOWN_SECONDS = 60;

  // Read email & cooldown from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verify_email");
    if (!storedEmail) {
      router.push("/auth/sign-up");
      return;
    }
    setEmail(storedEmail);

    // Read stored cooldown
    const storedEnd = sessionStorage.getItem("resend_cooldown_end");
    if (storedEnd) {
      const remaining = Math.ceil((parseInt(storedEnd) - Date.now()) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }
  }, [router]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setSent(false);

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend verification email");
      }

      setSent(true);
      setCooldown(COOLDOWN_SECONDS);

      // Save cooldown end timestamp in sessionStorage
      const cooldownEnd = Date.now() + COOLDOWN_SECONDS * 1000;
      sessionStorage.setItem("resend_cooldown_end", cooldownEnd.toString());
    } catch (error) {
      console.error("Failed to resend", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Verify your email
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          We’ve sent a verification link to{" "}
          <span className="font-semibold text-gray-900">{email}</span>. {<br />}{" "}
          Go click the link that is sent in your email to activate your account.
        </p>

        <p className="mt-3 text-sm text-gray-500">
          If you don’t see it, check your spam folder.
        </p>

        <button
          onClick={handleResend}
          disabled={loading || cooldown > 0}
          className="mt-6 w-full rounded-md border cursor-pointer border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend verification email"}
        </button>

        {sent && (
          <p className="mt-3 text-sm font-medium text-green-600">
            Verification email sent successfully!
          </p>
        )}
      </div>
    </div>
  );
}
