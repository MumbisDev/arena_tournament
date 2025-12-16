import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block font-mono text-mono-xs uppercase tracking-widest text-neutral-600 mb-2">
            <span className="text-brutal-vermillion mr-1">&gt;</span>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={`
              w-full bg-brutal-white border-3 px-4 py-3 font-mono text-sm text-brutal-black
              placeholder:text-neutral-400 transition-all duration-fast
              focus:outline-none
              ${error ? 'border-brutal-vermillion' : 'border-brutal-black'}
              ${isPassword ? 'pr-12' : ''}
              ${className}
            `}
            style={{
              boxShadow: isFocused ? '4px 4px 0px 0px #D93025' : error ? '4px 4px 0px 0px #D93025' : 'none',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-brutal-vermillion transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 font-mono text-mono-xs text-brutal-vermillion uppercase tracking-wider">
            ! {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className="w-full">
        {label && (
          <label className="block font-mono text-mono-xs uppercase tracking-widest text-neutral-600 mb-2">
            <span className="text-brutal-vermillion mr-1">&gt;</span>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-brutal-white border-3 px-4 py-3 font-mono text-sm text-brutal-black
            placeholder:text-neutral-400 transition-all duration-fast resize-none
            focus:outline-none
            ${error ? 'border-brutal-vermillion' : 'border-brutal-black'}
            ${className}
          `}
          style={{
            boxShadow: isFocused ? '4px 4px 0px 0px #D93025' : error ? '4px 4px 0px 0px #D93025' : 'none',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <p className="mt-2 font-mono text-mono-xs text-brutal-vermillion uppercase tracking-wider">
            ! {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className="w-full">
        {label && (
          <label className="block font-mono text-mono-xs uppercase tracking-widest text-neutral-600 mb-2">
            <span className="text-brutal-vermillion mr-1">&gt;</span>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-brutal-white border-3 px-4 py-3 font-mono text-sm text-brutal-black
            transition-all duration-fast cursor-pointer appearance-none
            focus:outline-none
            ${error ? 'border-brutal-vermillion' : 'border-brutal-black'}
            ${className}
          `}
          style={{
            boxShadow: isFocused ? '4px 4px 0px 0px #D93025' : error ? '4px 4px 0px 0px #D93025' : 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230A0A0A' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 font-mono text-mono-xs text-brutal-vermillion uppercase tracking-wider">
            ! {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
