import { NextRequest } from "next/server";
import { TenantStatus } from "@prisma/client";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const session = requirePlatformAuth(request);
    const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
    const statusFilter = request.nextUrl.searchParams.get("status") as TenantStatus | null;

    const tenants = await prisma.tenant.findMany({
      where: {
        name: search ? { contains: search, mode: "insensitive" } : undefined,
        status: statusFilter && Object.values(TenantStatus).includes(statusFilter) ? statusFilter : undefined,
      },
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            orders: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: session.sub,
      action: "super_admin.tenants.list",
      targetType: "Tenant",
      metadata: { search, statusFilter },
      ...meta,
    });

    return jsonSuccess({ tenants });
  });
}
