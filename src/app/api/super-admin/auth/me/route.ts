import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getSessionFromRequest, requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const session = getSessionFromRequest(request);
    if (!session || session.scope !== "platform") {
      return jsonSuccess({ admin: null });
    }

    const admin = await prisma.platformAdmin.findUnique({ where: { id: session.sub } });
    if (!admin || !admin.is_active) {
      return jsonSuccess({ admin: null });
    }

    return jsonSuccess({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withApiHandler(async () => {
    requirePlatformAuth(request);
    return jsonSuccess({ message: "Use POST /api/super-admin/auth/logout to logout." });
  });
}
