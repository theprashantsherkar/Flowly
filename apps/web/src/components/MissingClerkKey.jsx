export function MissingClerkKey() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6 text-slate-100">
      <div className="max-w-lg rounded-xl border border-borderSoft bg-panel p-8 shadow-node">
        <h1 className="text-xl font-semibold">
          Flowly <span className="text-accent">needs a Clerk key</span>
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Set <code className="rounded bg-panelLight px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code>{' '}
          in <code className="rounded bg-panelLight px-1.5 py-0.5">apps/web/.env</code> with your
          publishable key from the Clerk dashboard, then restart the dev server.
        </p>
        <a
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentHover"
        >
          Open Clerk dashboard
        </a>
      </div>
    </div>
  );
}
