import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createApiClient } from '../lib/api';

/** An API client wired to the current Clerk session token. */
export function useApi() {
  const { getToken } = useAuth();
  return useMemo(() => createApiClient(() => getToken()), [getToken]);
}
