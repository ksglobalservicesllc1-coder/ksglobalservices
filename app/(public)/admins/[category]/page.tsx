"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import fetchAdminsByEventCategory from "@/app/actions/public/GetAllAdminsForEventGategory";
import { EVENTS_CATEGORIES } from "@/lib/constants/event-categories";
import { slugToCategory } from "@/lib/slug";
import { useEffect, useState } from "react";

// Using the same ReviewCard style from your Hero section
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
    <figure
      className={cn(
        "group relative h-full w-full max-w-[400px] cursor-pointer overflow-hidden rounded-3xl border p-4 md:p-5 transition-all duration-500",
        "border-gray-100 bg-white/80 backdrop-blur-sm shadow",
        "hover:-translate-y-2 hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/30 bg-gray-50",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 bg-gradient-to-b from-blue-50/20 to-transparent" />

      <div className="flex flex-col items-center gap-4 md:gap-5">
        <div className="w-full overflow-hidden rounded-2xl aspect-[4/5]">
          <img
            className="h-screen w-full object-cover transition duration-700 hover:scale-102"
            alt={name}
            src={img}
          />
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-gray-800 transition-colors group-hover:text-blue-700">
            {name}
          </h3>

          <div className="flex flex-col gap-2 md:gap-2.5 w-full">
            <Button
              onClick={() => onSchedule(id)}
              className="cursor-pointer w-full bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-300 rounded-xl py-5 md:py-6"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule consultation
            </Button>
          </div>
        </div>
      </div>
    </figure>
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
    <div className="relative min-h-screen w-full overflow-hidden py-12 md:py-20 px-4 bg-white">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Available Specialists
          </h1>
          <p className="text-gray-500 font-medium text-base md:text-lg">
            Service: <span className="text-blue-700">{category}</span>
          </p>
        </div>

        {admins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {admins.map((admin) => (
              <SpecialistCard
                key={admin._id.toString()}
                id={admin._id.toString()}
                name={admin.name}
                img={admin.image || "/api/placeholder/400/500"}
                onSchedule={handleSchedule}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400 bg-gray-50/50">
            <p className="text-lg">
              No specialists found for this service category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
