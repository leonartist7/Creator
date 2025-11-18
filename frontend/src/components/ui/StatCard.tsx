import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  description?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-100',
  description,
}: StatCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted">vs last period</span>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted mt-2">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`${iconBg} p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export const MiniStat = ({ label, value, icon }: MiniStatProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg glass">
      {icon && <div className="flex-shrink-0 text-secondary">{icon}</div>}
      <div>
        <p className="text-xs text-secondary">{label}</p>
        <p className="text-lg font-semibold text-primary">{value}</p>
      </div>
    </div>
  );
};
