import bcrypt from "bcryptjs";
import { } from "@prisma/client";
import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { checkLoginLock, markLoginFailure, resetLoginFailure } from "@/lib/auth/platform-lockout";
import { authCookie, signJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { superAdminLoginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const body = superAdminLoginSchema.parse(await request.json());

    const lock = checkLoginLock(body.email);
    if (lock.locked) {
      throw new ApiError(429, "Too many failed attempts. Try again later.");
    }

    const admin = await prisma.platformAdmin.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!admin || !admin.is_active) {
      markLoginFailure(body.email);
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(body.password, admin.password_hash);
    if (!isValid) {
      markLoginFailure(body.email);
      throw new ApiError(401, "Invalid credentials");
    }

    resetLoginFailure(body.email);

    const token = signJwt({
      sub: admin.id,
      tenantId: null,
      role: "SUPER_ADMIN",
      email: admin.email,
      name: admin.name,
      scope: "platform",
    });

    const meta = getRequestMeta(request.headers);
    await writeAuditLog({
      actorSuperAdminId: admin.id,
      action: "super_admin.auth.login",
      targetType: "PlatformAdmin",
      targetId: admin.id,
      metadata: { email: admin.email },
      ...meta,
    });

    const response = jsonSuccess({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "SUPER_ADMIN",
      },
      scope: "platform",
    });

    response.cookies.set(authCookie(token));
    return response;
  });
}
