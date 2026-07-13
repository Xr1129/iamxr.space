import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx") || filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stat = fs.statSync(fullPath);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? stat.mtime.toISOString().split("T")[0],
        excerpt: data.excerpt ?? "",
        tags: data.tags ?? [],
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(mdPath)) return null;
  }

  const filePath = fs.existsSync(fullPath)
    ? fullPath
    : path.join(postsDirectory, `${slug}.md`);

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stat = fs.statSync(filePath);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? stat.mtime.toISOString().split("T")[0],
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    content,
  };
}
