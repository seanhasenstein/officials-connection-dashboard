import React from 'react';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import { GameCategory } from '../../interfaces';
import useGame from '../../hooks/useGame';
import useSession from '../../hooks/useSessions';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddGame() {
  const [session, sessionLoading] = useSession();
  const router = useRouter();
  const { addGame } = useGame();
  const [date, setDate] = React.useState<string>(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  const [time, setTime] = React.useState<string>('12:00');

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <AddGameStyles>
        <div className="container">
          <h2>Add a game to the schedule</h2>
          <p>
            This game will be available when adding games to the campers game
            schedules.
          </p>
          <Formik
            initialValues={{
              camp: 'Kaukauna' as 'Kaukauna' | 'Plymouth',
              category: 'High School' as GameCategory,
              court: '',
              clinician: '',
              url: '',
              filmed: 'false' as 'true' | 'false',
            }}
            onSubmit={values => {
              const game = { ...values, date, time };

              addGame.mutate(game, {
                onSuccess: data =>
                  router.push(
                    `/games?gid=${data.game._id}&camp=${data.game.camp}`
                  ),
              });
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <div className="radio-group">
                  <h4>Select camp</h4>
                  <div className="radio-item">
                    <label htmlFor="kaukauna">
                      <Field
                        type="radio"
                        name="camp"
                        id="kaukauna"
                        value="Kaukauna"
                      />
                      Kaukauna
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="plymouth">
                      <Field
                        type="radio"
                        name="camp"
                        id="plymouth"
                        value="Plymouth"
                      />
                      Plymouth
                    </label>
                  </div>
                </div>
                <div className="radio-group">
                  <h4>Select category</h4>
                  <div className="radio-item">
                    <label htmlFor="hs">
                      <Field
                        type="radio"
                        name="category"
                        id="hs"
                        value="High School"
                      />
                      High School
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="wc">
                      <Field
                        type="radio"
                        name="category"
                        id="wc"
                        value="Women's College"
                      />
                      Women's College
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="mc">
                      <Field
                        type="radio"
                        name="category"
                        id="mc"
                        value="Men's College"
                      />
                      Men's College
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="mixed">
                      <Field
                        type="radio"
                        name="category"
                        id="mixed"
                        value="Mixed"
                      />
                      Mixed
                    </label>
                  </div>
                </div>
                <div className="item">
                  <h4>Select date</h4>
                  <label htmlFor="date" className="sr-only">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="item">
                  <h4>Select time</h4>
                  <label htmlFor="time" className="sr-only">
                    Date
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
                <div className="item">
                  <h4>Court</h4>
                  <label htmlFor="court" className="sr-only">
                    Court
                  </label>
                  <Field id="court" name="court" />
                </div>
                <div className="item">
                  <label htmlFor="clinicial">Clinician</label>
                  <Field name="clinician" id="clinician" />
                </div>
                <div className="radio-group">
                  <h4>Is this a filmed game?</h4>
                  <div className="radio-item">
                    <label htmlFor="filmed-true">
                      <Field
                        type="radio"
                        name="filmed"
                        id="filmed-true"
                        value="true"
                      />
                      Yes
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="filmed-false">
                      <Field
                        type="radio"
                        name="filmed"
                        id="filmed-false"
                        value="false"
                      />
                      No
                    </label>
                  </div>
                </div>
                {values.filmed === 'true' && (
                  <div className="item">
                    <label htmlFor="url">YouTube URL</label>
                    <Field name="url" id="url" />
                  </div>
                )}
                <div className="item">
                  *** TODO: ADD FUNCTIONALITY TO INCLUDE CAMPERS ***
                </div>
                <div className="form-actions">
                  {isSubmitting ? (
                    <LoadingSpinner isLoading={isSubmitting} />
                  ) : (
                    <Link href="/">
                      <a className="link-button">Cancel</a>
                    </Link>
                  )}
                  <button type="submit" disabled={isSubmitting}>
                    Add this game
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AddGameStyles>
    </Layout>
  );
}

const AddGameStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f9fafb;

  .container {
    margin: 0 auto;
    max-width: 36rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1rem;
    color: #111827;
    font-weight: 600;
  }

  h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6e788c;
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: #6b7280;
  }

  form {
    margin: 3.5rem 0 0;
  }

  .item {
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
  }

  .radio-group {
    margin: 4rem 0;

    h4 {
      margin-bottom: 1.125rem;
      color: #1f2937;
    }
  }

  .radio-item {
    margin: 0 0 0.75rem;

    label {
      display: inline-flex;
      align-items: center;
    }

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  .form-actions {
    margin: 3rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0 0.875rem;

    button {
      padding: 0.625rem 1.5rem;
      background-color: #4f46e5;
      border: 1px solid #3730a3;
      box-shadow: inset 0 1px 0 #818cf8;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #3f35e3;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
          rgb(59, 130, 246) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }

    a {
      padding: 0.625rem 1.5rem;
      border-radius: 0.375rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;

      &:hover {
        border-color: #111827;
        text-decoration: underline;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
          rgb(59, 130, 246) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }
`;
