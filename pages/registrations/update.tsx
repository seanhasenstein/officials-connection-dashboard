import React from 'react';
import { useRouter } from 'next/router';
import { RegistrationInput } from '../../interfaces';
import useUpdateRegistration from '../../hooks/mutations/useUpdateRegistration';
import useYearQuery from '../../hooks/queries/useYearQuery';
import useAuthSession from '../../hooks/useAuthSession';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import RegistrationForm from '../../components/registrationForm/RegistrationForm';
import styled from 'styled-components';
import useRegistrationQuery from '../../hooks/queries/useRegistrationQuery';
import { getUrlParam } from '../../utils/misc';

export default function UpdateRegistration() {
  const [session, sessionLoading] = useAuthSession();
  const router = useRouter();
  const yearQuery = useYearQuery();
  const registrationQuery = useRegistrationQuery(getUrlParam(router.query.rid));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { updateRegistration, initialValues } = useUpdateRegistration(
    registrationQuery.data,
    yearQuery.sessions
  );

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <UpdateRegistrationStyles>
        <div className="container">
          <h2>Update Registration</h2>
          {registrationQuery.isLoading ||
            (yearQuery.isLoading && (
              <LoadingSpinner
                isLoading={registrationQuery.isLoading || yearQuery.isLoading}
              />
            ))}
          {registrationQuery.error && (
            <div>Error: {registrationQuery.error.message}</div>
          )}
          {yearQuery.error && <div>Error: {yearQuery.error.message}</div>}
          {registrationQuery.data && (
            <RegistrationForm
              initialValues={initialValues}
              onSubmit={(values: RegistrationInput) => {
                setIsSubmitting(true);
                updateRegistration.mutate(
                  { _id: registrationQuery.data._id, formValues: values },
                  {
                    onSuccess: data =>
                      router.push(`/registrations/${data._id}`),
                  }
                );
              }}
              yearIsLoading={yearQuery.isLoading}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </UpdateRegistrationStyles>
    </Layout>
  );
}

const UpdateRegistrationStyles = styled.div`
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
