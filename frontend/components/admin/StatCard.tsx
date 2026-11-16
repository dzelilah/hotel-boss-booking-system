import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export function StatCard({ title, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {hint && <p className="stat-hint">{hint}</p>}
      </div>
      <div className="stat-icon" aria-hidden="true">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
