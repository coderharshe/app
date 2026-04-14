import type { NextRequest } from "next/server";
import { headers } from "next/headers";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "localhost";
const RESERVED_SUBDOMAINS = new Set(["www", "app", "admin", "api", "localhost"]);

export type TenantHint = {
  tenantSlug: string | null;
  source: "subdomain" | "path" | "none";
};

export function parseTenantFromHost(host: string): string | null {
  const normalizedHost = host.split(":")[0].toLowerCase();

  if (normalizedHost.endsWith(`.${ROOT_DOMAIN}`)) {
    const candidate = normalizedHost.replace(`.${ROOT_DOMAIN}`, "");
    if (!candidate || RESERVED_SUBDOMAINS.has(candidate)) {
      return null;
    }
    return candidate;
  }

  if (normalizedHost.endsWith(".localhost")) {
    const candidate = normalizedHost.replace(".localhost", "");
    if (!candidate || RESERVED_SUBDOMAINS.has(candidate)) {
      return null;
    }
    return candidate;
  }

  return null;
}

export function parseTenantFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "store" && parts[1]) {
    return parts[1].toLowerCase();
  }
  return null;
}

export function resolveTenantHint(req: NextRequest): TenantHint {
  const hostTenant = parseTenantFromHost(req.headers.get("host") ?? "");
  if (hostTenant) {
    return { tenantSlug: hostTenant, source: "subdomain" };
  }

  const pathTenant = parseTenantFromPath(req.nextUrl.pathname);
  if (pathTenant) {
    return { tenantSlug: pathTenant, source: "path" };
  }

  return { tenantSlug: null, source: "none" };
}

export async function getTenantHintFromHeaders(): Promise<TenantHint> {
  const headerStore = await headers();
  const slug = headerStore.get("x-tenant-slug");
  const sourceHeader = headerStore.get("x-tenant-source");
  const source =
    sourceHeader === "subdomain" || sourceHeader === "path" ? sourceHeader : "none";

  if (slug) {
    return {
      tenantSlug: slug,
      source,
    };
  }

  const pathname = headerStore.get("x-pathname") ?? "";
  const pathTenant = parseTenantFromPath(pathname);
  if (pathTenant) {
    return { tenantSlug: pathTenant, source: "path" };
  }

  return { tenantSlug: null, source: "none" };
}
