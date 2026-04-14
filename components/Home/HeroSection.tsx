"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "../ui/button";
import { CalendarDays, FileText } from "lucide-react";
import { getAdmins } from "@/app/actions/public/adminAction";
import Link from "next/link";

type Admin = {
  _id: string;
  name: string;
  image: string;
};

const ReviewCard = ({
  id,
  img,
  name,
  onSchedule,
  onForm,
}: {
  id: string;
  img: string;
  name: string;
  onSchedule: (id: string) => void;
  onForm: (id: string) => void;
}) => {
  return (
    <figure
      className={cn(
        "group relative h-full w-[85vw] sm:w-[260px] md:w-[400px] cursor-pointer overflow-hidden rounded-3xl border p-4 md:p-5 transition-all duration-500",
        "border-gray-100 bg-white/80 backdrop-blur-sm shadow",
        "hover:-translate-y-2 hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/30 bg-gray-50",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 bg-gradient-to-b from-blue-50/20 to-transparent" />

      <div className="flex flex-col items-center gap-4 md:gap-5">
        {/* IMAGE */}
        <div className="w-full overflow-hidden rounded-2xl aspect-[4/5]">
          <img
            className="w-full h-screen object-cover transition duration-700 hover:scale-[1.02]"
            alt={name}
            src={img}
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
          <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-gray-800 transition-colors group-hover:text-blue-700 text-center">
            {name}
          </h3>

          <div className="flex flex-col gap-2 md:gap-2.5 w-full">
            <Button
              onClick={() => onSchedule(id)}
              className="cursor-pointer w-full bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-300 rounded-xl py-4 md:py-6 text-sm md:text-base"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule consultation
            </Button>

            <Button
              variant="outline"
              className="cursor-pointer w-full border-gray-200 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 rounded-xl py-4 md:py-6 transition-all duration-300 text-sm md:text-base"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.dispatchEvent(new Event("openFormsMenu"));
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Fill out forms
            </Button>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default function HeroSection() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchAdmins() {
      const res = await getAdmins();
      if (res.success) {
        setAdmins(res.data as Admin[]);
      }
    }
    fetchAdmins();
  }, []);

  const handleSchedule = (id: string) => {
    router.push(`events/admin/${id}`);
  };

  const handleForm = (id: string) => {
    router.push(`formList/${id}`);
  };

  return (
    <div
      id="hero"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 md:py-24 px-4 bg-white"
    >
      {/* BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

      {/* HEADER */}
      <div className="relative mx-auto max-w-5xl text-center">
        <h1 className="block w-full bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl md:text-6xl tracking-tight text-center mb-4 md:mb-6 leading-[1.1]">
          <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
            Get Expert Support
          </span>{" "}
          <br className="hidden md:block" />
          for Your Case
        </h1>

        <p className="mx-auto my-3 md:my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-500 mb-8 md:mb-12 text-sm sm:text-base">
          Select a dedicated specialist to navigate your journey. Book a private
          consultation or submit your details for a rapid, expert review.
        </p>
      </div>

      {/* MARQUEE */}
      <div className="w-full">
        <Marquee pauseOnHover className="[--duration:60s] py-2 md:py-4">
          {admins.map((admin) => (
            <ReviewCard
              key={admin._id}
              id={admin._id}
              name={admin.name}
              img={admin.image}
              onSchedule={handleSchedule}
              onForm={handleForm}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
