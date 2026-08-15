import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-9 w-full rounded-lg border border-borderSoft bg-panelLight px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
