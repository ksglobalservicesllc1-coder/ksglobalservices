export function createSlug(text: string) {
  return text
    .replace(/&/g, "")
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function slugToCategory(slug: string, categories: readonly string[]) {
  return categories.find((cat) => createSlug(cat) === slug);
}
