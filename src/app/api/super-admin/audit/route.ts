import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    requirePlatformAuth(request);

    const action = request.nextUrl.searchParams.get("action") ?? undefined;
    const tenantId = request.nextUrl.searchParams.get("tenantId") ?? undefined;
    const actor = request.nextUrl.searchParams.get("actor") ?? undefined;
    const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 50), 200);

    const logs = await prisma.auditLog.findMany({
      where: {
        action: action ? { contains: action, mode: "insensitive" } : undefined,
        tenant_id: tenantId,
        actor_super_admin_id: actor,
      },
      orderBy: { created_at: "desc" },
      take: Number.isNaN(limit) ? 50 : limit,
      include: {
        actor_super_admin: {
          select: { id: true, name: true, email: true },
        },
        effective_user: {
          select: { id: true, name: true, email: true },
        },
        tenant: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return jsonSuccess({ logs });
  });
}
