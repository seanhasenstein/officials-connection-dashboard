import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../components/Layout';

export default function FilmedGame() {
  const router = useRouter();
  const {
    isLoading,
    isError,
    isSuccess,
    data: game,
    error,
  } = useQuery(
    ['game', router.query.id],
    async () => {
      if (!router.query.id) return;
      const response = await fetch(`/api/games/${router.query.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch the game.');
      }

      const data = await response.json();
      return data.game;
    },
    { staleTime: 600000 }
  );

  return (
    <Layout>
      {isLoading && <div>Loading...</div>}
      {isError && error instanceof Error && <div>Error: {error}</div>}
      {isSuccess && <pre>{JSON.stringify(game, null, 2)}</pre>}
    </Layout>
  );
}
