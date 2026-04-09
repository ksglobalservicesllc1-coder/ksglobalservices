"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { handleContactForm } from "@/app/actions/public/contactAction";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await handleContactForm(formData);
    setIsPending(false);

    if (result.success) {
      toast.success("Message sent successfully!");
      (document.getElementById("contact-form") as HTMLFormElement).reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info (Unchanged except email text) */}
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Let's talk about <br />
              <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                your goals.
              </span>
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12 max-w-md">
              Have a question about our global services? Our team is here to
              help.
            </p>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <form id="contact-form" action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Your name..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="Your email..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Subject
                </label>
                <input
                  name="subject"
                  required
                  type="text"
                  placeholder="The main reason you contact us"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white resize-none"
                />
              </div>

              <button
                disabled={isPending}
                type="submit"
                className="w-full cursor-pointer py-4 bg-blue-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
