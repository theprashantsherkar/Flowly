import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { HeroAnimation } from '../components/HeroAnimation';

const FEATURES = [
  { icon: '🧩', title: 'Every flowchart shape', body: 'Process, decision, database, document and more — drag, resize, recolor.' },
  { icon: '🔗', title: 'Solid, dashed & dotted', body: 'Connect anything with the line style that fits your diagram.' },
  { icon: '👥', title: 'Built for teams', body: 'Invite your team, work in shared rooms, and build flows together.' },
  { icon: '⚡', title: 'Real-time canvas', body: 'See teammates’ cursors and edits live as they happen.' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(#2d3a52 1px, transparent 1px), linear-gradient(90deg, #2d3a52 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
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

        <main className="mx-auto max-w-6xl px-6">
          <section className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-panel/60 px-3 py-1 text-xs text-slate-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Collaborative whiteboard & flow builder
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                The canvas where teams <span className="text-accent">think together</span>.
              </h1>
              <p className="mt-5 max-w-lg text-base text-slate-300">
                Map decisions, design processes, and diagram ideas with real flowchart shapes —
                then invite your team to build them with you, live.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <SignedOut>
                  <Link
                    to="/sign-up"
                    className="rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-node transition hover:bg-accentHover"
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
                    className="rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-node transition hover:bg-accentHover"
                  >
                    Go to your flows
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="rounded-2xl border border-borderSoft bg-panel/40 p-4 backdrop-blur-sm sm:p-8">
              <HeroAnimation />
            </div>
          </section>

          <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-borderSoft bg-panel/50 p-5 transition hover:border-accent"
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{f.body}</p>
              </div>
            ))}
          </section>
        </main>

        <footer className="border-t border-borderSoft/60 py-6 text-center text-xs text-slate-500">
          Built with Flowly · draw, decide, ship.
        </footer>
      </div>
    </div>
  );
}
