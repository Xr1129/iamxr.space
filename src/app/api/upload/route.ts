import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sanitizeFilename } from "@/lib/editor-utils";
import { requireAuth } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "data/images/posts");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: "file and slug are required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    // Create slug directory
    const dir = path.join(UPLOAD_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });

    // Generate unique filename
    const originalName = sanitizeFilename(file.name || "image.png");
    const ts = Date.now();
    const filename = `${ts}-${originalName}`;
    const filePath = path.join(dir, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/images/posts/${slug}/${filename}`;
    const markdown = `![${originalName.replace(/\.[^.]+$/, "")}](${url})`;

    return NextResponse.json({ ok: true, url, markdown }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
