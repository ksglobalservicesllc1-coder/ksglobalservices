import {
  ShieldCheck,
  Globe,
  MessageSquare,
  FileCheck,
  CreditCard,
} from "lucide-react";

const features = [
  {
    title: "Professional & Confidential",
    description:
      "Your privacy is our priority. We maintain the highest standards of integrity and security in every interaction.",
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
  {
    title: "Nationwide Service",
    description:
      "No matter where you are located, KS Global Services LLC provides seamless support across the entire country.",
    icon: <Globe className="w-6 h-6 text-white" />,
  },
  {
    title: "Clear Communication",
    description:
      "We believe in transparency. Stay informed with consistent updates and direct access to our expert team.",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
  },
  {
    title: "Organized & Accurate Documentation",
    description:
      "Detail-oriented processing ensures your records are precise, compliant, and easy to manage.",
    icon: <FileCheck className="w-6 h-6 text-white" />,
  },
  {
    title: "Transparent Fees",
    description:
      "Straightforward pricing with no hidden costs. We provide clear value for premium professional services.",
    icon: <CreditCard className="w-6 h-6 text-white" />,
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-white">
      <section
        id="features"
        className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-gray-100 bg-gray-50/50"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-blue-600 my-3 flex items-center justify-center font-bold uppercase tracking-widest text-sm">
            Trust & Excellence
          </span>
          <h2 className="block w-full bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text font-bold text-transparent text-3xl sm:text-5xl">
            WHY CLIENTS CHOOSE{" "}
            <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
              KS GLOBAL SERVICES
            </span>
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-500">
            We combine industry expertise with a client-first approach to
            deliver exceptional results with total reliability.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-8 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              /* ADDED: active:scale-95 active:shadow-inner for mobile feedback.
                 Tailwind hover: handles desktop. 
              */
              className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 ease-in-out 
                         hover:-translate-y-1 hover:shadow-md hover:border-blue-200/60 
                         active:scale-95 active:bg-gray-50"
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg shadow-lg transition-all duration-500 ease-out group-hover:scale-105 group-active:scale-90"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                }}
              >
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                {feature.title}
              </h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 transition-opacity duration-300 group-hover:text-gray-900">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Background Elements */}
        <div
          className="absolute bottom-0 left-0 z-0 h-1/3 w-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right top, #2563eb 0%, transparent 50%)",
          }}
        ></div>
        <div
          className="absolute top-0 right-0 z-0 h-1/3 w-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to left bottom, #64748b 0%, transparent 50%)",
          }}
        ></div>
      </section>
    </div>
  );
}
