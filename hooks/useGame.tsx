import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUrlParam } from '../utils/misc';
import { Game, GameInput, GameOfficial } from '../interfaces';
import { gameKeys } from './queries';

async function fetchGame(id: string | undefined) {
  if (!id) return;

  const response = await fetch(`/api/games/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the game');
  }

  const data = await response.json();
  return data.game;
}

async function fetchGames(camp: string | undefined) {
  if (!camp) return;

  const response = await fetch(`/api/games/camp/${camp}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the games.');
  }

  const data = await response.json();
  return data.games;
}

export default function useGame() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [id, setId] = React.useState<string>();
  const [camp, setCamp] = React.useState<string>();

  React.useEffect(() => {
    setCamp(getUrlParam(router.query.camp));
    setId(getUrlParam(router.query.gid));
  }, [router.query.camp, router.query.gid]);

  const gameQuery = useQuery<Game, Error>(
    gameKeys.game(id),
    () => fetchGame(id),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const games = queryClient.getQueryData<Game[]>(gameKeys.camp(camp));

        if (games) {
          return games.find(g => g._id === id);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(gameKeys.all)?.dataUpdatedAt;
      },
    }
  );

  const gamesQuery = useQuery<Game[], Error>(
    gameKeys.camp(camp),
    () => fetchGames(camp),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const state = queryClient.getQueryData<Game[]>(gameKeys.camp(camp));

        if (state) {
          return state.filter(g => g.camp === camp);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(gameKeys.all)?.dataUpdatedAt;
      },
    }
  );

  const addGame = useMutation(
    async (game: GameInput) => {
      const response = await fetch(`/api/games/add`, {
        method: 'POST',
        body: JSON.stringify(game),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the game.');
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(gameKeys.camp(data.game.camp));
      },
    }
  );

  const updateGame = useMutation(
    async (game: GameInput) => {
      const response = await fetch(`/api/games/update?id=${router.query.gid}`, {
        method: 'POST',
        body: JSON.stringify(game),
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
        queryClient.invalidateQueries(gameKeys.all);
      },
    }
  );

  const deleteGame = useMutation(
    async (game: Game) => {
      const response = await fetch('/api/games/delete', {
        method: 'post',
        body: JSON.stringify(game),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the game');
      }

      const data = await response.json();
      return data.success;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(gameKeys.all);
      },
    }
  );

  const updateGameOfficials = useMutation(
    async (values: { officials: GameOfficial[]; gameId: string }) => {
      const response = await fetch('/api/games/update-officials', {
        method: 'post',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the game.');
      }

      const data = await response.json();
      return data.success;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(gameKeys.all);
      },
    }
  );

  return {
    gameQuery,
    gamesQuery,
    addGame,
    updateGame,
    deleteGame,
    updateGameOfficials,
    camp,
  };
}
