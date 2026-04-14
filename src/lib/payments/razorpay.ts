import crypto from "crypto";
import Razorpay from "razorpay";
import { ApiError } from "@/lib/api/response";
import { env } from "@/lib/env";

function getRazorpayClient() {
  if (!env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay environment is not configured");
  }

  return new Razorpay({
    key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export async function createProviderOrder(amountInPaise: number, receipt: string) {
  const razorpay = getRazorpayClient();
  return razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
  });
}

export function verifyProviderSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  if (!env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay secret is not configured");
  }

  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === params.razorpaySignature;
}
