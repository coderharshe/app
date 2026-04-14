import { NextRequest, NextResponse } from "next/server";
import { ImpersonationStatus, UserRole } from "@prisma/client";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { authCookie, signJwt } from "@/lib/auth/jwt";
import { getSessionFromRequest, requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { impersonationStopSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const tenantSession = requireAuth(request, { scope: "tenant", roles: [UserRole.ADMIN] });
    if (!tenantSession.actorSuperAdminId || !tenantSession.impersonationSessionId) {
      throw new ApiError(400, "No active impersonation session");
    }

    const contentType = request.headers.get("content-type") ?? "";
    const isForm = !contentType.includes("application/json");
    let sessionId: string;

    if (!isForm) {
      const parsed = impersonationStopSchema.parse(await request.json());
      sessionId = parsed.sessionId;
    } else {
      const form = await request.formData();
      const parsed = impersonationStopSchema.parse({ sessionId: String(form.get("sessionId") ?? "") });
      sessionId = parsed.sessionId;
    }

    if (sessionId !== tenantSession.impersonationSessionId) {
      throw new ApiError(400, "Invalid impersonation session id");
    }

    const impersonation = await prisma.impersonationSession.findUnique({
      where: { id: sessionId },
    });

    if (!impersonation || impersonation.super_admin_id !== tenantSession.actorSuperAdminId) {
      throw new ApiError(404, "Impersonation session not found");
    }

    await prisma.impersonationSession.update({
      where: { id: impersonation.id },
      data: {
        status: ImpersonationStatus.ENDED,
        ended_at: new Date(),
      },
    });

    const superAdmin = await prisma.platformAdmin.findUnique({
      where: { id: tenantSession.actorSuperAdminId },
    });

    if (!superAdmin || !superAdmin.is_active) {
      throw new ApiError(401, "Super admin account not found");
    }

    const token = signJwt({
      sub: superAdmin.id,
      tenantId: null,
      role: UserRole.SUPER_ADMIN,
      email: superAdmin.email,
      name: superAdmin.name,
      scope: "platform",
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: superAdmin.id,
      effectiveUserId: tenantSession.sub,
      tenantId: impersonation.tenant_id,
      action: "super_admin.impersonation.stop",
      targetType: "ImpersonationSession",
      targetId: impersonation.id,
      ...meta,
    });

    if (isForm) {
      const redirectResponse = NextResponse.redirect(new URL("/super-admin", request.url));
      redirectResponse.cookies.set(authCookie(token));
      return redirectResponse;
    }

    const response = jsonSuccess({ stopped: true });
    response.cookies.set(authCookie(token));
    return response;
  });
}

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const session = getSessionFromRequest(request);
    if (!session?.actorSuperAdminId) {
      return jsonSuccess({ active: false });
    }

    const record = await prisma.impersonationSession.findUnique({
      where: { id: session.impersonationSessionId },
      include: {
        tenant: { select: { id: true, slug: true, name: true } },
        tenant_admin: { select: { id: true, name: true, email: true } },
      },
    });

    if (!record || record.status !== ImpersonationStatus.ACTIVE || record.expires_at < new Date()) {
      return jsonSuccess({ active: false });
    }

    return jsonSuccess({ active: true, session: record });
  });
}
