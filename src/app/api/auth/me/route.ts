import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getSessionFromRequest } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const session = getSessionFromRequest(request);
    if (!session) {
      return jsonSuccess({ user: null, tenant: null, scope: null });
    }

    if (session.scope === "platform") {
      const admin = await prisma.platformAdmin.findUnique({ where: { id: session.sub } });
      if (!admin || !admin.is_active) {
        return jsonSuccess({ user: null, tenant: null, scope: null });
      }

      return jsonSuccess({
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: "SUPER_ADMIN",
        },
        tenant: null,
        scope: "platform",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      include: { tenant: true },
    });

    if (!user || !user.is_active || !user.tenant.is_active) {
      return jsonSuccess({ user: null, tenant: null, scope: null });
    }

    return jsonSuccess({
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
      scope: "tenant",
    });
  });
}
