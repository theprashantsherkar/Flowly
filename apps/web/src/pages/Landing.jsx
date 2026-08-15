import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { HeroAnimation } from '../components/HeroAnimation';

function FeatureIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (name === 'shapes') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="8" height="7" rx="1.5" />
        <path d="M17 3.5 21 8 17 12.5 13 8Z" />
        <rect x="8" y="15" width="9" height="6" rx="1.5" />
      </svg>
    );
  }
  if (name === 'lines') {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M3 12h18" strokeDasharray="4 3" />
        <path d="M3 18h18" strokeDasharray="1 3" />
      </svg>
    );
  }
  if (name === 'team') {
    return (
      <svg {...common}>
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M3 19c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
        <path d="M14 15c2.4-.2 5 1.4 5 4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6 3v14l3.5-3.3L12 19l2-1-2.3-4.6H16z" />
    </svg>
  );
}

const FEATURES = [
  { icon: 'shapes', title: 'Every flowchart shape', body: 'Process, decision, database, document and more — drag, resize and recolor on an infinite canvas.' },
  { icon: 'lines', title: 'Precise connectors', body: 'Link anything with solid, dashed or dotted lines and clean routing.' },
  { icon: 'team', title: 'Teams and roles', body: 'Invite teammates with owner, admin and member roles, and organize work by team.' },
  { icon: 'cursor', title: 'Real-time by default', body: 'Edit together with live cursors and instant sync — no refresh, no conflicts.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <header className="border-b border-borderSoft/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-tight">Flowly</span>
          <nav className="flex items-center gap-2 text-sm">
            <SignedOut>
              <Link to="/sign-in" className="rounded-md px-3 py-2 text-slate-300 transition hover:text-white">
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-md bg-accent px-4 py-2 font-medium text-white transition hover:bg-accentHover"
              >
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="rounded-md px-3 py-2 text-slate-300 transition hover:text-white">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <span className="inline-block rounded-full border border-borderSoft px-3 py-1 text-xs font-medium text-slate-400">
              Collaborative flowchart & whiteboard
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              The canvas where teams think together
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
              Map decisions, design processes and diagram ideas with real flowchart shapes — then
              build them with your team, live, on a shared canvas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SignedOut>
                <Link
                  to="/sign-up"
                  className="rounded-md bg-accent px-5 py-3 font-medium text-white transition hover:bg-accentHover"
                >
                  Start for free
                </Link>
                <Link
                  to="/sign-in"
                  className="rounded-md border border-borderSoft px-5 py-3 font-medium text-slate-200 transition hover:bg-panel"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="rounded-md bg-accent px-5 py-3 font-medium text-white transition hover:bg-accentHover"
                >
                  Go to your flows
                </Link>
              </SignedIn>
            </div>
          </div>

          <div className="rounded-xl border border-borderSoft bg-panel p-6">
            <HeroAnimation />
          </div>
        </section>

        <section className="border-t border-borderSoft/70 py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Everything you need to diagram
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-borderSoft bg-borderSoft sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-canvas p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-slate-300">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-borderSoft/70">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">Flowly</div>
      </footer>
    </div>
  );
}
