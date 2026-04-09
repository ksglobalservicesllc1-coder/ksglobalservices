"use client";

import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl w-full text-center">
        {/* Warning/Cancel Icon */}
        <div className="mb-8 p-4 rounded-full bg-red-50">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        {/* Hero Text */}
        <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">
          Request Cancelled
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
          Changed your mind? <br />
          <span className="text-gray-400">That's okay.</span>
        </h1>

        <p className="max-w-xl text-lg text-gray-500 font-medium leading-relaxed mb-10">
          Your request for{" "}
          <span className="text-blue-900 font-semibold">
            KS Global Services
          </span>{" "}
          has been cancelled. No charges were made and no data was processed.
        </p>

        {/* Helpful Options Grid */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mb-12">
          <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <p>Ksglobalservicesllc1@gmail.com</p>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Contact our support team if you encountered an error.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-64 py-4 px-8 rounded-xl bg-blue-900 text-white font-bold transition-all hover:bg-blue-800 hover:shadow-md hover:-translate-y-1 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
