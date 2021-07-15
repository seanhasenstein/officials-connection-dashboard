import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useQuery, useQueryClient } from 'react-query';
import { Registration as RegistrationInterface } from '../../interfaces';
import Layout from '../../components/Layout';

const RegistrationStyles = styled.div`
  padding: 4rem 1.5rem;

  .wrapper {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 2rem;
    color: #111827;
  }
`;

export default function Registration() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    isSuccess,
    data: registration,
    error,
  } = useQuery(
    ['registration', router.query.id],
    async () => {
      if (!router.query.id) return;
      const response = await fetch(`/api/registrations/${router.query.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch the registration.');
      }

      const data = await response.json();
      return data.registration;
    },
    {
      initialData: () => {
        if (!router.query.id) return;
        const data =
          queryClient.getQueryData<{ registrations: RegistrationInterface[] }>(
            'registrations'
          );
        return data?.registrations.find(r => r._id === router.query.id);
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState('registrations')?.dataUpdatedAt;
      },
      staleTime: 600000,
    }
  );

  return (
    <Layout>
      <RegistrationStyles>
        <div className="wrapper">
          <h2>Registration</h2>
          {isLoading && <div>Loading...</div>}
          {isError && error instanceof Error && <div>Error: {error}</div>}
          {isSuccess && <pre>{JSON.stringify(registration, null, 2)}</pre>}
        </div>
      </RegistrationStyles>
    </Layout>
  );
}
