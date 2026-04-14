import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { getProductsForCheckout } from "@/lib/commerce";
import { sendOrderCreatedEmail, emitWebhookNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { checkoutSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request);
    assertTenantAccess(session, tenant.id);

    const where =
      session.role === "ADMIN"
        ? { tenant_id: tenant.id }
        : { tenant_id: tenant.id, user_id: session.sub };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        payment: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return jsonSuccess({ orders });
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: ["CUSTOMER", "ADMIN"] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = checkoutSchema.parse(await request.json());
    const lineItems = await getProductsForCheckout(tenant.id, body.items);

    const subtotalInPaise = lineItems.reduce((acc, item) => acc + item.lineTotalPaise, 0);
    const totalInPaise = subtotalInPaise;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          tenant_id: tenant.id,
          user_id: session.sub,
          subtotal_in_paise: subtotalInPaise,
          total_in_paise: totalInPaise,
          shipping_name: body.shipping.name,
          shipping_email: body.shipping.email,
          shipping_phone: body.shipping.phone,
          shipping_address_1: body.shipping.address1,
          shipping_address_2: body.shipping.address2,
          shipping_city: body.shipping.city,
          shipping_state: body.shipping.state,
          shipping_postal: body.shipping.postalCode,
          shipping_country: body.shipping.country,
          notes: body.notes,
        },
      });

      await tx.orderItem.createMany({
        data: lineItems.map((item) => ({
          tenant_id: tenant.id,
          order_id: created.id,
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price_paise: item.product.price_in_paise,
          quantity: item.quantity,
          line_total_paise: item.lineTotalPaise,
        })),
      });

      for (const item of lineItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cart.deleteMany({
        where: {
          tenant_id: tenant.id,
          user_id: session.sub,
        },
      });

      return created;
    });

    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await sendOrderCreatedEmail({
      to: user.email,
      tenantName: tenant.name,
      orderId: order.id,
      amountInPaise: order.total_in_paise,
    });

    await emitWebhookNotification({
      tenantId: tenant.id,
      event: "order.created",
      payload: {
        orderId: order.id,
        amountInPaise: order.total_in_paise,
      },
    });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.order.create",
        targetType: "Order",
        targetId: order.id,
        ...meta,
      });
    }

    return jsonSuccess({ orderId: order.id, totalInPaise: order.total_in_paise }, 201);
  });
}
