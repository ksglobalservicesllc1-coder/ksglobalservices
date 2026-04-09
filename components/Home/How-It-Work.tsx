"use client";

import React, { useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CreditCard,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select an expert",
    description: "Select the expert who will guide you through the process.",
    icon: <UserCheck />,
  },
  {
    number: "02",
    title: "Choose a time",
    description:
      "Select a convenient slot from our real-time calendar for your expert consultation.",
    icon: <CalendarClock />,
  },
  {
    number: "03",
    title: "Make payment",
    description:
      "Finalize your booking with our transparent, secure, and straightforward checkout.",
    icon: <CreditCard />,
  },
  {
    number: "04",
    title: "Receive confirmation",
    description:
      " You'll receive a confirmation email once your booking is complete.",
    icon: <CheckCircle2 />,
  },
];

export default function HowItWorks() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="relative bg-gray-50 py-20 md:py-32 px-6 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background Glow */}
      <div
        className="pointer-events-none absolute transition-opacity duration-500 opacity-40 lg:opacity-60"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, bg-blue-700 0%, transparent 40%)",
          left: `${mousePos.x - 300}px`,
          top: `${mousePos.y - 300}px`,
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:items-start relative z-10">
        {/* Left Side: Sticky Header */}
        <div className="lg:w-1/3 lg:sticky lg:top-32">
          <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4 block animate-in fade-in slide-in-from-left-4 duration-700">
            The Process
          </span>
          <h2 className="bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text font-bold text-transparent text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-left-6 duration-1000">
            HOW IT WORKS
          </h2>
          <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-sm animate-in fade-in slide-in-from-left-8 duration-1000">
            Simple steps to expert support. Follow our streamlined process to
            get started with your professional services today.
          </p>

          <div className="mt-10 hidden lg:block overflow-hidden">
            <div className="h-1 w-20 bg-blue-600 rounded-full mb-4 animate-pulse" />
            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest tracking-in-expand">
              Efficiency Guaranteed
            </p>
          </div>
        </div>

        {/* Right Side: Animated Cards */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 150}ms` }}
              className={cn(
                "group relative flex flex-col p-10 rounded-[2.5rem] border border-gray-100 bg-blue-100/60 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                "hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-3 animate-in fade-in slide-in-from-bottom-10 fill-mode-both",
              )}
            >
              {/* Top Row: Number and Icon */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-5xl font-black text-gray-300 transition-colors duration-700 group-hover:text-blue-50 italic select-none">
                  {step.number}
                </span>
                <div className="h-14 w-14 rounded-2xl bg-white border border-gray-50 flex items-center justify-center shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:rotate-6">
                  {React.cloneElement(step.icon, {
                    className:
                      "w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500",
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                  {step.title}
                </h3>
                <p className="mt-4 text-gray-500 text-base leading-relaxed font-medium transition-colors duration-500 group-hover:text-gray-700">
                  {step.description}
                </p>
              </div>

              {/* Interactive Decoration */}
              <div className="absolute bottom-6 right-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                    Next Step
                  </span>
                  <div className="w-8 h-[1px] bg-blue-600 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
