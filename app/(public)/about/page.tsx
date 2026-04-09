"use client";

import { Shield, Globe, FileText, CheckCircle, Scale } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto">
        <div className="relative z-10 text-center lg:text-left">
          <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
            About KS Global Services LLC
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
            Professional Consulting & <br />
            <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Support Services Nationwide.
            </span>
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-10">
            We provide structured, confidential, and professional administrative
            services designed to support individuals and businesses nationwide.
            Our mission is to deliver clear communication and accurate
            documentation for your most critical tasks.
          </p>
        </div>
      </section>

      {/* Core Service Domains */}
      <section className="bg-gray-50 py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Areas of Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Immigration & USCIS Support",
                desc: "Non-legal assistance with form preparation, document organization, and certified translations.",
              },
              {
                title: "Tax & Financial Services",
                desc: "Professional tax preparation for individuals and businesses, including ITIN and IRS support.",
              },
              {
                title: "Business & Administrative",
                desc: "Support for business registration, formation, EIN applications, and compliance documentation.",
              },
              {
                title: "Notary & Document Services",
                desc: "Certified notary public services for affidavits, power of attorney, and sworn statements.",
              },
              {
                title: "Translation Services",
                desc: "USCIS-accepted certified translations for birth certificates, marriage licenses, and legal documents.",
              },
              {
                title: "Professional Consultations",
                desc: "One-on-one case reviews and next-step planning conducted via phone or video call.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-6 h-6 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Legal Notice */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Clients Choose Us
            </h2>
            <ul className="space-y-4">
              {[
                "Professional & Confidential Service",
                "Nationwide Support for All Clients",
                "Clear & Transparent Communication",
                "Organized & Accurate Documentation",
                "Transparent Fee Structures",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-gray-600 font-medium"
                >
                  <Shield className="w-5 h-5 text-blue-900 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-8 md:p-10 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-blue-900" />
              <h3 className="text-xl font-bold text-blue-900">
                Important Disclosures
              </h3>
            </div>
            <div className="space-y-4 text-sm text-blue-800/80 leading-relaxed">
              <p>
                <strong>
                  KS Global Services LLC is not a law firm and does not provide
                  legal advice or legal representation.
                </strong>
                All immigration, tax, and business services are strictly
                administrative and consulting in nature.
              </p>
              <p>
                Consultation fees cover professional time and review only; they
                do not guarantee specific results or approvals from government
                agencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Professional Guidance?
          </h2>
          <p className="text-blue-100/80 text-lg mb-10">
            Schedule a one-on-one consultation to review your case and plan your
            next steps.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/#hero"
              className="py-4 px-10 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition-colors hover:text-blue-900/80"
            >
              Schedule a Consultation
            </Link>
            <a
              href="tel:4073254909"
              className="py-4 px-10 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
            >
              Call +1(407) 325-4909
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
