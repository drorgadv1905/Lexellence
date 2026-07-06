import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  gold?: boolean;
}

export function Card({ children, className = "", onClick, gold }: CardProps) {
  return (
    <div
      className={`${gold ? "card-gold" : "card"} ${onClick ? "cursor-pointer hover:shadow-elevated transition-shadow duration-300" : ""} ${className}`}
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
  accent?: boolean;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className={`card ${accent ? "card-gold" : ""}`}>
      <div className="card-body flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-gold-400 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-forest-500">{label}</p>
          <p className="text-2xl font-display font-semibold text-forest-900">{value}</p>
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
      <div className="card-body text-center py-14">
        <p className="font-display text-xl font-semibold text-forest-800 mb-1">{title}</p>
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
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-forest-800 to-forest-900 text-gold-400 flex items-center justify-center font-semibold shrink-0 ring-2 ring-gold-400/20`}
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
