import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendOrderCreatedEmail(params: {
  to: string;
  tenantName: string;
  orderId: string;
  amountInPaise: number;
}) {
  const transporter = getTransporter();
  if (!transporter || !env.SMTP_FROM_EMAIL) {
    logger.warn("SMTP not configured. Skipping order email.", { to: params.to, orderId: params.orderId });
    return;
  }

  await transporter.sendMail({
    from: env.SMTP_FROM_EMAIL,
    to: params.to,
    subject: `Order ${params.orderId} created`,
    text: `Your order at ${params.tenantName} has been created. Total: INR ${(
      params.amountInPaise / 100
    ).toFixed(2)}.`,
  });
}

export async function emitWebhookNotification(params: {
  tenantId: string;
  event: string;
  payload: Record<string, unknown>;
}) {
  logger.info("Webhook event emitted", {
    tenantId: params.tenantId,
    event: params.event,
    payload: params.payload,
  });
}
