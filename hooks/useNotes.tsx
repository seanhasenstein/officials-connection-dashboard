import { useMutation, useQueryClient } from 'react-query';
import { Note } from '../interfaces';
import { registrationKeys } from './queries';

export default function useNotes(id: string) {
  const queryClient = useQueryClient();

  const addNote = useMutation(
    async (notes: Note[]) => {
      const response = await fetch('/api/registrations/notes/update', {
        method: 'post',
        body: JSON.stringify({ id, notes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the note.');
      }

      const data = await response.json();
      return data.registration;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  const deleteNote = useMutation(
    async (notes: Note[]) => {
      const response = await fetch('/api/registrations/notes/update', {
        method: 'post',
        body: JSON.stringify({ id, notes }),
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
      onSuccess: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  return { addNote, deleteNote };
}
