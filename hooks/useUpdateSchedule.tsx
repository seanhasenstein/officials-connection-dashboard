import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import useGame from '../hooks/useGame';
import useRegistration from '../hooks/useRegistration';
import { registrationKeys } from './queries';

type GameMutation = {
  gameIds: string[];
  registrationId: string;
};

export default function useUpdateSchedule() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { gamesQuery } = useGame();
  const { sessionQuery, session } = useRegistration();
  const isLoading = gamesQuery.isLoading || sessionQuery.isLoading;
  const isError = gamesQuery.isError || sessionQuery.isError;
  const isSuccess = gamesQuery.isSuccess && sessionQuery.isSuccess;

  const mutation = useMutation(
    async ({ gameIds, registrationId }: GameMutation) => {
      const filmedGames = gameIds.map(g => {
        const game = gamesQuery.data?.find(sg => sg._id === g);
        return {
          _id: game?._id,
          abbreviation: game?.abbreviation,
          name: game?.name,
          url: game?.url,
        };
      });

      const response = await fetch(`/api/update-filmed-games`, {
        method: 'POST',
        body: JSON.stringify({
          registrationId,
          sessionId: router.query.sessionId,
          filmedGames,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the game.');
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  return {
    gamesQuery,
    sessionQuery,
    session,
    mutation,
    isLoading,
    isError,
    isSuccess,
  };
}
