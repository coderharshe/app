import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { assertImpersonationActive, assertTenantAccess, requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenant/context";
import { productSchema } from "@/lib/validators";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const { id } = await context.params;
    const tenant = await resolveTenantFromRequest(request);

    const product = await prisma.product.findFirst({
      where: {
        id,
        tenant_id: tenant.id,
      },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return jsonSuccess(product);
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const { id } = await context.params;
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: [UserRole.ADMIN] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const body = productSchema.partial().parse(await request.json());

    const existing = await prisma.product.findFirst({
      where: { id, tenant_id: tenant.id },
    });

    if (!existing) {
      throw new ApiError(404, "Product not found");
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
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
        action: "impersonation.product.update",
        targetType: "Product",
        targetId: product.id,
        ...meta,
      });
    }

    return jsonSuccess(product);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    const { id } = await context.params;
    const tenant = await resolveTenantFromRequest(request);
    const session = requireAuth(request, { roles: [UserRole.ADMIN] });
    assertTenantAccess(session, tenant.id);
    await assertImpersonationActive(session);

    const existing = await prisma.product.findFirst({
      where: { id, tenant_id: tenant.id },
    });

    if (!existing) {
      throw new ApiError(404, "Product not found");
    }

    await prisma.product.delete({ where: { id } });

    if (session.actorSuperAdminId) {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.actorSuperAdminId,
        effectiveUserId: session.sub,
        tenantId: tenant.id,
        action: "impersonation.product.delete",
        targetType: "Product",
        targetId: id,
        ...meta,
      });
    }

    return jsonSuccess({ deleted: true });
  });
}
