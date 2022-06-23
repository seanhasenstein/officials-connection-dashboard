import React from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import { FilmedGame, Year } from '../../interfaces';
import useYearQuery from '../../hooks/queries/useYearQuery';
import { createIdNumber } from '../../utils/misc';
import { initialValues } from '../../utils/filmedGame';
import Layout from '../../components/Layout';
import FilmedGameForm from '../../components/FilmedGameForm';

export default function AddFilmedGame() {
  const queryClient = useQueryClient();
  const { year } = useYearQuery();

  const addGame = useMutation(
    async (newGame: FilmedGame) => {
      const updatedGames = [
        ...(year?.filmedGames || []),
        { ...newGame, id: createIdNumber() },
      ];
      const response = await fetch('/api/filmed-games/update', {
        method: 'POST',
        body: JSON.stringify(updatedGames),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the filmed game.');
      }

      const data: { year: Year } = await response.json();
      return data.year;
    },
    {
      // onMutate: () => {},
      // onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries('year');
      },
    }
  );

  const onSubmit = (
    values: FilmedGame,
    actions: FormikHelpers<FilmedGame>,
    shouldRedirectOnSuccess: boolean
  ) => {
    addGame.mutate(
      { ...values, id: createIdNumber(), url: values.url.toLowerCase() },
      {
        onSuccess: (_, newGame) => {
          if (shouldRedirectOnSuccess) {
            router.push(`/filmed-games?active=${newGame.camp}`);
          } else {
            actions.resetForm();
            actions.setSubmitting(false);
          }
        },
        onError: () => {
          actions.setSubmitting(false);
        },
      }
    );
  };

  return (
    <Layout>
      <AddFilmedGameStyles>
        <div className="container">
          <h2>Add a filmed game</h2>
          <FilmedGameForm
            initialValues={initialValues}
            enableReinitialize={false}
            onSubmit={onSubmit}
            mutationError={addGame.isError}
          />
        </div>
      </AddFilmedGameStyles>
    </Layout>
  );
}

const AddFilmedGameStyles = styled.div`
  background-color: #f3f4f6;
  min-height: calc(100vh - 151px);

  .container {
    margin: 0 auto;
    padding: 5rem 0;
    max-width: 36rem;
    width: 100%;
  }
`;
