import { } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getActiveTenants = unstable_cache(
  async () => {
    return prisma.tenant.findMany({
      where: { is_active: true, status: "ACTIVE" },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
      },
      take: 24,
    });
  },
  ["tenants-active"],
  { revalidate: 60 }
);

export async function getTenantWithProductsBySlug(slug: string) {
  return prisma.tenant.findFirst({
    where: {
      slug,
      is_active: true,
      status: "ACTIVE",
    },
    include: {
      products: {
        where: { is_active: true },
        orderBy: { created_at: "desc" },
      },
    },
  });
}

export async function getProductByIdAndTenant(productId: string, tenantSlug?: string) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      tenant: tenantSlug
        ? {
            slug: tenantSlug,
            is_active: true,
            status: "ACTIVE",
          }
        : {
            is_active: true,
            status: "ACTIVE",
          },
    },
    include: {
      tenant: true,
    },
  });
}
