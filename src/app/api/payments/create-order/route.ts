import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { createProviderOrder } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { paymentCreateSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: ["CUSTOMER", "ADMIN"] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = paymentCreateSchema.parse(await request.json());

    const order = await prisma.order.findFirst({
      where: {
        id: body.orderId,
        tenant_id: tenant.id,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (session.role !== "ADMIN" && order.user_id !== session.sub) {
      throw new ApiError(403, "You cannot pay for this order");
    }

    if (order.payment?.status === "SUCCESS") {
      throw new ApiError(409, "Order has already been paid");
    }

    const providerOrder = await createProviderOrder(
      order.total_in_paise,
      `order_${order.id.slice(0, 18)}`
    );

    const payment = await prisma.payment.upsert({
      where: {
        order_id: order.id,
      },
      update: {
        provider_order_id: providerOrder.id,
        amount_in_paise: order.total_in_paise,
        currency: order.currency,
      },
      create: {
        tenant_id: tenant.id,
        order_id: order.id,
        provider_order_id: providerOrder.id,
        amount_in_paise: order.total_in_paise,
        currency: order.currency,
      },
    });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.payment.create_order",
        targetType: "Payment",
        targetId: payment.id,
        metadata: { orderId: order.id },
        ...meta,
      });
    }

    return jsonSuccess({
      orderId: order.id,
      paymentId: payment.id,
      razorpayOrderId: providerOrder.id,
      amountInPaise: order.total_in_paise,
      currency: order.currency,
    });
  });
}
