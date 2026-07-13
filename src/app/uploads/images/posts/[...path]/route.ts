import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data/images/posts");
// Fallback to public/ for pre-existing images
const PUBLIC_FALLBACK = path.join(process.cwd(), "public/images/posts");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const relative = segments.join("/");

  // Try data/ first, then public/ fallback
  let filePath = path.join(DATA_DIR, relative);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_FALLBACK, relative);
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  const body = fs.readFileSync(filePath);
  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
