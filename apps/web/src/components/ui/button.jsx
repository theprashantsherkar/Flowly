import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white hover:bg-accentHover',
        secondary: 'border border-borderSoft bg-panelLight text-slate-100 hover:bg-panel',
        outline: 'border border-borderSoft bg-transparent text-slate-200 hover:bg-panelLight',
        ghost: 'text-slate-300 hover:bg-panelLight hover:text-white',
        destructive: 'bg-destructive text-white hover:bg-red-700',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-5 text-base',
        icon: 'h-9 w-9',
        iconSm: 'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export const Button = forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';
