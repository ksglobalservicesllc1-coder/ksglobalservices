"use client";
import {
  Users,
  Receipt,
  FileSignature,
  Briefcase,
  Languages,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/slug";

const services = [
  {
    title: "Immigration & USCIS Support",
    description:
      "Expert guidance through complex residency and citizenship filing processes with precision.",
    icon: <Users className="w-6 h-6 text-white" />,
    featured: true,
    url: `/admins/${createSlug("Immigration USCIS Support")}`,
  },
  {
    title: "Tax & Financial Services",
    description:
      "Comprehensive tax preparation and strategic planning for individuals and businesses.",
    icon: <Receipt className="w-6 h-6 text-white" />,
    featured: true,
    url: `/admins/${createSlug("Tax Financial Services")}`,
  },
  {
    title: "Notary & Document Services",
    description:
      "Official verification and legal authentication for your critical documents.",
    icon: <FileSignature className="w-6 h-6 text-white" />,
    url: `/admins/${createSlug("Notary Document Services")}`,
  },
  {
    title: "Business & Administrative Services",
    description:
      "Streamlined operational support to help your business scale efficiently.",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    url: `/admins/${createSlug("Business Administrative Services")}`,
  },
  {
    title: "Translation & Language Services",
    description:
      "Certified multilingual translations for legal, medical, and personal records.",
    icon: <Languages className="w-6 h-6 text-white" />,
    url: `/admins/${createSlug("Translation Language Services")}`,
  },
  {
    title: "Professional Consultations",
    description:
      "One-on-one sessions with specialists to map out your specific goals.",
    icon: <UserCheck className="w-6 h-6 text-white" />,
    url: `/admins/${createSlug("Other Services")}`,
  },
];

export default function ProfessionalServices() {
  const router = useRouter();

  return (
    <section className="bg-blue-50 px-6 py-20 md:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Animated Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
            Expertise You Can Trust
          </span>
          <h2 className="bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text font-bold text-transparent text-4xl md:text-6xl tracking-tight leading-tight">
            OUR PROFESSIONAL SERVICES
          </h2>
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg font-medium">
            Tailored solutions designed to navigate your most important legal
            and financial milestones.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 touch-manipulation">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => router.push(service.url)} // Make entire card clickable for better UX
              style={{ animationDelay: `${index * 100}ms` }}
              className={cn(
                "group relative flex flex-col justify-between p-10 rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-8 fill-mode-both cursor-pointer",
                /* Hover Effects (Desktop) */
                "hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2",
                /* Active Effects (Mobile Touch) */
                "active:scale-[0.97] active:bg-gray-50/50",
                service.featured ? "md:col-span-1 lg:border-blue-50" : "",
              )}
            >
              <div>
                {/* Icon Container with Group Hover/Active scale */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-blue-200/50 shadow-lg mb-8 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 group-active:scale-90"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  }}
                >
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed text-base font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  {service.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-gray-100/50">
                <div className="flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-widest transition-all group-hover:gap-5">
                  Learn More
                  <ArrowRight className="w-5 h-5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-100 rounded-full blur-[120px] -z-10 opacity-50" />
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
