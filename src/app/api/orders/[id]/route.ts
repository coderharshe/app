import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const { id } = await context.params;
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request);
    assertTenantAccess(session, tenant.id);

    const order = await prisma.order.findFirst({
      where: {
        id,
        tenant_id: tenant.id,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (session.role !== "ADMIN" && order.user_id !== session.sub) {
      throw new ApiError(403, "Cross-user order access denied");
    }

    return jsonSuccess({ order });
  });
}
