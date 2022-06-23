import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import useYearQuery from '../../hooks/queries/useYearQuery';
import FilmedGameForm from '../../components/FilmedGameForm';
import Layout from '../../components/Layout';
import { initialValues } from '../../utils/filmedGame';
import { FilmedGame, Year } from '../../interfaces';
import { FormikHelpers } from 'formik';

export default function UpdateFilmedGame() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { year, isLoading } = useYearQuery();

  const updateGame = useMutation(async (updatedGame: FilmedGame) => {
    const updatedGames = year?.filmedGames.map(cg => {
      if (cg.id === updatedGame.id) {
        return updatedGame;
      } else {
        return cg;
      }
    });
    const response = await fetch('/api/filmed-games/update', {
      method: 'POST',
      body: JSON.stringify(updatedGames),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update the game.');
    }

    const data: { year: Year } = await response.json();
    return data.year;
  });

  const onSubmit = (values: FilmedGame, actions: FormikHelpers<FilmedGame>) => {
    updateGame.mutate(
      { ...values, url: values.url.toLowerCase() },
      {
        onSuccess: (_, updatedGame) => {
          router.push(`/filmed-games?active=${updatedGame.camp}`);
        },
        onError: () => {
          actions.setSubmitting(false);
        },
        onSettled: () => {
          queryClient.invalidateQueries('year');
        },
      }
    );
  };

  return (
    <Layout title="Update Filmed Game">
      <UpdateFilmedGameStyles>
        <div className="container">
          <h2>Update filmed game</h2>
          {isLoading ? (
            'Loading...'
          ) : year ? (
            <FilmedGameForm
              initialValues={
                year.filmedGames.find(g => g.id === router.query.id) ||
                initialValues
              }
              enableReinitialize={true}
              onSubmit={onSubmit}
              mutationError={updateGame.isError}
            />
          ) : null}
        </div>
      </UpdateFilmedGameStyles>
    </Layout>
  );
}

const UpdateFilmedGameStyles = styled.div`
  background-color: #f3f4f6;
  min-height: calc(100vh - 151px);

  .container {
    margin: 0 auto;
    padding: 5rem 0;
    max-width: 36rem;
    width: 100%;
  }
`;
