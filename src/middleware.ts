import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware
 *
 * Runs on every matched request. Will be configured for Firebase Auth 
 * session cookies or token verification later.
 */
export async function middleware(request: NextRequest) {
  // Pass through for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - Public assets (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
