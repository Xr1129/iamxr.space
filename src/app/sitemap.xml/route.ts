import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = "https://iamxr.space";
  const posts = getAllPosts();

  const urls = [
    { loc: "", priority: "1.0" },
    { loc: "/blog", priority: "0.9" },
    { loc: "/about", priority: "0.7" },
    { loc: "/projects", priority: "0.7" },
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, priority: "0.8" })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (u) => `
  <url>
    <loc>${siteUrl}${u.loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
