import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { requirePlatformAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return withApiHandler(async () => {
    requirePlatformAuth(request);
    const { id } = await context.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    return jsonSuccess({ tenant });
  });
}
