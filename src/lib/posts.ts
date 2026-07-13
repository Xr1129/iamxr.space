import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
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
        date: data.date ?? stat.mtime.toISOString().replace("T", " ").split(".")[0],
        updated: data.updated ?? undefined,
        excerpt: data.excerpt ?? "",
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
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
    date: data.date ?? stat.mtime.toISOString().replace("T", " ").split(".")[0],
    updated: data.updated ?? undefined,
    excerpt: data.excerpt ?? "",
    content,
  };
}

// ── Editor write functions ──────────────────────────────────

export function createPost(post: Post): void {
  const mdx = buildMdx(post);
  const filePath = path.join(postsDirectory, `${post.slug}.mdx`);
  if (fs.existsSync(filePath)) {
    throw new Error(`Post "${post.slug}" already exists`);
  }
  fs.writeFileSync(filePath, mdx, "utf8");
}

export function updatePost(post: Post): void {
  const mdx = buildMdx(post);
  const filePath = path.join(postsDirectory, `${post.slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    // Also try .md
    const mdPath = path.join(postsDirectory, `${post.slug}.md`);
    if (!fs.existsSync(mdPath)) {
      throw new Error(`Post "${post.slug}" not found`);
    }
    fs.writeFileSync(mdPath, mdx, "utf8");
    return;
  }
  fs.writeFileSync(filePath, mdx, "utf8");
}

export function deletePost(slug: string): void {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(mdxPath)) {
    fs.unlinkSync(mdxPath);
  } else if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
  } else {
    throw new Error(`Post "${slug}" not found`);
  }
}

function buildMdx(post: Post): string {
  const lines = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: "${post.date}"`,
  ];
  if (post.updated) {
    lines.push(`updated: "${post.updated}"`);
  }
  lines.push(`excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`);
  lines.push("---");
  return lines.join("\n") + "\n\n" + post.content;
}
