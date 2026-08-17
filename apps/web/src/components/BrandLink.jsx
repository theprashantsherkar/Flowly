import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { cn } from '../lib/cn';

/** The Flowly logo + wordmark. Routes to the dashboard when signed in, else home. */
export function BrandLink({ className }) {
  const { isSignedIn } = useAuth();
  return (
    <Link to={isSignedIn ? '/dashboard' : '/'} className={cn('inline-flex items-center gap-2', className)}>
      <img src="/flowly-logo.png" alt="" className="h-6 w-auto" />
      <span className="text-base font-semibold tracking-tight text-slate-100">Flowly</span>
    </Link>
  );
}
