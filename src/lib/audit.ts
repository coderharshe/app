import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditInput = {
  actorSuperAdminId?: string | null;
  effectiveUserId?: string | null;
  tenantId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function writeAuditLog(input: AuditInput) {
  await prisma.auditLog.create({
    data: {
      actor_super_admin_id: input.actorSuperAdminId ?? null,
      effective_user_id: input.effectiveUserId ?? null,
      tenant_id: input.tenantId ?? null,
      action: input.action,
      target_type: input.targetType,
      target_id: input.targetId ?? null,
      metadata_json: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
    },
  });
}

export function getRequestMeta(headers: Headers) {
  return {
    ipAddress: headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: headers.get("user-agent"),
  };
}
