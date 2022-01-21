import { useMutation, useQueryClient } from 'react-query';
import { RegistrationInput } from '../interfaces';
import { registrationKeys } from './queries';

export function useAddRegistration() {
  const queryClient = useQueryClient();

  return useMutation(
    async (registration: RegistrationInput) => {
      // TODO: look into this loading state
      // setIsLoading(true);
      const selectedSessions = registration.sessions.filter(s => s.isChecked);
      const body = { ...registration, sessions: selectedSessions };
      const response = await fetch(`/api/registrations/add`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // setIsLoading(false);
        throw new Error('Failed to add the registration.');
      }

      const data = await response.json();
      return data.id;
    },
    {
      onError: () => {
        // setIsLoading(false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );
}
