import { NextRequest } from "next/server";
import { ApiError, jsonSuccess, withApiHandler } from "@/lib/api/response";
import { env } from "@/lib/env";
import { emitWebhookNotification } from "@/lib/notifications";
import { webhookNotificationSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const secret = request.headers.get("x-internal-webhook-secret");
    if (secret !== env.INTERNAL_WEBHOOK_SECRET) {
      throw new ApiError(401, "Invalid webhook secret");
    }

    const body = webhookNotificationSchema.parse(await request.json());

    await emitWebhookNotification({
      tenantId: body.tenantId,
      event: body.event,
      payload: body.payload,
    });

    return jsonSuccess({ accepted: true });
  });
}
