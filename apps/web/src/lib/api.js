const BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Builds an API client bound to a token getter (Clerk's getToken). Every
 * request carries the current session token so the server can authenticate it.
 */
export function createApiClient(getToken) {
  const request = async (path, options = {}) => {
    const token = await getToken();
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let detail;
      try {
        detail = await res.json();
      } catch {
        // no JSON body
      }
      const error = new Error(detail?.error || `Request failed (${res.status})`);
      error.status = res.status;
      error.detail = detail;
      throw error;
    }

    if (res.status === 204) return null;
    return res.json();
  };

  return {
    me: () => request('/users/me'),

    listFlows: () => request('/flows'),
    createFlow: (payload) =>
      request('/flows', { method: 'POST', body: JSON.stringify(payload || {}) }),
    getFlow: (id) => request(`/flows/${id}`),
    updateFlow: (id, patch) =>
      request(`/flows/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    deleteFlow: (id) => request(`/flows/${id}`, { method: 'DELETE' }),

    listVersions: (id) => request(`/flows/${id}/versions`),
    saveVersion: (id, snapshot, label) =>
      request(`/flows/${id}/versions`, { method: 'POST', body: JSON.stringify({ snapshot, label }) }),
    getVersion: (id, versionId) => request(`/flows/${id}/versions/${versionId}`),

    listTeams: () => request('/teams'),
    createTeam: (name) => request('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
    getMembers: (teamId) => request(`/teams/${teamId}/members`),
    createInvite: (teamId, opts) =>
      request(`/teams/${teamId}/invites`, { method: 'POST', body: JSON.stringify(opts || {}) }),
    changeRole: (teamId, userId, role) =>
      request(`/teams/${teamId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    removeMember: (teamId, userId) =>
      request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' }),

    previewInvite: (token) => request(`/invites/${token}`),
    acceptInvite: (token) => request(`/invites/${token}/accept`, { method: 'POST' }),
  };
}
