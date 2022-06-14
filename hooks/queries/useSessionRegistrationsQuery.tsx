import { useQuery, useQueryClient } from 'react-query';
import { Registration, SessionsQuery } from '../../interfaces';
import { registrationKeys } from '../queries';
import { sessionReducer } from '../../utils/misc';

async function fetchSessions(sessionId: string | undefined) {
  if (!sessionId) {
    return;
  }

  const response = await fetch(`/api/registrations/session?id=${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the session registrations.');
  }

  const data = await response.json();
  return data.registrations;
}

export default function useSessionRegistrationsQuery(sessionId: string) {
  const queryClient = useQueryClient();

  return useQuery<SessionsQuery, Error>(
    registrationKeys.session(sessionId),
    () => fetchSessions(sessionId),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const state = queryClient.getQueryData<Registration[]>(
          registrationKeys.all
        );

        if (state) {
          return sessionReducer(state, sessionId);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(registrationKeys.all)?.dataUpdatedAt;
      },
    }
  );
}
