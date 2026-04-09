"use client";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  const scrollToHero = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full py-20 md:py-10 px-6 overflow-hidden transition-colors duration-1000">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Clean Typography */}
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-700 mb-8 leading-[1.1]">
          <span className="md:text-2xl text-xl">
            Ready to navigate your legal and financial milestones with
          </span>{" "}
          <br />
          <span className="text-blue-600">KS Global Services?</span>
        </h2>

        <p className="text-base text-slate-700 font-medium max-w-xl mx-auto mb-12 leading-relaxed opacity-80">
          Join the clients who trust KS Global Services LLC for exceptional and
          friendly support.
        </p>

        {/* High-End Button Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={scrollToHero} // Added click handler
            className="group cursor-pointer relative px-8 py-4 bg-blue-900 text-white font-medium rounded-full transition-all duration-500 hover:bg-blue-800 hover:shadow hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Schedule a consultation
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
