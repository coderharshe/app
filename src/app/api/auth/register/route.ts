import bcrypt from "bcryptjs";
import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { authCookie, signJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const body = registerSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(body.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      if (body.role === "ADMIN") {
        const tenantSlug = body.tenantSlug ?? slugify(body.tenantName!);

        const existingTenant = await tx.tenant.findUnique({ where: { slug: tenantSlug } });
        if (existingTenant) {
          throw new ApiError(409, "Tenant slug is already taken");
        }

        const tenant = await tx.tenant.create({
          data: {
            slug: tenantSlug,
            name: body.tenantName!,
          },
        });

        const user = await tx.user.create({
          data: {
            tenant_id: tenant.id,
            name: body.name,
            email: body.email.toLowerCase(),
            password_hash: passwordHash,
            role: "ADMIN",
          },
        });

        return { tenant, user };
      }

      const tenant = await tx.tenant.findUnique({
        where: { slug: body.tenantSlug },
      });

      if (!tenant || !tenant.is_active) {
        throw new ApiError(404, "Tenant not found");
      }

      const user = await tx.user.create({
        data: {
          tenant_id: tenant.id,
          name: body.name,
          email: body.email.toLowerCase(),
          password_hash: passwordHash,
          role: "CUSTOMER",
        },
      });

      return { tenant, user };
    });

    const token = signJwt({
      sub: result.user.id,
      tenantId: result.tenant.id,
      role: result.user.role,
      email: result.user.email,
      name: result.user.name,
      scope: "tenant",
    });

    const response = jsonSuccess(
      {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        tenant: {
          id: result.tenant.id,
          slug: result.tenant.slug,
          name: result.tenant.name,
        },
      },
      201
    );

    response.cookies.set(authCookie(token));
    return response;
  });
}
