export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "untitled";
}

export function validateSlug(slug: string): boolean {
  return /^[a-zA-Z0-9一-鿿_-]+$/.test(slug) && slug.length > 0 && slug.length <= 120;
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\s]+/g, "-")
    .replace(/[^\w.\-]/g, "")
    .replace(/--+/g, "-")
    .slice(0, 200);
}

