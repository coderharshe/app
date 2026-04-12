"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn / 1000, // maxAge in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax"
    });
  } catch (error) {
    console.error("Failed to create session", error);
    throw new Error("Failed to create session");
  }
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
