import { NextRequest } from "next/server";
import { TenantStatus } from "@prisma/client";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const session = requirePlatformAuth(request);
    const { id } = await context.params;

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.ACTIVE,
        suspended_reason: null,
        suspended_at: null,
        suspended_by: null,
      },
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: session.sub,
      tenantId: updated.id,
      action: "super_admin.tenant.activate",
      targetType: "Tenant",
      targetId: updated.id,
      ...meta,
    });

    return jsonSuccess({ tenant: updated });
  });
}
