import { useMutation, useQueryClient } from 'react-query';
import { RegistrationInput } from '../../interfaces';
import { registrationKeys } from '../queries';

export default function useAddRegistration() {
  const queryClient = useQueryClient();

  return useMutation(
    async (formValues: RegistrationInput) => {
      const response = await fetch('/api/registrations/add', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the registration');
      }

      const data: { id: string } = await response.json();
      return data.id;
    },
    {
      // onError: () => {
      // TODO
      // },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
        queryClient.invalidateQueries('sessions');
      },
    }
  );
}
