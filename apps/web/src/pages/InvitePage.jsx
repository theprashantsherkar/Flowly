import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const ROLE_LABEL = { OWNER: 'an owner', ADMIN: 'an admin', MEMBER: 'a member' };

export default function InvitePage() {
  const { token } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [state, setState] = useState('loading'); // loading | ready | invalid
  const [preview, setPreview] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .previewInvite(token)
      .then((p) => active && (setPreview(p), setState('ready')))
      .catch((e) => active && (setError(e.message), setState('invalid')));
    return () => {
      active = false;
    };
  }, [api, token]);

  const accept = async () => {
    setJoining(true);
    setError('');
    try {
      const res = await api.acceptInvite(token);
      navigate(`/dashboard?team=${res.teamId}`);
    } catch (e) {
      setError(e.message);
      setJoining(false);
    }
  };

  const invalid = state === 'invalid' || (preview && !preview.valid);

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-borderSoft bg-panel p-8 text-center shadow-node">
        {state === 'loading' && <p className="text-slate-400">Checking invite…</p>}

        {invalid && (
          <>
            <div className="text-3xl">🚫</div>
            <h1 className="mt-3 text-xl font-semibold">Invite unavailable</h1>
            <p className="mt-2 text-sm text-slate-400">
              {preview && preview.reason === 'expired'
                ? 'This invite link has expired.'
                : preview && preview.reason === 'used_up'
                  ? 'This invite link has been used up.'
                  : error || 'This invite link is not valid.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go to dashboard
            </button>
          </>
        )}

        {state === 'ready' && preview.valid && (
          <>
            <div className="text-3xl">🎉</div>
            <h1 className="mt-3 text-xl font-semibold">You’re invited</h1>
            <p className="mt-2 text-sm text-slate-300">
              Join <span className="font-semibold text-white">{preview.teamName}</span> as{' '}
              {ROLE_LABEL[preview.role] || 'a member'}.
            </p>
            {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
            <button
              type="button"
              onClick={accept}
              disabled={joining}
              className="mt-6 w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accentHover disabled:opacity-60"
            >
              {joining ? 'Joining…' : `Join ${preview.teamName}`}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mt-2 w-full rounded-lg px-5 py-2 text-sm text-slate-400 hover:text-white"
            >
              Not now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
