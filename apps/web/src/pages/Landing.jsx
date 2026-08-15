import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-slate-100">
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-lg font-semibold">
          Flowly<span className="text-accent">.</span>
        </span>
        <nav className="flex items-center gap-3 text-sm">
          <SignedOut>
            <Link to="/sign-in" className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className="rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:bg-accentHover"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          The canvas where teams <span className="text-accent">think together</span>.
        </h1>
        <p className="mt-5 max-w-xl text-base text-slate-300">
          Flowly is a collaborative whiteboard and flow builder. Map decisions, design
          pipelines, and diagram ideas — together, in real time.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <SignedOut>
            <Link
              to="/sign-up"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accentHover"
            >
              Start for free
            </Link>
            <Link
              to="/sign-in"
              className="rounded-lg border border-borderSoft px-6 py-3 font-semibold text-slate-200 transition hover:border-accent"
            >
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accentHover"
            >
              Go to your flows
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
