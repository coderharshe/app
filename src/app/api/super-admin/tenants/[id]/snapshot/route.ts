import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const session = requirePlatformAuth(request);
    const { id } = await context.params;

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const [recentOrders, topProducts, failedPayments] = await Promise.all([
      prisma.order.findMany({
        where: { tenant_id: id },
        orderBy: { created_at: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          total_in_paise: true,
          created_at: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ["product_id", "product_name"],
        where: { tenant_id: id },
        _sum: { quantity: true, line_total_paise: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),
      prisma.payment.findMany({
        where: { tenant_id: id, status: "FAILED" },
        orderBy: { updated_at: "desc" },
        take: 10,
        select: {
          id: true,
          order_id: true,
          amount_in_paise: true,
          updated_at: true,
        },
      }),
    ]);

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: session.sub,
      tenantId: id,
      action: "super_admin.tenant.snapshot",
      targetType: "Tenant",
      targetId: id,
      ...meta,
    });

    return jsonSuccess({
      tenant,
      snapshot: {
        recentOrders,
        topProducts,
        failedPayments,
      },
    });
  });
}
