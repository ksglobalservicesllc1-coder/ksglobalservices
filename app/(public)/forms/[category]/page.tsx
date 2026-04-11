import { FORMS_MAP } from "@/lib/form-category";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function FormCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;

  const categorySlug = resolvedParams.category.toLowerCase();

  const formData = FORMS_MAP[categorySlug];

  if (!formData) {
    notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
        <p className="text-muted-foreground">Please fill out the form below.</p>
      </div>

      <div className="w-full overflow-hidden rounded-xl border shadow-sm bg-white">
        <iframe
          id={`jotform-iframe-${formData.jotformId}`}
          title={formData.title}
          src={`https://form.jotform.com/${formData.jotformId}`}
          style={{
            width: "100%",
            minHeight: "800px",
            border: "none",
          }}
          allow="geolocation; microphone; camera"
          allowFullScreen
        />
      </div>
    </div>
  );
}
