import { } from "@prisma/client";
import { z } from "zod";

export const slugSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers and hyphens only");

export const registerSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.enum(["ADMIN", "CUSTOMER"]).default("CUSTOMER"),
    tenantSlug: slugSchema.optional(),
    tenantName: z.string().min(2).max(100).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === "ADMIN" && !value.tenantName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "tenantName is required for admin registration",
      });
    }

    if (value.role === "CUSTOMER" && !value.tenantSlug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "tenantSlug is required for customer registration",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  tenantSlug: slugSchema.optional(),
});

export const superAdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const productSchema = z.object({
  name: z.string().min(2).max(140),
  slug: slugSchema,
  description: z.string().min(10).max(5000),
  priceInPaise: z.coerce.number().int().min(100),
  compareAtPaise: z.coerce.number().int().min(100).optional(),
  currency: z.string().default("INR"),
  imageUrl: z.string().url().optional(),
  inventory: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(20),
});

export const updateCartSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shipping: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(8).max(20),
    address1: z.string().min(5).max(200),
    address2: z.string().max(200).optional(),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    postalCode: z.string().min(3).max(12),
    country: z.string().default("IN"),
  }),
  notes: z.string().max(1000).optional(),
});

export const paymentCreateSchema = z.object({
  orderId: z.string().uuid(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().min(5),
  razorpayPaymentId: z.string().min(5),
  razorpaySignature: z.string().min(10),
});

export const webhookNotificationSchema = z.object({
  tenantId: z.string().uuid(),
  event: z.string().min(2),
  payload: z.record(z.any()),
});

export const tenantStatusUpdateSchema = z.object({
  reason: z.string().min(3).max(200).optional(),
  status: z.nativeEnum(TenantStatus),
});

export const impersonationStartSchema = z.object({
  tenantId: z.string().uuid(),
  tenantAdminUserId: z.string().uuid(),
  reason: z.string().min(5).max(300),
});

export const impersonationStopSchema = z.object({
  sessionId: z.string().uuid(),
});
