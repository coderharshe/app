import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { productSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);

    const products = await prisma.product.findMany({
      where: {
        tenant_id: tenant.id,
        is_active: true,
      },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price_in_paise: true,
        compare_at_paise: true,
        currency: true,
        image_url: true,
        inventory: true,
      },
    });

    return jsonSuccess({
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
      products,
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: [UserRole.ADMIN] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = productSchema.parse(await request.json());

    const product = await prisma.product.create({
      data: {
        tenant_id: tenant.id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        price_in_paise: body.priceInPaise,
        compare_at_paise: body.compareAtPaise,
        currency: body.currency,
        image_url: body.imageUrl,
        inventory: body.inventory,
        is_active: body.isActive,
      },
    });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.product.create",
        targetType: "Product",
        targetId: product.id,
        metadata: { name: product.name },
        ...meta,
      });
    }

    return jsonSuccess(product, 201);
  });
}
