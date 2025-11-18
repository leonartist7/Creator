interface LoadingSkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const LoadingSkeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: LoadingSkeletonProps) => {
  const baseClass = 'skeleton';

  const variantClasses = {
    text: 'skeleton-text',
    rect: '',
    circle: 'skeleton-circle',
  };

  const style = {
    width: width || (variant === 'circle' ? height : 'auto'),
    height: height || (variant === 'text' ? '1rem' : 'auto'),
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  ));

  return <>{skeletons}</>;
};

export const CardSkeleton = () => (
  <div className="card">
    <LoadingSkeleton height="1.5rem" width="60%" className="mb-4" />
    <LoadingSkeleton count={3} className="mb-2" />
    <div className="flex gap-2 mt-4">
      <LoadingSkeleton width="80px" height="32px" />
      <LoadingSkeleton width="80px" height="32px" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <LoadingSkeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1">
          <LoadingSkeleton width="40%" height="1rem" className="mb-2" />
          <LoadingSkeleton width="80%" height="0.875rem" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-3">
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton key={i} height="1.25rem" />
      ))}
    </div>
    <div className="divider" />
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <LoadingSkeleton key={colIndex} />
        ))}
      </div>
    ))}
  </div>
);
