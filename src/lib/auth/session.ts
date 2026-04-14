import { } from "@prisma/client";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/response";
import { AUTH_COOKIE_NAME, type SessionPayload, verifyJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

function getTokenFromAuthHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  const fromHeader = getTokenFromAuthHeader(request);
  const fromCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const token = fromHeader ?? fromCookie;

  if (!token) {
    return null;
  }

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

export function requireAuth(
  request: NextRequest,
  options?: { roles?: string[]; scope?: "tenant" | "platform" }
): SessionPayload {
  const session = getSessionFromRequest(request);
  if (!session) {
    throw new ApiError(401, "Authentication required");
  }

  const expectedScope = options?.scope ?? "tenant";
  if (session.scope !== expectedScope) {
    throw new ApiError(403, "Invalid session scope for this resource");
  }

  if (options?.roles && !options.roles.includes(session.role)) {
    throw new ApiError(403, "You do not have access to this resource");
  }

  return session;
}

export function requirePlatformAuth(request: NextRequest): SessionPayload {
  return requireAuth(request, { roles: ["SUPER_ADMIN"], scope: "platform" });
}

export async function assertImpersonationActive(session: SessionPayload) {
  if (!session.impersonationSessionId || !session.actorSuperAdminId) {
    return;
  }

  const record = await prisma.impersonationSession.findUnique({
    where: { id: session.impersonationSessionId },
  });

  if (!record || record.super_admin_id !== session.actorSuperAdminId) {
    throw new ApiError(401, "Invalid impersonation session");
  }

  if (record.status !== "ACTIVE") {
    throw new ApiError(401, "Impersonation session is no longer active");
  }

  if (record.expires_at < new Date()) {
    await prisma.impersonationSession.update({
      where: { id: record.id },
      data: { status: "EXPIRED", ended_at: new Date() },
    });
    throw new ApiError(401, "Impersonation session expired");
  }
}

export function assertTenantAccess(session: SessionPayload, tenantId: string) {
  if (session.scope !== "tenant") {
    throw new ApiError(403, "Tenant scope required");
  }
  if (!session.tenantId || session.tenantId !== tenantId) {
    throw new ApiError(403, "Cross-tenant access denied");
  }
}
