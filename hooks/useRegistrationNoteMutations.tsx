import { useMutation, useQueryClient } from 'react-query';
import { Note, Registration } from '../interfaces';
import { getUrlParam } from '../utils/misc';
import { registrationKeys } from './queries';
import { useRegistrationQuery } from './useRegistrationQuery';

export function useRegistrationNoteMutations(registrationId: string) {
  const queryClient = useQueryClient();
  const { data: registrationQuery } = useRegistrationQuery(registrationId);

  const addNote = useMutation(
    async (notes: Note[]) => {
      const response = await fetch('/api/registrations/notes/update', {
        method: 'post',
        body: JSON.stringify({ id: registrationId, notes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the note.');
      }

      const data: { registration: Registration } = await response.json();
      return data.registration;
    },
    {
      onMutate: async notes => {
        await queryClient.cancelQueries(
          registrationKeys.registration(getUrlParam(registrationId))
        );
        const updatedRegistration = { ...registrationQuery, notes };
        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(registrationId)),
          updatedRegistration
        );
        return updatedRegistration;
      },
      onError: () => {
        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(registrationId)),
          registrationQuery
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  const deleteNote = useMutation(
    async (notes: Note[]) => {
      const response = await fetch('/api/registrations/notes/update', {
        method: 'post',
        body: JSON.stringify({ id: registrationId, notes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the note.');
      }

      const data = await response.json();
      return data.registration;
    },
    {
      onMutate: async updatedNotes => {
        await queryClient.cancelQueries(
          registrationKeys.registration(getUrlParam(registrationId))
        );
        const updatedRegistration = {
          ...registrationQuery,
          notes: updatedNotes,
        };
        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(registrationId)),
          updatedRegistration
        );
        return updatedRegistration;
      },
      onError: () => {
        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(registrationId)),
          registrationQuery
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  return {
    addNote,
    deleteNote,
  };
}
