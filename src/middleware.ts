import { NextRequest, NextResponse } from "next/server";
import { resolveTenantHint } from "@/lib/tenant/resolve";
import { checkRateLimit } from "@/lib/api/rate-limit";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const tenantHint = resolveTenantHint(request);

  if (tenantHint.tenantSlug) {
    response.headers.set("x-tenant-slug", tenantHint.tenantSlug);
    response.headers.set("x-tenant-source", tenantHint.source);
  }

  response.headers.set("x-pathname", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const key = `${ip}:${request.nextUrl.pathname}`;
    const limitResult = checkRateLimit(key, {
      limit: 100,
      windowMs: 60_000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Too many requests. Try again shortly." },
        },
        {
          status: 429,
          headers: {
            "x-ratelimit-limit": "100",
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": `${Math.ceil(limitResult.resetAt / 1000)}`,
          },
        }
      );
    }

    response.headers.set("x-ratelimit-limit", "100");
    response.headers.set("x-ratelimit-remaining", `${limitResult.remaining}`);
    response.headers.set("x-ratelimit-reset", `${Math.ceil(limitResult.resetAt / 1000)}`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
