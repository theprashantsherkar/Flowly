import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ShapeSvg } from '../nodes/ShapeSvg';
import { Button } from './ui/button';
import { cn } from '../lib/cn';

/** A solid, filled pointing-hand cursor — reads clearly at small size. */
function TourHand() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)]"
    >
      <path
        d="M12.4 5a1.9 1.9 0 0 1 3.8 0V13.5h3.4a5 5 0 0 1 5 5v1.2a6.5 6.5 0 0 1-6.5 6.5h-1.5a6.6 6.6 0 0 1-5.2-2.5l-3.4-4.4a2 2 0 0 1 3-2.6l1.1 1.1Z"
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Bumped when the tour changes so returning users see the new one once.
const STORAGE_KEY = 'flowly:onboarded:v3';

const STEPS = [
  {
    key: 'build',
    selector: '[data-tour="build"]',
    tag: 'Build',
    body: 'Drag shapes and arrows onto the canvas to build your flows and diagrams.',
    hand: 'drag',
    place: 'below-left',
  },
  {
    key: 'arrow-tool',
    selector: '[data-tour="arrow-tool"]',
    tag: 'Arrow',
    body: 'Use this to draw a free-ended arrow or line. Drop it on the canvas even if you do not want it to connect to another shape.',
    hand: 'drag',
    place: 'below-right',
  },
  {
    key: 'export',
    selector: '[data-tour="export"]',
    tag: 'Export',
    body: 'Export your canvas as a PNG, SVG, PDF or JSON in one click.',
    hand: 'tap',
    place: 'below-right',
  },
  {
    key: 'history',
    selector: '[data-tour="history"]',
    tag: 'History',
    body: 'Snapshot your work and jump back to any earlier version — nothing is ever lost.',
    hand: 'tap',
    place: 'below-right',
  },
];

const TT_WIDTH = 300;

export function OnboardingTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // localStorage unavailable — skip the tour rather than break the editor.
    }
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setOpen(false);
  }, []);

  const measure = useCallback(() => {
    const el = document.querySelector(STEPS[step].selector);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  // Measure the current target after paint, and keep it in sync on resize/scroll.
  useLayoutEffect(() => {
    if (!open) return undefined;
    measure();
    const t = setTimeout(measure, 60); // let layout settle
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, finish]);

  if (!open || !rect) return null;

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Spotlight box around the target.
  const pad = 8;
  const spot = {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };

  // Tooltip placement — below the target, clamped to the viewport.
  let ttLeft =
    cur.place === 'below-right' ? rect.right - TT_WIDTH : rect.left + rect.width / 2 - TT_WIDTH / 2;
  ttLeft = Math.max(16, Math.min(ttLeft, window.innerWidth - TT_WIDTH - 16));
  const ttTop = spot.top + spot.height + 14;

  // Hand placement.
  const handTop = rect.top + rect.height / 2 - 6;
  const handLeft = cur.hand === 'drag' ? rect.left + 28 : rect.left + rect.width / 2 - 10;

  const next = () => (isLast ? finish() : setStep((s) => s + 1));

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Click blocker (also swallows accidental canvas interactions during the tour). */}
      <div className="absolute inset-0" />

      {/* Spotlight: transparent hole + huge box-shadow dims everything else. */}
      <div
        className="pointer-events-none absolute rounded-xl ring-2 ring-accent transition-all duration-300 ease-out"
        style={{
          top: spot.top,
          left: spot.left,
          width: spot.width,
          height: spot.height,
          boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.72)',
        }}
      />

      {/* Animated hand pointer (with a ghost shape for the drag step). */}
      <div
        className="pointer-events-none absolute z-[62] transition-all duration-300 ease-out"
        style={{ top: handTop, left: handLeft }}
      >
        <div className={cur.hand === 'drag' ? 'onb-hand-drag' : 'onb-hand-tap'}>
          {cur.hand === 'drag' && (
            <div className="absolute -top-2 left-7 h-8 w-11 rounded-md border border-accent/50 bg-panel/90 shadow-node">
              <ShapeSvg shape="process" stroke="#2563eb" fill="#2563eb22" strokeWidth={2} />
            </div>
          )}
          <TourHand />
        </div>
      </div>

      {/* Tooltip */}
      <div
        className="absolute z-[62] rounded-xl border border-borderSoft bg-panel p-4 shadow-node transition-all duration-300 ease-out"
        style={{ top: ttTop, left: ttLeft, width: TT_WIDTH }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            {cur.tag} · {step + 1}/{STEPS.length}
          </span>
          <button
            type="button"
            onClick={finish}
            className="text-xs font-medium text-slate-500 transition hover:text-slate-200"
          >
            Skip
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-slate-200">{cur.body}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === step ? 'w-5 bg-accent' : 'w-1.5 bg-borderSoft'
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" onClick={next}>
              {isLast ? 'Got it' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
