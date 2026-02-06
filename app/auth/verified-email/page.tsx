"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VerifiedEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Email Verified Successfully!
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-gray-600">
          Your account has been activated. You can now log in to your account
          and start using the platform.
        </p>

        {/* Login Button */}
        <Link
          href="/auth/sign-in"
          className="mt-6 inline-block w-full rounded-md bg-green-600 py-2 text-white text-sm font-medium hover:bg-green-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
