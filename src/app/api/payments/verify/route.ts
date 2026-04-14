import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { verifyProviderSignature } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { paymentVerifySchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: ["CUSTOMER", "ADMIN"] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = paymentVerifySchema.parse(await request.json());

    const order = await prisma.order.findFirst({
      where: {
        id: body.orderId,
        tenant_id: tenant.id,
      },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      throw new ApiError(404, "Order payment record not found");
    }

    if (session.role !== "ADMIN" && order.user_id !== session.sub) {
      throw new ApiError(403, "You cannot verify this order");
    }

    const isSignatureValid = verifyProviderSignature({
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    });

    if (!isSignatureValid) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "FAILED",
          provider_payment_id: body.razorpayPaymentId,
          provider_signature: body.razorpaySignature,
        },
      });
      throw new ApiError(400, "Payment signature verification failed");
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "SUCCESS",
          provider_payment_id: body.razorpayPaymentId,
          provider_signature: body.razorpaySignature,
          verified_at: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      }),
    ]);

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.payment.verify",
        targetType: "Payment",
        targetId: order.payment.id,
        metadata: { orderId: order.id },
        ...meta,
      });
    }

    return jsonSuccess({ paid: true, orderId: order.id });
  });
}
