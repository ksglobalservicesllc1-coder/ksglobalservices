import { fetchBookingByUserIdAction } from "@/app/actions/fetchBookingByUserId";
import { fetchBookingByAdminIdAction } from "@/app/actions/fetchBookingByAdminId";
import { verifyUser } from "@/lib/auth/check-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Briefcase,
  Video,
  Phone,
  User,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

export default async function HomeDashboard() {
  const user = await verifyUser();
  const isAdmin = user.role === "admin";

  let displayBookings = [];
  let totalPastCount = 0;
  let adminUpcomingCount = 0;

  // Conditional Logic
  if (isAdmin) {
    const { upcoming, totalPast } = await fetchBookingByAdminIdAction(1, 3);
    displayBookings = upcoming.slice(0, 3);
    adminUpcomingCount = upcoming.length;
    totalPastCount = totalPast;
  } else {
    // For Users: Just fetch and take the first 3 (No stats needed)
    const userBookings = await fetchBookingByUserIdAction();
    displayBookings = userBookings.slice(0, 3);
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 bg-white min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isAdmin ? "Admin Overview" : "My Schedule"}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isAdmin
              ? `You have ${adminUpcomingCount} upcoming sessions to manage.`
              : `Welcome back, ${user.name}. View your upcoming consultations below.`}
          </p>
        </div>

        <Link
          href="/dashboard/bookings"
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
        >
          View Full Schedule
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2. Main Sessions Grid */}
      <section>
        <div className="flex items-center gap-2 text-blue-700 mb-8">
          <LayoutDashboard className="h-5 w-5" />
          <h2 className="text-xl font-bold tracking-tight uppercase">
            {isAdmin ? "Next 3 Priority Sessions" : "Upcoming Sessions"}
          </h2>
        </div>

        {displayBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
            <Calendar className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              No sessions scheduled.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBookings.map((booking: any) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Conditional Stats: Only show for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Total Active
              </p>
              <p className="text-4xl font-black text-slate-900 mt-1">
                {adminUpcomingCount}
              </p>
            </div>
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Lifetime Completed
              </p>
              <p className="text-4xl font-black text-slate-900 mt-1">
                {totalPastCount}
              </p>
            </div>
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Component: BookingCard ---

function BookingCard({ booking, isAdmin }: { booking: any; isAdmin: boolean }) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const timeStr = `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  const displayName = isAdmin
    ? booking.user?.name || "Private Client"
    : booking.adminId?.name || "Consultant";

  return (
    <div className="group flex flex-col bg-slate-50/50 border border-slate-200 rounded-[2rem] p-6 transition-all duration-300 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
      {/* Participant Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm bg-slate-900 text-white">
            {displayName.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              {isAdmin ? "Client" : "Consultant"}
            </p>
            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate max-w-[150px]">
              {displayName}
            </h3>
          </div>
        </div>

        <div
          className={cn(
            "p-2 rounded-xl border",
            booking.consultationType === "video"
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "bg-indigo-50 border-indigo-100 text-indigo-600",
          )}
        >
          {booking.consultationType === "video" ? (
            <Video className="h-4 w-4" />
          ) : (
            <Phone className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4 py-6 border-y border-slate-100">
        <div className="flex items-start gap-3">
          <Briefcase className="h-4 w-4 text-slate-400 mt-1" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {booking.eventId?.name || "Consultation Session"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm font-bold text-slate-800">{dateStr}</p>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> {timeStr}
            </p>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <div className="mt-6">
        {booking.consultationType === "video" ? (
          <a
            href={isAdmin ? booking.zoomStartUrl : booking.zoomJoinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-blue-100"
          >
            <Video className="h-4 w-4" />
            {isAdmin ? "Start Zoom" : "Join Zoom"}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <div className="flex items-center justify-between px-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              Phone Call
            </span>
            <span className="text-sm font-bold text-slate-900">
              {booking.phoneNumber || "No Number"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
