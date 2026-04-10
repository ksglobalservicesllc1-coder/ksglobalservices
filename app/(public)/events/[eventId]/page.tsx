"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { getEventById } from "@/app/actions/public/eventActions";
import { getAvailableDates } from "@/app/actions/public/getAvailableDatesActions";
import {
  getAvailableSlots,
  AvailableSlot,
} from "@/app/actions/public/getAvailableSlotsActions";
import {
  Clock,
  CreditCard,
  Calendar as CalendarIcon,
  ArrowLeft,
  ShieldCheck,
  Clock as ClockIcon,
  Video,
  Phone,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { createBookingCheckout } from "@/app/actions/checkoutBooking";
import { authClient } from "@/lib/auth/auth-client";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default function EventDetails({ params }: Props) {
  const { eventId } = use(params);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Auth & Session ---
  const session = authClient.useSession();
  const currentUser = session.data?.user;

  // --- Core State ---
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // --- Form State ---
  const [consultationType, setConsultationType] = useState<"phone" | "video">(
    "phone",
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  // --- Logic Change: Determine UI based on Host Role ---
  const hostIsSuperAdmin = event?.hostRole === "super-admin";

  // Update default selection based on the Host's capabilities
  useEffect(() => {
    if (event) {
      if (hostIsSuperAdmin) {
        setConsultationType("video");
      } else {
        setConsultationType("phone");
      }
    }
  }, [event, hostIsSuperAdmin]);

  // --- UI State ---
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Initialization ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getEventById(eventId);
        if (!res.success) return setError("Event not found");
        setEvent(res.data);

        const dates = await getAvailableDates(
          res.data?.adminId,
          undefined,
          undefined,
          1,
        );
        const localDates = dates.map((d: any) => {
          const [year, month, day] = d.date.split("-").map(Number);
          return new Date(year, month - 1, day);
        });
        setAvailableDates(localDates);
      } catch (err) {
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId]);

  // --- Fetch Slots Logic ---
  const fetchSlots = useCallback(
    async (date: Date) => {
      if (!event) return;
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        setSlotsLoading(true);
        setSelectedSlot(null);
        const dateString = date.toISOString().split("T");
        const slots = await getAvailableSlots(
          event.adminId,
          event._id,
          dateString[0],
        );

        setAvailableSlots(
          slots.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: new Date(s.endTime),
          })),
        );
      } catch (err) {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    [event],
  );

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  // --- Submission ---
  const handleFinalBooking = async () => {
    if (!selectedSlot || !event) return;

    // Validation: Ensure video is only booked if host supports it
    if (consultationType === "video" && !hostIsSuperAdmin) {
      setError("Video consultations are not available for this professional.");
      return;
    }

    if (consultationType === "phone" && !phoneNumber) {
      setError("Please provide a phone number for the call.");
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);
      const res = await createBookingCheckout({
        eventId: event._id,
        adminId: event.adminId,
        userId: currentUser?.id || "",
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        consultationType,
        phoneNumber: consultationType === "phone" ? phoneNumber : undefined,
      });
      if (res?.checkoutUrl) window.location.href = res.checkoutUrl;
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href={`/events/admin/${event?.adminId}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
              Booking Consultation
            </span>
            <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-6">
              {event?.name}
            </h1>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4" /> Duration
                </span>
                <span className="font-bold text-slate-900">
                  {event?.durationMinutes}m
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <CreditCard className="w-4 h-4" /> Price
                </span>
                <span className="font-bold text-slate-900">
                  ${event?.price}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your information is encrypted and PCI compliant. Secure
                  consultation guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Multi-Step Flow */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
            {/* Step Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  {step === 1 ? (
                    <CalendarIcon className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                {step === 1 ? "Select Date & Time" : "Consultation Details"}
              </h2>
              <div className="flex gap-1">
                <div
                  className={`h-1.5 w-8 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`}
                />
                <div
                  className={`h-1.5 w-8 rounded-full ${step === 2 ? "bg-blue-600" : "bg-slate-200"}`}
                />
              </div>
            </div>

            <div className="p-8 flex-1">
              {step === 1 ? (
                <div className="flex flex-col md:flex-row gap-10 animate-in fade-in duration-500">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        !availableDates.some(
                          (d) => d.toDateString() === date.toDateString(),
                        ) || date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="rounded-2xl border border-slate-100 p-4 bg-slate-50/50"
                    />
                  </div>

                  <div className="flex-1 space-y-6">
                    {selectedDate ? (
                      <>
                        <h3 className="font-bold text-sm flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-blue-600" />{" "}
                          Available Slots
                        </h3>
                        {slotsLoading ? (
                          <div className="grid grid-cols-2 gap-3 animate-pulse">
                            {availableSlots.map((slot, i) => (
                              <div
                                key={i}
                                className="h-12 bg-slate-100 rounded-xl"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {availableSlots.map((slot, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                                  selectedSlot?.startTime.getTime() ===
                                  slot.startTime.getTime()
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200"
                                }`}
                              >
                                {slot.startTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </button>
                            ))}
                          </div>
                        )}
                        {selectedSlot && (
                          <button
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-100"
                          >
                            Next Step <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <CalendarIcon className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">
                          Please pick a date to see available time slots.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-xl mx-auto animate-in slide-in-from-right-8 duration-500">
                  <button
                    onClick={() => setStep(1)}
                    className="mb-6 text-sm text-slate-400 flex items-center gap-2 hover:text-blue-600"
                  >
                    <ArrowLeft className="w-4 h-4" /> Change time
                  </button>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    How should we connect?
                  </h3>
                  <p className="text-slate-500 mb-8">
                    Select your preferred method for the consultation.
                  </p>

                  {/* Consultation Selection Grid */}
                  <div
                    className={`grid gap-4 mb-8 ${hostIsSuperAdmin ? "grid-cols-1 sm:grid-cols-2" : "md:grid-cols-2 grid-cols-1"}`}
                  >
                    {/* ONLY RENDER VIDEO OPTION IF HOST IS SUPER ADMIN */}
                    {hostIsSuperAdmin && (
                      <button
                        onClick={() => setConsultationType("video")}
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${
                          consultationType === "video"
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-100 hover:border-blue-200"
                        }`}
                      >
                        <Video
                          className={`w-8 h-8 mb-4 ${
                            consultationType === "video"
                              ? "text-blue-600"
                              : "text-slate-300"
                          }`}
                        />
                        <p className="font-bold text-slate-900">Video Call</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Join via a secure Zoom link.
                        </p>
                      </button>
                    )}

                    <button
                      onClick={() => setConsultationType("phone")}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${
                        consultationType === "phone"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-slate-100 hover:border-blue-200"
                      }`}
                    >
                      <Phone
                        className={`w-8 h-8 mb-4 ${
                          consultationType === "phone"
                            ? "text-blue-600"
                            : "text-slate-300"
                        }`}
                      />
                      <p className="font-bold text-slate-900">Phone Call</p>
                      <p className="text-xs text-slate-500 mt-1">
                        We will call your number.
                      </p>
                    </button>
                  </div>

                  {consultationType === "phone" && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Your Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                      />
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 text-sm mb-4 font-medium">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleFinalBooking}
                    disabled={bookingLoading}
                    className="w-full py-5 bg-blue-700 text-white rounded-2xl font-bold md:text-lg text-md flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                  >
                    {bookingLoading
                      ? "Processing..."
                      : `Complete Booking — $${event?.price}`}
                    <CreditCard className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
