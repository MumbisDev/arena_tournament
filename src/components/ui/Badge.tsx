import type { TournamentStatus, MatchStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-neutral-200 text-neutral-600 border-neutral-400',
  success: 'bg-semantic-success text-brutal-white border-brutal-black',
  warning: 'bg-semantic-warning text-brutal-black border-brutal-black',
  error: 'bg-brutal-vermillion text-brutal-white border-brutal-black',
  info: 'bg-accent-indigo text-brutal-white border-brutal-black',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 font-mono text-mono-xs uppercase tracking-widest border-2
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: TournamentStatus | MatchStatus;
  className?: string;
}

const statusVariants: Record<TournamentStatus | MatchStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  upcoming: 'info',
  live: 'success',
  completed: 'default',
  cancelled: 'error',
  pending: 'warning',
};

const statusLabels: Record<TournamentStatus | MatchStatus, string> = {
  upcoming: 'Upcoming',
  live: 'LIVE',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {status === 'live' && (
        <span className="w-2 h-2 bg-current mr-2 animate-pulse" />
      )}
      {statusLabels[status]}
    </Badge>
  );
}

// New brutalist badge variant
interface TagBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function TagBadge({ children, className = '' }: TagBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 font-mono text-mono-xs uppercase tracking-widest
        bg-brutal-black text-brutal-white
        ${className}
      `}
    >
      {children}
    </span>
  );
}
