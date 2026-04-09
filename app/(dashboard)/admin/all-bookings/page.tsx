import fetchAllBookingsAdminsAction from "@/app/actions/fetchAllBookingsAdminsAction";
import Link from "next/link";
import {
  Calendar,
  User,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Next.js 15+ searchParams are async, in older versions they are plain objects
export default async function AllBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;

  // We destructure the new object returned by the server action
  const { bookings, totalPages, totalBookings } =
    await fetchAllBookingsAdminsAction(currentPage, limit);

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6 md:space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Platform Audit
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Monitoring all transactions and bookings across the ecosystem.
            </p>
          </div>

          <div className="flex items-center self-start md:self-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-600 whitespace-nowrap">
              {totalBookings} Total Records
            </span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">
              No system bookings found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <div className="col-span-3">Service & Details</div>
              <div className="col-span-3">Client (User)</div>
              <div className="col-span-3">Expert (Admin)</div>
              <div className="col-span-2 text-center">Amount</div>
              <div className="col-span-1 text-right">Date</div>
            </div>

            {/* Booking Rows */}
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking: any) => (
                <div
                  key={booking._id.toString()}
                  className="group relative grid grid-cols-1 lg:grid-cols-12 items-center md:gap-4 bg-white border border-slate-300 hover:border-blue-300 p-5 md:p-6 lg:px-8 lg:py-4 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5 lg:hover:-translate-y-0.5"
                >
                  {/* Service Info */}
                  <div className="col-span-3 flex items-center gap-4 mb-5 lg:mb-0">
                    <div className="shrink-0 h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-base lg:text-sm">
                        {(() => {
                          const name =
                            booking.event?.name || "Standard Session";
                          return name.length > 20
                            ? name.slice(0, 20) + "..."
                            : name;
                        })()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        ID: {booking._id.toString().slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="col-span-3 flex items-center gap-3 mb-5 lg:mb-0 lg:border-none">
                    <div className="shrink-0 h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 overflow-hidden">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="lg:hidden text-[9px] font-black uppercase text-blue-500 mb-0.5">
                        Client
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {booking.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {booking.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Admin Info */}
                  <div className="col-span-3 flex items-center gap-3 mb-5 lg:mb-0 lg:border-none">
                    <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-200">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="lg:hidden text-[9px] font-black uppercase text-slate-500 mb-0.5">
                        Expert
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {booking.admin?.name || "Staff"}
                      </p>
                      <p className="text-xs text-blue-600 font-medium truncate">
                        {booking.admin?.email}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex flex-row lg:flex-col lg:justify-center items-center lg:items-center gap-2 mb-5 lg:mb-0 py-4 lg:py-0 border-y lg:border-none border-slate-100">
                    <p className="lg:hidden text-[10px] font-black uppercase text-slate-400">
                      Fee:
                    </p>
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-lg lg:text-sm font-black">
                        {booking.event?.price || 0}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-1 flex flex-col lg:flex-col justify-end items-end lg:items-end">
                    <p className="lg:hidden text-[10px] font-black uppercase text-slate-400 flex gap-1">
                      <Calendar className="h-3 w-3" /> Booked On
                    </p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(booking.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            <div className="flex items-center justify-between pt-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`?page=${Math.max(1, currentPage - 1)}`}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all",
                    currentPage <= 1
                      ? "opacity-50 pointer-events-none"
                      : "hover:border-blue-300 hover:text-blue-600",
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <Link
                  href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all",
                    currentPage >= totalPages
                      ? "opacity-50 pointer-events-none"
                      : "hover:border-blue-300 hover:text-blue-600",
                  )}
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
