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
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";

export default async function HomeDashboard() {
  const user = await verifyUser();
  const isAdmin = user.role === "admin" || user.role === "super-admin";

  let displayBookings = [];
  let totalPastCount = 0;
  let adminUpcomingCount = 0;

  if (isAdmin) {
    const { upcoming, totalPast } = await fetchBookingByAdminIdAction(1, 3);
    displayBookings = upcoming.slice(0, 3);
    adminUpcomingCount = upcoming.length;
    totalPastCount = totalPast;
  } else {
    const userBookings = await fetchBookingByUserIdAction();
    displayBookings = userBookings.slice(0, 3);
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 bg-white min-h-screen">
      {/* Header Section */}
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
          href={isAdmin ? "/admin/bookings" : "/client/bookings"}
          className="group flex w-fit items-center gap-3 bg-blue-700 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200"
        >
          View Full Schedule
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main Table Section */}
      <section className="bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-900">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold tracking-tight">
              {isAdmin ? "Priority Sessions" : "Upcoming Sessions"}
            </h2>
          </div>
        </div>

        {displayBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
            <Calendar className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              No sessions scheduled.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Participant
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Service
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {displayBookings.map((booking: any) => (
                    <BookingRow
                      key={booking._id}
                      booking={booking}
                      isAdmin={isAdmin}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                Total Active
              </p>
              <p className="text-4xl font-black text-slate-900 mt-1">
                {adminUpcomingCount}
              </p>
            </div>
            <Clock className="h-10 w-10 text-blue-600 opacity-20" />
          </div>
          <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                Lifetime Completed
              </p>
              <p className="text-4xl font-black text-slate-900 mt-1">
                {totalPastCount}
              </p>
            </div>
            <ShieldCheck className="h-10 w-10 text-emerald-600 opacity-20" />
          </div>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking, isAdmin }: { booking: any; isAdmin: boolean }) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const dateStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  const displayName = isAdmin
    ? booking.user?.name || "Private Client"
    : booking.adminId?.name || "Consultant";

  return (
    <tr className="group flex flex-col md:table-row hover:bg-slate-50/50 transition-colors">
      {/* Participant */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {displayName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">
              {displayName}
            </span>
            <span className="text-[10px] font-medium text-slate-400 md:hidden uppercase tracking-tighter">
              {isAdmin ? "Client" : "Consultant"}
            </span>
          </div>
        </div>
      </td>

      {/* Service */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase className="h-3.5 w-3.5" />
          <span className="text-sm font-medium truncate max-w-[150px]">
            {booking.eventId?.name || "Consultation"}
          </span>
        </div>
      </td>

      {/* Schedule */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800">{dateStr}</span>
          <span className="text-xs text-slate-500 font-medium">{timeStr}</span>
        </div>
      </td>

      {/* Type Badge */}
      <td className="px-6 py-4">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
            booking.consultationType === "video"
              ? "bg-blue-100 text-blue-700"
              : "bg-indigo-100 text-indigo-700",
          )}
        >
          {booking.consultationType === "video" ? (
            <Video className="h-3 w-3" />
          ) : (
            <Phone className="h-3 w-3" />
          )}
          {booking.consultationType}
        </div>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right">
        {booking.consultationType === "video" ? (
          <a
            href={isAdmin ? booking.zoomStartUrl : booking.zoomJoinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Join <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-sm font-bold text-slate-900">
            {booking.phoneNumber || "N/A"}
          </span>
        )}
      </td>
    </tr>
  );
}
