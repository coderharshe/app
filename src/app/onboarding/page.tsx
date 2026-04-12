"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTenantStore } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function OnboardingPage() {
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If not authenticated (redirected manually or accessed directly), boot to login
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      // Create and link store to user auth UID
      await createTenantStore(auth.currentUser.uid, storeName);
      
      // Onboarding complete, ride off to the dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to provision store:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">Name your store</h1>
        <p className="mb-8 text-sm text-gray-400">
          Give your business a name to finish setting up your environment. You can change this later.
        </p>
        
        <form onSubmit={handleCreateStore} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Store Name
            </label>
            <input 
              type="text" 
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="e.g. Acme Tech"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !storeName.trim()}
            className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/40 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Creating environment..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
