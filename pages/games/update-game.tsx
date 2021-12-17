import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import { Game } from '../../interfaces';
import { formatGameName } from '../../utils';
import useGame from '../../hooks/useGame';
import useSession from '../../hooks/useSessions';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UpdateFilmedGame() {
  const [session, sessionLoading] = useSession();
  const router = useRouter();
  const { gameQuery, updateGame } = useGame();
  const [date, setDate] = React.useState<string>(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  const [time, setTime] = React.useState<string>('00:00');

  React.useEffect(() => {
    if (gameQuery.data) {
      const date = new Date(gameQuery.data.date);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const formattedTime = format(date, 'HH:mm');
      setDate(formattedDate);
      setTime(formattedTime);
    }
  }, [gameQuery.data]);

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <UpdateFilmedGameStyles>
        <div className="container">
          {gameQuery.isLoading && (
            <GameLoadindSpinner isLoading={gameQuery.isLoading} />
          )}
          {gameQuery.isError && gameQuery.error instanceof Error && (
            <div>Error: {gameQuery.error.message}</div>
          )}
          {gameQuery.isSuccess && gameQuery.data && (
            <>
              <h2>Update Game - {formatGameName(gameQuery.data)}</h2>
              <Formik
                initialValues={{
                  ...gameQuery.data,
                  filmed: `${gameQuery.data.filmed}`,
                }}
                onSubmit={(values: Game) => {
                  const { _id, ...rest } = values;
                  const game = { ...rest, date, time };

                  updateGame.mutate(game, {
                    onSuccess: data =>
                      router.push(
                        `/games?gid=${data.game._id}&camp=${data.game.camp}`
                      ),
                  });
                }}
              >
                {({ values, isSubmitting }) => (
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
                      <label htmlFor="clinician">Clinician</label>
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
                    <div className="actions">
                      {isSubmitting ? (
                        <LoadingSpinner isLoading={isSubmitting} />
                      ) : (
                        <Link href="/">
                          <a className="link-button">Cancel</a>
                        </Link>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-button"
                      >
                        Update this game
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </UpdateFilmedGameStyles>
    </Layout>
  );
}

const UpdateFilmedGameStyles = styled.div`
  padding: 0 1.5rem;
  width: 100%;
  min-height: 100vh;
  background-color: #f9fafb;

  .container {
    padding: 3rem 0;
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    color: #111827;
    font-weight: 600;
  }

  h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6e788c;
  }

  .item {
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
  }

  .radio-group {
    margin: 3.5rem 0;

    h4 {
      margin-bottom: 1.125rem;
      color: #1f2937;
    }
  }

  .radio-item {
    margin: 0 0 0.75rem;

    label {
      display: flex;
      align-items: center;
    }

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  .actions {
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
        color: #111827;
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

const GameLoadindSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
