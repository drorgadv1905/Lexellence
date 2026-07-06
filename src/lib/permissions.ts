import type { AppData, UserRole } from "./types";

export function canAccessRoute(role: UserRole, path: string): boolean {
  const memberRoutes = [
    "/home",
    "/profile",
    "/members",
    "/my-group",
    "/events",
    "/referrals",
    "/requests",
    "/documents",
    "/rules",
  ];

  const groupAdminRoutes = [
    "/admin/dashboard",
    "/admin/members",
    "/admin/candidates",
    "/admin/events",
    "/admin/announcements",
    "/admin/summaries",
    "/admin/reports",
  ];

  const superAdminRoutes = [
    "/system/dashboard",
    "/system/users",
    "/system/groups",
    "/system/practice-areas",
    "/system/regions",
    "/system/membership-plans",
    "/system/content",
    "/system/announcements",
    "/system/reports",
  ];

  const shared = ["/home", "/profile", "/events", "/documents", "/rules"];

  if (role === "super_admin") return true;

  if (role === "group_admin") {
    return (
      memberRoutes.includes(path) ||
      groupAdminRoutes.includes(path) ||
      path.startsWith("/members/") ||
      path.startsWith("/admin/")
    );
  }

  if (role === "member") {
    return (
      memberRoutes.includes(path) ||
      path.startsWith("/members/")
    );
  }

  return shared.includes(path);
}

export function getNavItems(role: UserRole) {
  const memberNav = [
    { href: "/home", label: "דף בית", icon: "Home" },
    { href: "/profile", label: "הפרופיל שלי", icon: "User" },
    { href: "/members", label: "חברי הפורום", icon: "Users" },
    { href: "/my-group", label: "הקבוצה שלי", icon: "Building2" },
    { href: "/events", label: "אירועים", icon: "Calendar" },
    { href: "/requests", label: "בקשות", icon: "MessageSquare" },
    { href: "/referrals", label: "הפניות", icon: "Share2" },
    { href: "/documents", label: "מסמכים", icon: "FileText" },
    { href: "/rules", label: "כללי הפורום", icon: "Shield" },
  ];

  const groupAdminNav = [
    { href: "/admin/dashboard", label: "ניהול הקבוצה", icon: "LayoutDashboard" },
    { href: "/admin/members", label: "חברים", icon: "Users" },
    { href: "/admin/candidates", label: "מועמדים", icon: "UserPlus" },
    { href: "/admin/events", label: "אירועים", icon: "Calendar" },
    { href: "/admin/announcements", label: "הודעות", icon: "Bell" },
    { href: "/admin/summaries", label: "סיכומי מפגש", icon: "ClipboardList" },
    { href: "/admin/reports", label: "דוחות", icon: "BarChart3" },
  ];

  const superAdminNav = [
    { href: "/system/dashboard", label: "דשבורד מערכת", icon: "LayoutDashboard" },
    { href: "/system/users", label: "משתמשים", icon: "Users" },
    { href: "/system/groups", label: "קבוצות", icon: "Building2" },
    { href: "/system/practice-areas", label: "תחומי עיסוק", icon: "Briefcase" },
    { href: "/system/regions", label: "אזורים", icon: "MapPin" },
    { href: "/system/membership-plans", label: "מסלולי חברות", icon: "CreditCard" },
    { href: "/system/content", label: "תוכן כללי", icon: "FileEdit" },
    { href: "/system/announcements", label: "הודעות מערכת", icon: "Megaphone" },
    { href: "/system/reports", label: "דוחות", icon: "BarChart3" },
  ];

  if (role === "super_admin") {
    return { primary: superAdminNav, secondary: [] };
  }
  if (role === "group_admin") {
    return { primary: groupAdminNav, secondary: memberNav };
  }
  return { primary: memberNav, secondary: [] };
}

export function canViewReferral(
  referral: { created_by: string; related_user_id: string; group_id: string },
  user: { id: string; role: UserRole; group_id: string | null }
): boolean {
  if (user.role === "super_admin") return true;
  if (referral.created_by === user.id || referral.related_user_id === user.id) return true;
  if (user.role === "group_admin" && user.group_id === referral.group_id) return true;
  return false;
}

export function canManageGroup(user: { role: UserRole; group_id: string | null }, groupId: string): boolean {
  if (user.role === "super_admin") return true;
  if (user.role === "group_admin" && user.group_id === groupId) return true;
  return false;
}

export function getDefaultHome(role: UserRole): string {
  if (role === "super_admin") return "/system/dashboard";
  if (role === "group_admin") return "/admin/dashboard";
  return "/home";
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export const STORAGE_KEY = "forum-lexellence-data";
export const AUTH_KEY = "forum-lexellence-auth";

export type { AppData };
