import { NextRequest } from "next/server";
import { } from "@prisma/client";
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
    const body = (await request.json().catch(() => ({}))) as { reason?: string };

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const reason = body.reason?.trim();
    if (!reason) {
      throw new ApiError(400, "Suspension reason is required");
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        status: "SUSPENDED",
        suspended_reason: reason,
        suspended_at: new Date(),
        suspended_by: session.sub,
      },
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: session.sub,
      tenantId: updated.id,
      action: "super_admin.tenant.suspend",
      targetType: "Tenant",
      targetId: updated.id,
      metadata: { reason },
      ...meta,
    });

    return jsonSuccess({ tenant: updated });
  });
}
