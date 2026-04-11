export async function getFormSubmissions(formId: string) {
  const apiKey = process.env.JOTFORM_API_KEY;
  const response = await fetch(
    `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch submissions");

  const data = await response.json();
  return data.content;
}
