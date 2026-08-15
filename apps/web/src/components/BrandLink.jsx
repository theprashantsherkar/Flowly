import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { cn } from '../lib/cn';

/** The Flowly wordmark. Routes to the dashboard when signed in, else home. */
export function BrandLink({ className }) {
  const { isSignedIn } = useAuth();
  return (
    <Link
      to={isSignedIn ? '/dashboard' : '/'}
      className={cn('text-base font-semibold tracking-tight text-slate-100', className)}
    >
      Flowly
    </Link>
  );
}
