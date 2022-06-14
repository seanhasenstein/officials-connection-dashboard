import { useMutation, useQueryClient } from 'react-query';
import { Note, Registration } from '../../interfaces';
import { registrationKeys } from '../queries';

export default function useUpdateRegistrationNotes() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      registration,
      updatedNotes,
    }: {
      registration: Registration;
      updatedNotes: Note[];
    }) => {
      const updatedRegistration: Registration = {
        ...registration,
        notes: updatedNotes,
      };
      const response = await fetch('/api/registrations/update-notes', {
        method: 'POST',
        body: JSON.stringify({ ...updatedRegistration }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the registration notes.');
      }

      const data: Registration = await response.json();
      return data;
    },
    {
      onMutate: data => {
        const updatedRegistration: Registration = {
          ...data.registration,
          notes: data.updatedNotes,
        };
        queryClient.setQueryData(
          registrationKeys.registration(data.registration._id),
          updatedRegistration
        );
        return data;
      },
      onError: (_, data) => {
        queryClient.setQueryData(
          registrationKeys.registration(data.registration._id),
          data.registration
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );
}
