import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-brutal-white border-3 border-brutal-black p-3xl text-center relative" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-brutal-vermillion" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-brutal-vermillion" />
      
      <Icon className="w-16 h-16 text-neutral-300 mx-auto mb-md" strokeWidth={1.5} />
      
      <h3 className="font-display text-2xl uppercase text-brutal-black mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="font-mono text-mono-sm text-neutral-500 mt-2 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
