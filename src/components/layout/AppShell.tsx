"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  Share2,
  FileText,
  Shield,
  LayoutDashboard,
  UserPlus,
  Bell,
  ClipboardList,
  BarChart3,
  Briefcase,
  MapPin,
  CreditCard,
  FileEdit,
  Megaphone,
  LogOut,
  Menu,
  X,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { getNavItems } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  Share2,
  FileText,
  Shield,
  LayoutDashboard,
  UserPlus,
  Bell,
  ClipboardList,
  BarChart3,
  Briefcase,
  MapPin,
  CreditCard,
  FileEdit,
  Megaphone,
};

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  const Icon = iconMap[icon] || Home;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white/10 text-white border-r-2 border-gold-400 mr-0"
          : "text-forest-200 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${active ? "text-gold-400" : ""}`} />
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const nav = getNavItems(user.role);

  const sidebar = (
    <div className="flex flex-col h-full bg-gradient-to-b from-forest-900 to-forest-950">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-forest-800 border border-gold-400/30 flex items-center justify-center">
            <Scale className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-white text-lg leading-tight">Forum Lexellence</h1>
            <p className="text-xs text-gold-400/80">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.primary.length > 0 && (
          <>
            {user.role !== "member" && (
              <p className="nav-section-title">
                {user.role === "super_admin" ? "ניהול מערכת" : "ניהול קבוצה"}
              </p>
            )}
            {nav.primary.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
          </>
        )}

        {nav.secondary.length > 0 && (
          <>
            <div className="my-3 border-t border-white/10" />
            <p className="nav-section-title">אזור חברים</p>
            {nav.secondary.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="font-medium text-white text-sm truncate">{user.full_name}</p>
          <p className="text-xs text-forest-300 truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-white/5 hover:text-red-300 transition"
        >
          <LogOut className="w-4 h-4" />
          התנתקות
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex lg:w-72 lg:flex-col fixed inset-y-0 right-0 z-30 shadow-elevated">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-cream-300/80 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-cream-200">
              <Menu className="w-6 h-6 text-forest-700" />
            </button>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-gold-500" />
              <span className="font-display font-semibold text-forest-900">Forum Lexellence</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>

        <footer className="text-center py-5 text-sm text-forest-500 border-t border-cream-300/60">
          Forum Lexellence © 2026 — כל הזכויות שמורות
        </footer>
      </div>
    </div>
  );
}
