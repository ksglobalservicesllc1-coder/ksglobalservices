import { fetchBookingByUserIdAction } from "@/app/actions/fetchBookingByUserId";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  History,
  Timer,
  ShieldCheck,
  CreditCard,
  Mail,
  User,
  ArrowRight,
  Briefcase,
  Video,
  Phone,
  ExternalLink,
} from "lucide-react";

export default async function Bookings() {
  const bookings = await fetchBookingByUserIdAction();
  const now = new Date();

  const upcomingBookings = bookings
    .filter((b: any) => new Date(b.startTime) >= now)
    .sort(
      (a: any, b: any) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  const pastBookings = bookings
    .filter((b: any) => new Date(b.startTime) < now)
    .sort(
      (a: any, b: any) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 bg-white min-h-screen">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          View and manage your upcoming consultations.
        </p>
      </div>

      {/* Upcoming Section */}
      <section>
        <div className="flex items-center gap-2 mb-8 text-blue-700">
          <Clock className="h-5 w-5" />
          <h2 className="text-xl font-bold tracking-tight uppercase">
            Upcoming Sessions
          </h2>
        </div>

        {upcomingBookings.length === 0 ? (
          <EmptyState message="No scheduled sessions." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking: any) => (
              <BookingCard key={booking._id} booking={booking} isPast={false} />
            ))}
          </div>
        )}
      </section>

      {/* History Section */}
      <section className="pt-6">
        <div className="flex items-center gap-2 mb-8 text-slate-400">
          <History className="h-5 w-5" />
          <h2 className="text-xl font-bold tracking-tight uppercase">
            Past History
          </h2>
        </div>

        {pastBookings.length === 0 ? (
          <EmptyState message="No history found." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale-[0.4] hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {pastBookings.map((booking: any) => (
              <BookingCard key={booking._id} booking={booking} isPast={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BookingCard({ booking, isPast }: { booking: any; isPast: boolean }) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-slate-50/50 border rounded-[2rem] p-6 transition-all duration-500",
        isPast
          ? "border-slate-300"
          : "border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1",
      )}
    >
      {/* Header: Expert Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm",
              isPast ? "bg-slate-200 text-slate-500" : "bg-blue-900 text-white",
            )}
          >
            {booking.adminId?.name?.charAt(0) || <User className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
              {booking.adminId?.name || "Consultant"}
            </h3>
            <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {booking.adminId?.email}
            </p>
          </div>
        </div>

        {/* Type Badge */}
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

      {/* Merged Information Block */}
      <div className="space-y-4 py-6 border-y border-slate-300">
        {/* Service Name Row */}
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
            <Briefcase
              className={cn(
                "h-4 w-4",
                !isPast ? "text-blue-600" : "text-slate-400",
              )}
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
              Service
            </p>
            <p className="text-sm font-bold text-slate-800 truncate">
              {booking.eventId?.name || "Standard Consultation"}
            </p>
          </div>
        </div>

        {/* Date & Time Row */}
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
            <Calendar
              className={cn(
                "h-4 w-4",
                !isPast ? "text-blue-600" : "text-slate-400",
              )}
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
              Scheduled On
            </p>
            <p className="text-sm font-bold text-slate-800">{dateStr}</p>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" /> {timeStr}{" "}
              <span className="mx-1">•</span> <Timer className="h-3 w-3" />{" "}
              {booking.eventId?.duration || 30}m
            </p>
          </div>
        </div>

        {/* Action Row - FETCHED LINKS DISPLAYED HERE */}
        {!isPast && (
          <div className="pt-2">
            {booking.consultationType === "video" && booking.zoomJoinUrl ? (
              <a
                href={booking.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-blue-200"
              >
                <Video className="h-4 w-4" />
                Join Zoom Meeting
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : booking.consultationType === "phone" && booking.phoneNumber ? (
              <a
                href={`tel:${booking.phoneNumber}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-slate-200"
              >
                <Phone className="h-4 w-4" />
                Call {booking.phoneNumber}
              </a>
            ) : null}
          </div>
        )}

        {/* Status & Payment Row */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Booking & Status
            </p>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border",
                  booking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-100",
                )}
              >
                <ShieldCheck className="h-3 w-3" />
                {booking.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Paid
            </p>
            <p className="text-xl font-black text-slate-900">
              ${booking.eventId?.price || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-6 flex items-center justify-center">
        <div className="text-[10px] font-bold text-slate-600 flex items-center gap-2">
          <span className="uppercase tracking-widest">
            Ref: {booking._id.slice(-6)}
          </span>
          {!isPast && <span className="h-1 w-1 bg-slate-300 rounded-full" />}
          {!isPast && (
            <span>
              Booked {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
      <Calendar className="h-10 w-10 text-slate-200 mb-4" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
        {message}
      </p>
    </div>
  );
}
