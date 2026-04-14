import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { authCookie, signJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const body = loginSchema.parse(await request.json());

    const user = await prisma.user.findFirst({
      where: {
        email: body.email.toLowerCase(),
        tenant: body.tenantSlug
          ? {
              slug: body.tenantSlug,
            }
          : undefined,
      },
      include: {
        tenant: true,
      },
    });

    if (!user || user.role === UserRole.SUPER_ADMIN || !user.is_active || !user.tenant.is_active) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(body.password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signJwt({
      sub: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      email: user.email,
      name: user.name,
      scope: "tenant",
    });

    const response = jsonSuccess({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id: user.tenant.id,
        slug: user.tenant.slug,
        name: user.tenant.name,
      },
    });

    response.cookies.set(authCookie(token));
    return response;
  });
}
