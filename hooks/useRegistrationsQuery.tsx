import { useQuery, useQueryClient } from 'react-query';
import { Registration } from '../interfaces';
import { registrationKeys } from './queries';

async function fetchRegistrations() {
  const response = await fetch('/api/registrations');

  if (!response.ok) {
    throw new Error('Failed to fetch the registrations.');
  }

  const data = await response.json();
  return data.registrations;
}

export function useRegistrationsQuery() {
  const queryClient = useQueryClient();

  return useQuery<Registration[], Error>(
    registrationKeys.all,
    fetchRegistrations,
    {
      initialData: () => {
        return queryClient.getQueryData<Registration[]>(registrationKeys.all);
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(registrationKeys.all)?.dataUpdatedAt;
      },
      staleTime: 1000 * 60 * 10,
    }
  );
}
