import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

export async function requirePlatformPageSession() {
  const session = await getServerSession();
  if (!session || session.scope !== "platform") {
    redirect("/super-admin/login");
  }

  return session;
}
