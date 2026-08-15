import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { exportFlow } from '../lib/export';

const FORMATS = [
  ['png', 'PNG image'],
  ['svg', 'SVG vector'],
  ['pdf', 'PDF document'],
  ['json', 'JSON data'],
];

const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

export function ExportMenu({ title }) {
  const { nodes, edges } = useStore(selector, shallow);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (format) => {
    setOpen(false);
    setBusy(true);
    try {
      await exportFlow(format, { nodes, edges, title });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="rounded-lg border border-borderSoft px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-accent disabled:opacity-60"
      >
        {busy ? 'Exporting…' : 'Export ▾'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-borderSoft bg-panel py-1 shadow-node">
            {FORMATS.map(([format, label]) => (
              <button
                key={format}
                type="button"
                onClick={() => run(format)}
                className="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-panelLight"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
