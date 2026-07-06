import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div className={`card ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`} onClick={onClick}>
      <div className="card-body">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: boolean;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className={`card ${accent ? "border-gold-400/40 bg-gradient-to-br from-white to-cream-100" : ""}`}>
      <div className="card-body flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-forest-100 flex items-center justify-center text-forest-700">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-forest-600">{label}</p>
          <p className="text-2xl font-bold text-forest-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card">
      <div className="card-body text-center py-12">
        <p className="text-lg font-medium text-forest-700 mb-1">{title}</p>
        {description && <p className="text-forest-500 mb-4">{description}</p>}
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
      className={`${sizes[size]} rounded-full bg-forest-700 text-white flex items-center justify-center font-semibold shrink-0`}
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle !mb-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
