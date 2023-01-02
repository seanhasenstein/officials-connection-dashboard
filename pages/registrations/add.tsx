import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { RegistrationInput, Session } from '../../types';
import { initialValues } from '../../utils/registrationForm';
import useYearQuery from '../../hooks/queries/useYearQuery';
import useAddRegistration from '../../hooks/mutations/useAddRegistration';
import Layout from '../../components/Layout';
import RegistrationForm from '../../components/registrationForm/RegistrationForm';

export default function AddRegistration() {
  const router = useRouter();
  const { isLoading, sessions } = useYearQuery();
  const addRegistration = useAddRegistration();
  const [formattedSessions, setFormattedSessions] = React.useState<Session[]>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (sessions) {
      const formattedSessions = sessions.map(session => ({
        ...session,
        isChecked: false,
      }));
      setFormattedSessions(formattedSessions);
    }
  }, [sessions]);

  return (
    <Layout>
      <AddRegistrationStyles>
        <div className="container">
          <h2>Add an "offline" registration</h2>
          <p>
            Use this form to add registrations that do not use a credit/debit
            card. To use a card please use the{' '}
            <a href="https://officialsconnection.org">public facing form</a>.
          </p>
          <RegistrationForm
            initialValues={{
              ...initialValues,
              sessions: formattedSessions ? formattedSessions : [],
            }}
            onSubmit={(formValues: RegistrationInput) => {
              setIsSubmitting(true);
              addRegistration.mutate(formValues, {
                onSuccess: id => router.push(`/registrations/${id}`),
                onError: () => setIsSubmitting(false),
              });
            }}
            yearIsLoading={isLoading}
            isSubmitting={isSubmitting}
          />
        </div>
      </AddRegistrationStyles>
    </Layout>
  );
}

const AddRegistrationStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f9fafb;

  .container {
    margin: 0 auto;
    max-width: 34rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1rem;
    color: #111827;
    font-weight: 600;
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: #6b7280;

    a {
      text-decoration: underline;
    }
  }
`;
