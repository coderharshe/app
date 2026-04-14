import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const requiredRouteFiles = [
  "src/app/page.tsx",
  "src/app/login/page.tsx",
  "src/app/onboarding/page.tsx",
  "src/app/cart/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/product/[id]/page.tsx",
  "src/app/store/[storeSlug]/page.tsx",
  "src/app/super-admin/page.tsx",
  "src/app/super-admin/login/page.tsx",
  "src/app/super-admin/tenants/page.tsx",
  "src/app/super-admin/audit/page.tsx",
];

export function runRouteSmokeTests() {
  for (const routeFile of requiredRouteFiles) {
    const fullPath = path.join(process.cwd(), routeFile);
    assert.equal(
      fs.existsSync(fullPath),
      true,
      `Missing route file: ${routeFile}`
    );
  }
}
