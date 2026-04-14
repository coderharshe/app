import { jsonSuccess } from "@/lib/api/response";
import { clearAuthCookie } from "@/lib/auth/jwt";

export async function POST() {
  const response = jsonSuccess({ message: "Logged out" });
  response.cookies.set(clearAuthCookie());
  return response;
}
