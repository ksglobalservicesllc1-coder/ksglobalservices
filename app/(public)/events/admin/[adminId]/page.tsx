import { getEventsByAdmin } from "@/app/actions/public/eventActions";
import { Calendar, Clock, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { verifyUser } from "@/lib/auth/check-auth";

interface AdminDetailsProps {
  params: {
    adminId: string;
  };
}

export default async function AdminDetails({ params }: AdminDetailsProps) {
  const user = await verifyUser();

  const { adminId } = await params;
  const response = await getEventsByAdmin(adminId);
  const events = response.success ? response.data : [];

  return (
    <div className="bg-white min-h-screen">
      <section className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-gray-100 bg-gray-50/50">
        {/* Header Section */}
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="block w-full bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text font-bold text-transparent text-3xl sm:text-5xl">
            PROFESSIONAL{" "}
            <span className="bg-linear-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
              CONSULTATIONS
            </span>
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl text-center font-medium leading-relaxed tracking-wide text-gray-500">
            Select a service below to begin your journey with KS Global
            Services. We offer tailored solutions designed for your specific
            needs.
          </p>
        </div>

        {/* Events Grid */}
        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:border-blue-200/60"
              >
                <div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg shadow-md mb-6 transition-all duration-500 group-hover:scale-102"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    }}
                  >
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {event.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {event.durationMinutes} mins
                    </span>
                    <span className="text-blue-600 font-bold">
                      ${event.price}
                    </span>
                  </div>

                  <p className="my-4 font-normal leading-relaxed text-gray-600 line-clamp-3">
                    {event.description ||
                      "Expert professional guidance tailored to your requirements."}
                  </p>
                </div>

                <Link
                  href={`/events/${event._id}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-blue-900 text-white font-bold transition-all duration-300 hover:bg-blue-700 group/btn"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No active consultation dates available at this time for this
                expert professional.
              </p>
            </div>
          )}
        </div>

        {/* Decorative Background Elements */}
        <div
          className="absolute bottom-0 left-0 z-0 h-1/3 w-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right top, #2563eb 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute top-0 right-0 z-0 h-1/3 w-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to left bottom, #64748b 0%, transparent 50%)",
          }}
        />
      </section>
    </div>
  );
}
