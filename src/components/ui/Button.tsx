import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-brutal-black text-brutal-white border-3 border-brutal-black
    hover:translate-x-[2px] hover:translate-y-[2px]
    active:translate-x-[4px] active:translate-y-[4px]
    disabled:bg-neutral-300 disabled:text-neutral-500 disabled:border-neutral-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
  `,
  secondary: `
    bg-brutal-white text-brutal-black border-3 border-brutal-black
    hover:bg-brutal-black hover:text-brutal-white hover:translate-x-[2px] hover:translate-y-[2px]
    active:translate-x-[4px] active:translate-y-[4px]
    disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
  `,
  ghost: `
    bg-transparent text-brutal-black border-none relative
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brutal-vermillion after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-200
    hover:after:scale-x-100
    disabled:text-neutral-400 disabled:cursor-not-allowed disabled:after:hidden
  `,
  danger: `
    bg-brutal-vermillion text-brutal-white border-3 border-brutal-black
    hover:bg-brutal-vermillionDark hover:translate-x-[2px] hover:translate-y-[2px]
    active:translate-x-[4px] active:translate-y-[4px]
    disabled:bg-neutral-300 disabled:text-neutral-500 disabled:border-neutral-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
  `,
};

const shadowStyles: Record<ButtonVariant, string> = {
  primary: '4px 4px 0px 0px #D93025',
  secondary: '4px 4px 0px 0px #0A0A0A',
  ghost: 'none',
  danger: '4px 4px 0px 0px #0A0A0A',
};

const shadowHoverStyles: Record<ButtonVariant, string> = {
  primary: '2px 2px 0px 0px #D93025',
  secondary: '2px 2px 0px 0px #0A0A0A',
  ghost: 'none',
  danger: '2px 2px 0px 0px #0A0A0A',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-[11px]',
  lg: 'px-8 py-4 text-xs',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, children, style, ...props }, ref) => {
    const isDisabled = disabled || isLoading;
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          font-mono uppercase tracking-widest transition-all duration-fast inline-flex items-center justify-center gap-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        style={{
          boxShadow: isDisabled ? '4px 4px 0px 0px #B8B0A0' : shadowStyles[variant],
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && variant !== 'ghost') {
            e.currentTarget.style.boxShadow = shadowHoverStyles[variant];
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && variant !== 'ghost') {
            e.currentTarget.style.boxShadow = shadowStyles[variant];
          }
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
