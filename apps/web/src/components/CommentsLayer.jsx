import { useState } from 'react';
import { useViewport } from 'reactflow';
import { useStore } from '../store';

/**
 * Canvas comments: pins anchored to flow coordinates, a composer for a pending
 * draft, and a popover to read/resolve/delete. Comments live in the shared Yjs
 * doc, so they appear for everyone in real time.
 */
export function CommentsLayer({ draft, me, onPlace, onCancelDraft }) {
  const { x, y, zoom } = useViewport();
  const comments = useStore((s) => s.comments);
  const resolveComment = useStore((s) => s.resolveComment);
  const deleteComment = useStore((s) => s.deleteComment);

  const [openId, setOpenId] = useState(null);
  const [draftText, setDraftText] = useState('');

  const toScreen = (px, py) => ({ left: x + px * zoom, top: y + py * zoom });

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {comments.map((c) => {
        const pos = toScreen(c.x, c.y);
        const open = openId === c.id;
        return (
          <div key={c.id} className="absolute" style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : c.id)}
              className={`pointer-events-auto grid h-7 w-7 -translate-x-1 -translate-y-7 place-items-center rounded-full rounded-bl-none text-xs shadow-node transition ${
                c.resolved ? 'opacity-40' : ''
              }`}
              style={{ background: c.color || '#6366f1' }}
              title={c.author}
            >
              💬
            </button>
            {open && (
              <div className="pointer-events-auto absolute left-6 top-0 w-56 rounded-lg border border-borderSoft bg-panel p-3 text-slate-100 shadow-node">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: c.color }}>
                    {c.author}
                  </span>
                  {c.resolved && <span className="text-[10px] text-emerald-400">resolved</span>}
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{c.body}</p>
                <div className="mt-2 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => resolveComment(c.id, !c.resolved)}
                    className="text-slate-400 hover:text-emerald-400"
                  >
                    {c.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteComment(c.id);
                      setOpenId(null);
                    }}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {draft && (
        <div
          className="pointer-events-auto absolute w-60 -translate-y-2 rounded-lg border border-borderSoft bg-panel p-3 shadow-node"
          style={{ transform: `translate(${toScreen(draft.x, draft.y).left}px, ${toScreen(draft.x, draft.y).top}px)` }}
        >
          <p className="mb-1 text-xs font-semibold" style={{ color: me?.color }}>
            {me?.name}
          </p>
          <textarea
            autoFocus
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Add a comment…"
            className="h-16 w-full resize-none rounded-md border border-borderSoft bg-panelLight px-2 py-1 text-sm text-slate-100 outline-none focus:border-accent"
          />
          <div className="mt-2 flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setDraftText('');
                onCancelDraft();
              }}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (draftText.trim()) onPlace(draftText.trim());
                setDraftText('');
              }}
              className="rounded-md bg-accent px-3 py-1 font-semibold text-white"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
