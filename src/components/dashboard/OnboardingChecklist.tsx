"use client";

import { CheckCircle2, Circle, Store, Package, CreditCard, Layout } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
}

export function OnboardingChecklist({ productCount, tenantName }: { productCount: number; tenantName: string }) {
  const steps: Step[] = [
    {
      id: "register",
      title: "Register Store",
      description: `Your store "${tenantName}" is registered and active.`,
      completed: true,
      icon: Store,
    },
    {
      id: "product",
      title: "Add Your First Product",
      description: "List one or more items to start selling.",
      completed: productCount > 0,
      icon: Package,
    },
    {
      id: "customization",
      title: "Customize Storefront",
      description: "Set your logo, colors, and banner.",
      completed: false, // Future implementation
      icon: Layout,
    },
    {
      id: "payments",
      title: "Configure Payments",
      description: "Connect your Razorpay account to receive funds.",
      completed: true, // Placeholder for now
      icon: CreditCard,
    },
  ];

  return (
    <div className="rounded-2xl bg-[var(--surface-container-high)] p-6 ghost-border shadow-sm border-[var(--primary-container)]/30 border-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--on-surface)]">
            Welcome, {tenantName}!
          </h2>
          <p className="text-sm text-[var(--on-surface-variant)]">
            Complete these steps to launch your store successfully.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--primary)] font-bold">
          {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 rounded-xl p-4 transition-all ${
                step.completed 
                  ? "bg-emerald-500/5 opacity-70" 
                  : "bg-[var(--surface-container-lowest)] ghost-border"
              }`}
            >
              <div className={`mt-1 flex-shrink-0 ${step.completed ? "text-emerald-500" : "text-[var(--primary)]"}`}>
                {step.completed ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div>
                <h3 className={`text-sm font-bold ${step.completed ? "text-emerald-400 line-through decoration-emerald-800" : "text-[var(--on-surface)]"}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
