import type { ReactNode } from "react";
import type { UserRole } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`card ${onClick ? "cursor-pointer hover:shadow-md transition-shadow duration-200" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="card-body">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bolt-stat-card">
      {icon && (
        <div className="absolute top-4 left-4 text-forest-400/70">{icon}</div>
      )}
      <div className="text-left">
        <p className="text-3xl font-bold text-forest-900">{value}</p>
        <p className="text-sm text-forest-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const cls =
    role === "super_admin"
      ? "badge-role-super-admin"
      : role === "group_admin"
        ? "badge-role-group-admin"
        : "badge-role-member";
  const label =
    role === "member" ? "חבר" : ROLE_LABELS[role];
  return <span className={cls}>{label}</span>;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card">
      <div className="card-body text-center py-14">
        <p className="text-lg font-semibold text-forest-800 mb-1">{title}</p>
        {description && <p className="text-forest-500 mb-5">{description}</p>}
        {action}
      </div>
    </div>
  );
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-forest-800 text-[#c49645] flex items-center justify-center font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="text-right">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative mb-6">
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        className="search-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "חיפוש..."}
      />
    </div>
  );
}
