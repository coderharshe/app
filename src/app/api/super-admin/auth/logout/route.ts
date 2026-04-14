import { NextRequest } from "next/server";
import { jsonSuccess, withApiHandler } from "@/lib/api/response";
import { getRequestMeta, writeAuditLog } from "@/lib/audit";
import { clearAuthCookie } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const session = getSessionFromRequest(request);

    if (session?.scope === "platform") {
      const meta = getRequestMeta(request.headers);
      await writeAuditLog({
        actorSuperAdminId: session.sub,
        action: "super_admin.auth.logout",
        targetType: "PlatformAdmin",
        targetId: session.sub,
        ...meta,
      });
    }

    const response = jsonSuccess({ message: "Logged out" });
    response.cookies.set(clearAuthCookie());
    return response;
  });
}
