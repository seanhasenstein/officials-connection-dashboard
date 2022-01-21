import { useMutation, useQueryClient } from 'react-query';
import { gameKeys, registrationKeys } from './queries';

export function useDeleteRegistration() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetch('/api/registrations/delete', {
        method: 'post',
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the registration.');
      }

      const data = await response.json();
      return data.success;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(registrationKeys.all);
        queryClient.invalidateQueries(gameKeys.all);
      },
    }
  );
}
