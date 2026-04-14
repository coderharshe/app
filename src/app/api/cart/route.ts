import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { toCartJson } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { updateCartSchema } from "@/lib/validators";

type CartJsonItem = {
  productId: string;
  quantity: number;
};

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request);
    assertTenantAccess(session, tenant.id);

    const cart = await prisma.cart.findUnique({
      where: {
        tenant_id_user_id: {
          tenant_id: tenant.id,
          user_id: session.sub,
        },
      },
    });

    const items = ((cart?.items_json as CartJsonItem[] | null) ?? []).filter(Boolean);
    const products = await prisma.product.findMany({
      where: {
        tenant_id: tenant.id,
        id: { in: items.map((item) => item.productId) },
      },
      select: {
        id: true,
        name: true,
        price_in_paise: true,
        image_url: true,
      },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const hydrated = items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) {
          return null;
        }

        return {
          productId: item.productId,
          name: product.name,
          imageUrl: product.image_url,
          priceInPaise: product.price_in_paise,
          quantity: item.quantity,
          lineTotalPaise: product.price_in_paise * item.quantity,
        };
      })
      .filter(Boolean);

    return jsonSuccess({ items: hydrated });
  });
}

export async function PUT(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request);
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = updateCartSchema.parse(await request.json());

    await prisma.cart.upsert({
      where: {
        tenant_id_user_id: {
          tenant_id: tenant.id,
          user_id: session.sub,
        },
      },
      update: {
        items_json: toCartJson(body.items),
      },
      create: {
        tenant_id: tenant.id,
        user_id: session.sub,
        items_json: toCartJson(body.items),
      },
    });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.cart.update",
        targetType: "Cart",
        targetId: session.sub,
        ...meta,
      });
    }

    return jsonSuccess({ updated: true });
  });
}

export async function DELETE(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request);
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    await prisma.cart.deleteMany({
      where: {
        tenant_id: tenant.id,
        user_id: session.sub,
      },
    });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.cart.clear",
        targetType: "Cart",
        targetId: session.sub,
        ...meta,
      });
    }

    return jsonSuccess({ cleared: true });
  });
}
