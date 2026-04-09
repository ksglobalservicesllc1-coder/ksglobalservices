"use client";

import Link from "next/link";
import { CheckCircle, Mail, Download, Globe } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Subtle Top Decorative Bar */}
      <div className="h-1.5 w-full" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl w-full text-center">
        {/* Animated Success Badge */}

        {/* Hero Text */}
        <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">
          Request Received
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
          Thank You for Choosing <br />
          <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
            KS Global Services
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-gray-500 font-medium leading-relaxed mb-10">
          Your consultation request has been successfully processed.{" "}
        </p>

        {/* Next Steps Grid */}
        <div className=" w-full mb-12">
          <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Check Email</h3>
            <p className="text-sm text-gray-500 text-center">
              A confirmation email has been sent to your inbox.
            </p>
          </div>

          {/* <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Save Receipt</h3>
            <p className="text-sm text-gray-500 text-center">
              Download your booking summary for your records.
            </p>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-64 py-4 px-8 rounded-xl bg-blue-900 text-white font-bold transition-all hover:bg-blue-800 hover:shadow-md hover:-translate-y-1 active:translate-y-0"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
