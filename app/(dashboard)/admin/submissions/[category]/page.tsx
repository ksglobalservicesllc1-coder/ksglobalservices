import { FORMS_MAP } from "@/lib/form-category";
import { getFormSubmissions } from "@/lib/submissions-jotform";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function AdminFormPage({ params }: PageProps) {
  const { category } = await params;
  const formData = FORMS_MAP[category.toLowerCase()];

  if (!formData || !formData.jotformId) notFound();

  const submissions = await getFormSubmissions(formData.jotformId);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{formData.title} Submissions</h1>
        <p className="text-muted-foreground">
          View all entries submitted via Jotform.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub: any) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.id}</TableCell>
                <TableCell>
                  {new Date(sub.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {sub.status || "Completed"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={`https://www.jotform.com/submission/${sub.id}`}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
