import { FORMS_MAP } from "@/lib/form-category";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ form?: string }>;
}

export default async function FormCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.category.toLowerCase();
  const formData = FORMS_MAP[categorySlug];

  if (!formData) {
    notFound();
  }

  // Determine which JotForm ID to use
  let activeJotformId: string | undefined;
  let activeTitle: string = formData.title;

  const hasSubForms =
    formData.subForms && Object.keys(formData.subForms).length > 0;

  if (hasSubForms) {
    const formKey = resolvedSearchParams.form;

    // If a specific form key is provided in the URL (e.g., ?form=form-i-90)
    if (formKey && formData.subForms?.[formKey]) {
      activeJotformId = formData.subForms[formKey].jotformId;
      activeTitle = formData.subForms[formKey].title;
    } else {
      // Default to the first sub-form if no query param is provided
      const firstKey = Object.keys(formData.subForms!);
      activeJotformId = formData.subForms![firstKey[0]].jotformId;
      activeTitle = formData.subForms![firstKey[0]].title;
    }
  } else {
    // Standard category with a single form
    activeJotformId = formData.jotformId;
  }

  if (!activeJotformId) {
    notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{activeTitle}</h1>
        <p className="text-muted-foreground">
          Please complete the form below to proceed with your request.
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-xl border shadow-lg bg-white">
        <iframe
          id={`jotform-iframe-${activeJotformId}`}
          title={activeTitle}
          src={`https://form.jotform.com/${activeJotformId}`}
          className="w-full"
          style={{
            minHeight: "800px",
            border: "none",
          }}
          allow="geolocation; microphone; camera; clipboard-read; clipboard-write"
          allowFullScreen
        />
      </div>
    </div>
  );
}
