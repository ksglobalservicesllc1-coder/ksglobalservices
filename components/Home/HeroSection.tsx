"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { CalendarDays } from "lucide-react";
import { getAdmins } from "@/app/actions/public/adminAction";

type Admin = {
  _id: string;
  name: string;
  image: string;
};

export default function HeroSection() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchAdmins() {
      const res = await getAdmins();
      if (res.success) {
        setAdmins(res.data as Admin[]);
        setIsReady(true);
      }
    }
    fetchAdmins();
  }, []);

  const handleSchedule = (id: string) => router.push(`events/admin/${id}`);

  if (!isReady || admins.length === 0) return null;

  return (
    <section
      id="hero"
      className="w-full py-20 md:py-32 lg:py-40 px-6 bg-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center space-y-6">
          <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm">
            Our Professionals
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="text-blue-700">Meet</span>{" "}
            <span className="text-gray-500">the team.</span>
          </h1>
          <p className="text-slate-800 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Connect with our experts to schedule a consultation or fill out a
            form for free from the menu.
          </p>
        </header>

        {/* Infinite Slide Container */}
        <div className="relative w-full overflow-hidden">
          {/* The 'animate-infinite-scroll' class needs to be defined in your tailwind.config.js 
            or via a <style> tag. I've added a style tag below for an out-of-the-box solution.
          */}
          <div className="flex w-fit gap-6 md:gap-4 animate-infinite-scroll">
            {/* Render the list twice to create the infinite illusion */}
            {[...admins, ...admins].map((admin, index) => (
              <div
                key={`${admin._id}-${index}`}
                className="group flex flex-col items-center min-w-[300px] md:min-w-[400px] transition-all duration-300"
              >
                <div className="relative mb-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                    <img
                      src={admin.image}
                      alt={admin.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 group-hover:text-blue-700 transition-colors">
                  {admin.name}
                </h3>

                <Button
                  onClick={() => handleSchedule(admin._id)}
                  className="w-64 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white uppercase text-xs rounded-full py-7 font-semibold transition-all hover:shadow-md active:scale-95 flex items-center justify-center gap-3"
                >
                  <CalendarDays className="h-5 w-5" />
                  Schedule Consultation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 60s linear infinite;
        }
        /* This is the missing piece */
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
