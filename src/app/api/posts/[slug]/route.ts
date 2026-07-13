import { NextResponse } from "next/server";
import { getPostBySlug, updatePost, deletePost } from "@/lib/posts";
import { requireAuth } from "@/lib/auth";
import type { Post } from "@/lib/posts";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const existing = getPostBySlug(slug);

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post: Post = {
      slug,
      title: body.title ?? existing.title,
      date: body.date ?? existing.date,
      updated: body.updated ?? existing.updated,
      excerpt: body.excerpt ?? existing.excerpt,
      content: body.content ?? existing.content,
    };

    updatePost(post);
    return NextResponse.json({ ok: true, post });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;
    deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
