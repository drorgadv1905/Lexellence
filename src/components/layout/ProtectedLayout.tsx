"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { canAccessRoute, getDefaultHome } from "@/lib/permissions";
import { AppShell } from "@/components/layout/AppShell";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!canAccessRoute(user.role, pathname)) {
      router.replace(getDefaultHome(user.role));
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-forest-700 text-lg">טוען...</div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
