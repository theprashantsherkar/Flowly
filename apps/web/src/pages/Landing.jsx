import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import {
  Zap,
  Users,
  LayoutTemplate,
  MessageSquare,
  History,
  Download,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { SHAPE_MAP } from '@flowly/shared';
import { HeroAnimation } from '../components/HeroAnimation';
import { CollabMock } from '../components/CollabMock';
import { ShapeSvg } from '../nodes/ShapeSvg';
import { BrandLink } from '../components/BrandLink';
import { buttonVariants } from '../components/ui/button';

const PILLARS = [
  { icon: Zap, title: 'Built for speed', body: 'An infinite canvas that stays smooth, from one shape to a thousand.' },
  { icon: Users, title: 'Multiplayer editing', body: 'Live cursors and conflict-free sync — edit together in real time.' },
  { icon: LayoutTemplate, title: 'Templates', body: 'Start from a flowchart, decision tree, or brainstorm board.' },
  { icon: MessageSquare, title: 'Comments', body: 'Pin feedback anywhere on the canvas and resolve it in place.' },
  { icon: History, title: 'Version history', body: 'Snapshot your work and restore any point for the whole room.' },
  { icon: Download, title: 'Export anywhere', body: 'Download as PNG, SVG, PDF or JSON in a click.' },
];

const SHAPE_TOUR = ['terminator', 'process', 'decision', 'data', 'database', 'document'];

function ShapesMock() {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-borderSoft bg-canvas p-5">
      {SHAPE_TOUR.map((key) => {
        const def = SHAPE_MAP[key];
        return (
          <div key={key} className="flex flex-col items-center gap-2 rounded-lg bg-panelLight/60 p-3">
            <div className="relative h-10 w-16">
              <ShapeSvg shape={key} stroke={def.defaultColor} fill={`${def.defaultColor}22`} />
            </div>
            <span className="text-[11px] text-slate-400">{def.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Showcase({ eyebrow, title, body, visual, flip }) {
  return (
    <section className="grid items-center gap-10 border-t border-borderSoft/70 py-16 lg:grid-cols-2">
      <div className={flip ? 'lg:order-2' : ''}>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">{body}</p>
      </div>
      <div className={flip ? 'lg:order-1' : ''}>
        <div className="rounded-2xl border border-borderSoft bg-panel p-5">{visual}</div>
      </div>
    </section>
  );
}

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
        {/* Hero */}
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
          <div className="rounded-2xl border border-borderSoft bg-panel p-6">
            <HeroAnimation />
          </div>
        </section>

        {/* Feature pillars */}
        <section className="border-t border-borderSoft/70 py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to diagram, together
            </h2>
            <p className="mt-3 text-base text-slate-400">
              A focused toolset that gets out of your way.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Showcases */}
        <Showcase
          eyebrow="Flowcharts"
          title="Every shape, one canvas"
          body="Drag in processes, decisions, terminators, data, databases and documents. Resize, recolor and connect them with solid, dashed or dotted lines."
          visual={<ShapesMock />}
        />
        <Showcase
          flip
          eyebrow="Real-time"
          title="Built for teamwork"
          body="Invite your team, see their cursors move, and watch edits appear instantly. No refreshing, no merge conflicts — just one shared canvas."
          visual={<CollabMock />}
        />

        {/* CTA */}
        <section className="my-16 rounded-2xl border border-borderSoft bg-panel px-8 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Start mapping your ideas today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Free to start. Bring your team when you’re ready.
          </p>
          <div className="mt-7 flex justify-center">
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

      {/* Minimal footer */}
      <footer className="border-t border-borderSoft/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <BrandLink />
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="GitHub" className="transition hover:text-white"><Github size={17} /></a>
              <a href="#" aria-label="Twitter" className="transition hover:text-white"><Twitter size={17} /></a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-white"><Linkedin size={17} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
