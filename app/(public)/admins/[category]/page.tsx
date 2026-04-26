"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import fetchAdminsByEventCategory from "@/app/actions/public/GetAllAdminsForEventGategory";
import { EVENTS_CATEGORIES } from "@/lib/constants/event-categories";
import { slugToCategory } from "@/lib/slug";
import { useEffect, useState } from "react";

// Updated Card to match Hero Section Style (Circular)
const SpecialistCard = ({
  id,
  img,
  name,
  onSchedule,
}: {
  id: string;
  img: string;
  name: string;
  onSchedule: (id: string) => void;
}) => {
  return (
    <div className="group flex flex-col items-center w-full transition-all duration-300">
      {/* Circular Image Container */}
      <div className="relative mb-6 md:mb-8">
        <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
          <img
            src={img || "/api/placeholder/400/400"}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-6 md:mb-8 group-hover:text-blue-700 transition-colors text-center">
        {name}
      </h3>

      {/* Button */}
      <Button
        onClick={() => onSchedule(id)}
        className="w-full max-w-[260px] bg-blue-700 hover:bg-blue-800 cursor-pointer text-white uppercase text-[10px] md:text-xs rounded-full py-6 md:py-7 font-semibold transition-all hover:shadow-md active:scale-95 flex items-center justify-center gap-3"
      >
        <CalendarDays className="h-4 w-4 md:h-5 md:w-5" />
        Schedule Consultation
      </Button>
    </div>
  );
};

export default function AdminListPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const categorySlug = resolvedParams.category;
      const decodedCategory = slugToCategory(categorySlug, EVENTS_CATEGORIES);

      if (decodedCategory) {
        setCategory(decodedCategory);
        const data = await fetchAdminsByEventCategory(decodedCategory);
        setAdmins(data);
      }
      setLoading(false);
    }
    loadData();
  }, [params]);

  const handleSchedule = (id: string) => {
    router.push(`/events/admin/${id}`);
  };

  if (loading) return null;

  if (!category) {
    return (
      <div className="text-center py-20 font-medium text-gray-500">
        Invalid category
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full py-16 md:py-24 lg:py-32 px-6 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header Section matching Hero Style */}
        <header className="mb-16 md:mb-24 text-center space-y-4 md:space-y-6">
          <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm">
            Our Professionals
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="text-blue-700">Meet</span>{" "}
            <span className="text-gray-500">the specialists.</span>
          </h1>
          <p className="text-slate-800 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Service Category:{" "}
            <span className="font-bold text-blue-700">{category}</span>
          </p>
        </header>

        {admins.length > 0 ? (
          /* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 md:gap-y-24 justify-items-center">
            {admins.map((admin) => (
              <SpecialistCard
                key={admin._id.toString()}
                id={admin._id.toString()}
                name={admin.name}
                img={admin.image}
                onSchedule={handleSchedule}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-12 border-2 border-dashed border-gray-300 rounded-3xl text-center text-gray-400">
            <p className="text-lg italic">
              No specialists found for this service category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
