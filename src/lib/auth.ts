import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return secret;
}

function base64url(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function decodeBase64url(str: string): string {
  return Buffer.from(str, "base64url").toString();
}

export function signToken(): string {
  const secret = getSecret();
  const payload = JSON.stringify({
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
  });
  const encoded = base64url(payload);
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token: string): boolean {
  try {
    const secret = getSecret();
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return false;

    const expectedSig = createHmac("sha256", secret).update(encoded).digest("base64url");
    if (
      expectedSig.length !== signature.length ||
      !timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))
    ) {
      return false;
    }

    const payload = JSON.parse(decodeBase64url(encoded));
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const stored = process.env.EDITOR_PASSWORD;
  if (!stored) throw new Error("EDITOR_PASSWORD is not set");
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  if (a.length !== b.length) {
    return timingSafeEqual(Buffer.from(stored), Buffer.from(stored)) && false;
  }
  return timingSafeEqual(a, b);
}

// Check auth from cookies — for use in API routes
export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("editor_token")?.value;
  if (!token || !verifyToken(token)) {
    throw new Error("Unauthorized");
  }
}
