import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/cn';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export function DropdownMenuContent({ className, sideOffset = 6, align = 'end', ...props }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[9rem] rounded-lg border border-borderSoft bg-panel p-1 shadow-node',
          className
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, destructive = false, ...props }) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none transition focus:bg-panelLight data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive ? 'text-red-400 focus:bg-red-500/10 focus:text-red-300' : 'text-slate-200',
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownPrimitive.Separator className={cn('my-1 h-px bg-borderSoft', className)} {...props} />;
}
