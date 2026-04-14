import { NextRequest } from "next/server";
import { ImpersonationStatus, UserRole } from "@prisma/client";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { authCookie, signJwt } from "@/lib/auth/jwt";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { impersonationStartSchema } from "@/lib/validators";

const IMPERSONATION_TTL_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const session = requirePlatformAuth(request);
    const body = impersonationStartSchema.parse(await request.json());

    const tenant = await prisma.tenant.findUnique({ where: { id: body.tenantId } });
    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const tenantAdmin = await prisma.user.findFirst({
      where: {
        id: body.tenantAdminUserId,
        tenant_id: body.tenantId,
        role: UserRole.ADMIN,
        is_active: true,
      },
    });

    if (!tenantAdmin) {
      throw new ApiError(404, "Tenant admin user not found");
    }

    await prisma.impersonationSession.updateMany({
      where: {
        super_admin_id: session.sub,
        status: ImpersonationStatus.ACTIVE,
      },
      data: {
        status: ImpersonationStatus.ENDED,
        ended_at: new Date(),
      },
    });

    const expiresAt = new Date(Date.now() + IMPERSONATION_TTL_MS);
    const impersonation = await prisma.impersonationSession.create({
      data: {
        super_admin_id: session.sub,
        tenant_id: body.tenantId,
        tenant_admin_id: tenantAdmin.id,
        reason: body.reason,
        expires_at: expiresAt,
      },
    });

    const token = signJwt({
      sub: tenantAdmin.id,
      tenantId: tenant.id,
      role: UserRole.ADMIN,
      email: tenantAdmin.email,
      name: tenantAdmin.name,
      scope: "tenant",
      actorSuperAdminId: session.sub,
      impersonationSessionId: impersonation.id,
      effectiveUserId: tenantAdmin.id,
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: session.sub,
      effectiveUserId: tenantAdmin.id,
      tenantId: tenant.id,
      action: "super_admin.impersonation.start",
      targetType: "ImpersonationSession",
      targetId: impersonation.id,
      metadata: { reason: body.reason, expiresAt: expiresAt.toISOString() },
      ...meta,
    });

    const response = jsonSuccess({
      session: impersonation,
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
      effectiveUser: { id: tenantAdmin.id, email: tenantAdmin.email, name: tenantAdmin.name },
    });
    response.cookies.set(authCookie(token));
    return response;
  });
}
