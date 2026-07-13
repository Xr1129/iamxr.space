import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/posts";
import { validateSlug } from "@/lib/editor-utils";
import { requireAuth } from "@/lib/auth";
import type { Post } from "@/lib/posts";

export async function GET() {
  try {
    await requireAuth();
    const posts = getAllPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to read posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const { slug, title, date, excerpt, content } = body as Post;

    // Validate required fields
    if (!slug || !title || !date || content === undefined) {
      return NextResponse.json(
        { error: "slug, title, date, and content are required" },
        { status: 400 }
      );
    }

    if (!validateSlug(slug)) {
      return NextResponse.json(
        { error: "Invalid slug. Use letters, numbers, hyphens, underscores, and Chinese characters." },
        { status: 400 }
      );
    }

    const post: Post = {
      slug,
      title,
      date,
      excerpt: excerpt || "",
      content,
    };

    createPost(post);
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("already exists")) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
