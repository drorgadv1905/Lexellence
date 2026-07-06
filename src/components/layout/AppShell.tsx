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
  ChevronLeft,
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
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-[#c49645] text-forest-900"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      {active && (
        <ChevronLeft className="w-4 h-4 absolute left-2 text-forest-900/70" />
      )}
      <Icon className="w-[18px] h-[18px] shrink-0" />
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
    <div className="flex flex-col h-full bg-[#1e2f24]">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c49645]/20 border border-[#c49645]/40 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-[#c49645]" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-white text-base leading-tight">Forum Lexellence</h1>
            <p className="text-xs text-white/60 mt-0.5">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {nav.primary.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}

        {nav.secondary.length > 0 && (
          <>
            <div className="my-3 border-t border-white/10" />
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

      <div className="px-5 py-4 border-t border-white/10">
        <p className="font-medium text-white text-sm truncate">{user.full_name}</p>
        <p className="text-xs text-white/50 truncate mt-0.5" dir="ltr">{user.email}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 mt-3 text-xs text-white/40 hover:text-white/70 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          התנתקות
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex lg:w-[240px] lg:flex-col fixed inset-y-0 right-0 z-30">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-[240px] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg bg-white/10 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-[240px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-[#f4f2ee]/90 backdrop-blur border-b border-[#e8e4dc] px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/80">
              <Menu className="w-6 h-6 text-forest-700" />
            </button>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#c49645]" />
              <span className="font-display font-semibold text-forest-900 text-sm">Forum Lexellence</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
