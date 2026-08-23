import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export type Session = {
  userId: number;
  email: string;
  role: "USER" | "ADMIN";
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters");
  }
  return secret;
}

export function signSession(payload: Session) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d", algorithm: "HS256" });
}

export function verifySession(token?: string): Session | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getSecret(), { algorithms: ["HS256"] }) as JwtPayload;
    if (
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string" ||
      (decoded.role !== "USER" && decoded.role !== "ADMIN")
    ) return null;
    return { userId: decoded.userId, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySession(store.get("session")?.value);
}
