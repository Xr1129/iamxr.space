import { NextResponse } from "next/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import MdxImage from "@/components/mdx-image";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAuth();
    const { content } = await request.json();
    if (typeof content !== "string") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    // Wrap in a simple component to catch errors
    const html = await renderMdxSafe(content);
    return NextResponse.json({ ok: true, html });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "MDX render error" }, { status: 200 });
  }
}

async function renderMdxSafe(content: string): Promise<string> {
  const { renderToString } = await import("react-dom/server");
  try {
    const element = await MDXRemote({
      source: content,
      components: { Image: MdxImage, img: MdxImage as any },
      options: {
        mdxOptions: {
          rehypePlugins: [rehypeHighlight as any, rehypeSlug],
        },
      },
    });
    const html = renderToString(element as any);
    return html;
  } catch (e: any) {
    throw new Error(e.message || "MDX compilation failed");
  }
}
