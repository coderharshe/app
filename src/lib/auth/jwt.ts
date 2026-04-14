import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import type { } from "@prisma/client";
import { env, isProd } from "@/lib/env";

export const AUTH_COOKIE_NAME = "auth_token";

export type SessionPayload = {
  sub: string;
  tenantId: string | null;
  role: string;
  email: string;
  name: string;
  scope: "tenant" | "platform";
  actorSuperAdminId?: string;
  impersonationSessionId?: string;
  effectiveUserId?: string;
};

export function signJwt(payload: SessionPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET as Secret, options);
}

export function verifyJwt(token: string): SessionPayload {
  return jwt.verify(token, env.JWT_SECRET as Secret) as SessionPayload;
}

export function authCookie(token: string): ResponseCookie {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookie(): ResponseCookie {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  };
}
