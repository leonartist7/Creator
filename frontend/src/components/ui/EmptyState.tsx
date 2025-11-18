import { ReactNode } from 'react';
import { FileX, Search, Inbox, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export type EmptyStateVariant = 'default' | 'search' | 'error' | 'inbox';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) => {
  const defaultIcons = {
    default: <FileX className="w-16 h-16 text-gray-300" />,
    search: <Search className="w-16 h-16 text-gray-300" />,
    error: <AlertCircle className="w-16 h-16 text-error-300" />,
    inbox: <Inbox className="w-16 h-16 text-gray-300" />,
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">{displayIcon}</div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
