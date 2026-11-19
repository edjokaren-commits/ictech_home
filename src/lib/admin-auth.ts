import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "ictech_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ictech2026!";
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    `${getAdminPassword()}-ictech-session-signing-key`
  );
}

function signPayload(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function verifyAdminPassword(input: string): boolean {
  const expected = Buffer.from(getAdminPassword(), "utf-8");
  const actual = Buffer.from(input, "utf-8");
  if (expected.length !== actual.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, actual);
}

export function createSessionToken(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresStr, nonce, sig] = parts;
  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSig = signPayload(`${expiresStr}.${nonce}`);
  const expectedBuf = Buffer.from(expectedSig, "utf-8");
  const actualBuf = Buffer.from(sig, "utf-8");
  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
