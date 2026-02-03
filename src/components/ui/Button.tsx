'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            // Variants
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
              variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400':
              variant === 'secondary',
            'border-2 border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-400':
              variant === 'outline',
            'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400':
              variant === 'ghost',

            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',

            // Disabled
            'opacity-50 cursor-not-allowed': disabled,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
