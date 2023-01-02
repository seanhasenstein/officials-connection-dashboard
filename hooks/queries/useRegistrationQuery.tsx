import { useQuery, useQueryClient } from 'react-query';
import { Registration } from '../../types';
import { registrationKeys } from '.';

async function fetchRegistration(id: string | undefined) {
  if (!id) return;

  const response = await fetch(`/api/registrations/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the registration.');
  }

  const data = await response.json();
  return data.registration;
}

export default function useRegistrationQuery(registrationId: string) {
  const queryClient = useQueryClient();

  return useQuery<Registration, Error>(
    registrationKeys.registration(registrationId),
    () => fetchRegistration(registrationId),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const state = queryClient.getQueryData<Registration[]>(
          registrationKeys.all
        );

        if (state) {
          return state.find(r => r._id === registrationId);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(registrationKeys.all)?.dataUpdatedAt;
      },
    }
  );
}
