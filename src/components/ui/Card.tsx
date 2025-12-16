import { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hoverable = false, onClick, onMouseEnter }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          bg-brutal-white border-3 border-brutal-black transition-all duration-fast
          ${hoverable ? 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5' : ''}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        style={{
          boxShadow: hoverable ? '4px 4px 0px 0px #0A0A0A' : 'none',
        }}
        onMouseEnter={(e) => {
          onMouseEnter?.();
          if (hoverable) {
            e.currentTarget.style.boxShadow = '6px 6px 0px 0px #0A0A0A';
          }
        }}
        onMouseLeave={(e) => {
          if (hoverable) {
            e.currentTarget.style.boxShadow = '4px 4px 0px 0px #0A0A0A';
          }
        }}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`bg-neutral-100 aspect-video overflow-hidden relative border-b-3 border-brutal-black ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-105 grayscale hover:grayscale-0"
      />
      {/* Scan line overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(10, 10, 10, 0.1) 2px, rgba(10, 10, 10, 0.1) 4px)',
        }}
      />
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-md ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`font-display text-xl text-brutal-black uppercase tracking-wide mb-2 ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`font-mono text-mono-xs text-neutral-500 uppercase tracking-widest ${className}`}>
      {children}
    </p>
  );
}

// New brutalist-specific card header
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  index?: string;
}

export function CardHeader({ children, className = '', index }: CardHeaderProps) {
  return (
    <div className={`px-md py-sm bg-brutal-black text-brutal-white flex items-center justify-between ${className}`}>
      {index && (
        <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest">
          [{index}]
        </span>
      )}
      <span className="font-mono text-mono-xs uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}
