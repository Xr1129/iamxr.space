import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data/guestbook.json");
const UPLOAD_DIR = path.join(process.cwd(), "data/images/posts/guestbook");

interface Message {
  id: number;
  name: string;
  message: string;
  image?: string;
  date: string;
}

function readMessages(): Message[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeMessages(msgs: Message[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2), "utf8");
}

export async function GET() {
  const msgs = readMessages();
  return NextResponse.json({ messages: msgs });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Image + text via FormData
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const message = formData.get("message") as string;
      const file = formData.get("image") as File | null;

      if (!name?.trim() || !message?.trim()) {
        return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
      }
      if (name.length > 50 || message.length > 1000) {
        return NextResponse.json({ error: "Name max 50, message max 1000" }, { status: 400 });
      }

      let imageUrl: string | undefined;

      if (file && file.size > 0) {
        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
          return NextResponse.json({ error: "Image must be JPEG/PNG/WebP/GIF" }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: "Image max 10MB" }, { status: 400 });
        }

        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}.${ext}`;
        const buf = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);
        imageUrl = `/uploads/images/posts/guestbook/${filename}`;
      }

      const msgs = readMessages();
      const msg: Message = {
        id: Date.now(),
        name: name.trim(),
        message: message.trim(),
        image: imageUrl,
        date: new Date().toISOString().replace("T", " ").split(".")[0],
      };
      msgs.unshift(msg);
      writeMessages(msgs);

      return NextResponse.json({ ok: true, message: msg }, { status: 201 });
    }

    // Plain JSON (text only)
    const { name, message } = await request.json();
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }
    if (name.length > 50 || message.length > 1000) {
      return NextResponse.json({ error: "Name max 50, message max 1000" }, { status: 400 });
    }

    const msgs = readMessages();
    const msg: Message = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().replace("T", " ").split(".")[0],
    };
    msgs.unshift(msg);
    writeMessages(msgs);

    return NextResponse.json({ ok: true, message: msg }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
