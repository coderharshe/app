import type { Tenant } from "@prisma/client";
import { } from "@prisma/client";
import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/response";
import { getSessionFromRequest } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { resolveTenantHint } from "@/lib/tenant/resolve";

export async function requireTenantBySlug(
  slug: string,
  options?: { includeSuspended?: boolean }
): Promise<Tenant> {
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant || !tenant.is_active) {
    throw new ApiError(404, "Tenant not found");
  }

  if (!options?.includeSuspended && tenant.status !== "ACTIVE") {
    throw new ApiError(423, "Tenant is suspended");
  }

  return tenant;
}

export async function requireTenantFromRequest(req: NextRequest): Promise<Tenant> {
  const hint = resolveTenantHint(req);
  if (!hint.tenantSlug) {
    throw new ApiError(400, "Tenant context missing. Use subdomain or /store/{slug} path.");
  }
  return requireTenantBySlug(hint.tenantSlug);
}

export async function resolveTenantFromRequest(req: NextRequest): Promise<Tenant> {
  const hint = resolveTenantHint(req);
  if (hint.tenantSlug) {
    return requireTenantBySlug(hint.tenantSlug);
  }

  const querySlug = req.nextUrl.searchParams.get("tenantSlug");
  if (querySlug) {
    return requireTenantBySlug(querySlug);
  }

  const session = getSessionFromRequest(req);
  if (!session) {
    throw new ApiError(400, "Tenant context missing");
  }

  if (!session.tenantId) {
    throw new ApiError(400, "Tenant context missing");
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });
  if (!tenant || !tenant.is_active) {
    throw new ApiError(404, "Tenant not found");
  }

  if (tenant.status !== "ACTIVE") {
    throw new ApiError(423, "Tenant is suspended");
  }

  return tenant;
}
