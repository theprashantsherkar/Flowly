import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { HeroAnimation } from '../components/HeroAnimation';
import { BrandLink } from '../components/BrandLink';
import { buttonVariants } from '../components/ui/button';

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

const FOOTER = [
  { title: 'Product', links: ['Flowcharts', 'Whiteboard', 'Templates', 'Real-time'] },
  { title: 'Solutions', links: ['For teams', 'Product', 'Engineering', 'Education'] },
  { title: 'Resources', links: ['Docs', 'Guides', 'Changelog', 'Status'] },
  { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <header className="border-b border-borderSoft/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandLink />
          <nav className="flex items-center gap-2 text-sm">
            <SignedOut>
              <Link to="/sign-in" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Sign in
              </Link>
              <Link to="/sign-up" className={buttonVariants({ size: 'sm' })}>
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
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
                <Link to="/sign-up" className={buttonVariants({ size: 'lg' })}>
                  Start for free
                </Link>
                <Link to="/sign-in" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard" className={buttonVariants({ size: 'lg' })}>
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
              <div key={f.title} className="bg-canvas p-6 transition-colors hover:bg-panel">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-slate-300">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl border border-borderSoft bg-panel px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Start mapping your ideas today</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Free to start. Bring your team when you’re ready.
          </p>
          <div className="mt-6 flex justify-center">
            <SignedOut>
              <Link to="/sign-up" className={buttonVariants({ size: 'lg' })}>
                Create your first flow
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className={buttonVariants({ size: 'lg' })}>
                Go to your flows
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      <footer className="border-t border-borderSoft/70 bg-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
            <div>
              <BrandLink />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                The collaborative canvas for flowcharts, diagrams and decisions — built for teams.
              </p>
              <div className="mt-5 flex gap-3 text-slate-400">
                <a href="#" aria-label="GitHub" className="transition hover:text-white"><Github size={18} /></a>
                <a href="#" aria-label="Twitter" className="transition hover:text-white"><Twitter size={18} /></a>
                <a href="#" aria-label="LinkedIn" className="transition hover:text-white"><Linkedin size={18} /></a>
              </div>
            </div>
            {FOOTER.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-400 transition hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-borderSoft/70 pt-6 text-xs text-slate-500 sm:flex-row">
            <span>© {new Date().getFullYear()} Flowly. All rights reserved.</span>
            <div className="flex gap-5">
              <a href="#" className="transition hover:text-white">Privacy</a>
              <a href="#" className="transition hover:text-white">Terms</a>
              <a href="#" className="transition hover:text-white">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
