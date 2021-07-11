import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { connectToDb, registration } from '../../db';
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

type Props = {
  registration: RegistrationInterface;
};

export default function Registration({ registration }: Props) {
  return (
    <Layout>
      <RegistrationStyles>
        <div className="wrapper">
          <h2>Registration</h2>
          <pre>{JSON.stringify(registration, null, 2)}</pre>
        </div>
      </RegistrationStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    if (!id) {
      throw new Error('No query id provided.');
    }

    const { db } = await connectToDb();
    const response = await registration.getRegistration(db, id);

    return {
      props: {
        registration: { ...response },
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};
