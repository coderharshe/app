export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  // Guard clause for unauthenticated users
  if (!session) {
    redirect("/login");
  }

  try {
    // Dynamically verify the session token
    const decodedToken = await adminAuth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;

    // Fetch the specific user's store automatically
    const storeSnap = await adminDb
      .collection("stores")
      .where("owner_id", "==", uid)
      .limit(1)
      .get();

    // If they magically got here without going through onboarding
    if (storeSnap.empty) {
      redirect("/onboarding");
    }

    const storeId = storeSnap.docs[0].id;

    // Stream rendering the client component for CRUD operations
    return <DashboardClient storeId={storeId} />;
    
  } catch (error) {
    // If token is invalid or expired
    console.error("Dashboard authorization failed:", error);
    redirect("/login");
  }
}
