import React from 'react';
import { GetServerSideProps } from 'next';
import { connectToDb, film, registration } from '../db';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { FilmedGame, Registration } from '../interfaces';
import { sessionsData } from '../data';
import Layout from '../components/Layout';

const CampersFilmedGamesStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .wrapper {
    margin: 0 auto;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.25rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
  }

  h3 {
    margin: 0 0 3.5rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-align: center;
    color: #9ca3af;
  }

  .table-container {
    padding: 1rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .thead {
    display: flex;
    position: sticky;
    top: 0;
    left: 0;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
  }

  .th {
    flex: 1;
    overflow: hidden;
    min-height: 130px;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    color: #6b7280;
    border-right: 1px solid #e5e7eb;

    &:first-of-type {
      flex: none;
      width: 13.5rem;
      border-right: 1px solid #e5e7eb;
    }

    &:last-of-type {
      flex: none;
      width: 7rem;
      border-right: none;
    }

    span {
      display: block;
      transform: rotate(-90deg);
      white-space: nowrap;
    }
  }

  form:nth-of-type(odd) {
    background-color: #f9fafb;
  }

  .tr {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }

  .td {
    flex: 1;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    border-right: 1px solid #e5e7eb;

    &:first-of-type {
      flex: none;
      padding-left: 0.5rem;
      width: 13.5rem;
      line-height: 1.25;
      color: #4b5563;
    }

    &:last-of-type {
      flex: none;
      padding-right: 0.5rem;
      width: 7rem;
      border-right: none;
    }

    &:not(:first-of-type) {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .session {
      margin: 1px 0 0;
      font-size: 0.5625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      line-height: 1.25;
      color: #9ca3af;
    }

    input {
      margin: 0;
    }

    button {
      margin: 0 0 0 1rem;
      padding: 0.125rem 0;
      width: 100%;
      background-color: #fff;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #4b5563;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      cursor: pointer;

      &:hover {
        color: #111827;
        border-color: #bbc1ca;
      }
    }
  }
`;

type Props = {
  registrations: Registration[];
  filmedGames: FilmedGame[];
};

export default function CampersFilmedGames({
  registrations,
  filmedGames,
}: Props) {
  const router = useRouter();
  const [session] = React.useState(() => {
    return sessionsData.find(s => s.id === router.query.sessionId);
  });

  return (
    <Layout>
      <CampersFilmedGamesStyles>
        <div className="wrapper">
          <h2>{router.query.camp} Camp Filming Schedule</h2>
          <h3>[{session?.name}]</h3>
          <div className="table-container">
            <div className="thead">
              <div className="th" />
              {filmedGames.map(g => (
                <div key={g._id} className="th">
                  <span>{g.abbreviation}</span>
                </div>
              ))}
              <div className="th" />
            </div>
            {registrations.map(r =>
              r.sessions.map(s => {
                if (
                  s.attending === true &&
                  s.location === router.query.camp &&
                  s.id === router.query.sessionId
                ) {
                  const initialFilmedGames = s.filmedGames
                    ? s.filmedGames.map(g => g._id)
                    : [];
                  return (
                    <Formik
                      key={`${r._id}-${s.id}`}
                      initialValues={{
                        filmedGamesIds: initialFilmedGames,
                      }}
                      onSubmit={async (values, actions) => {
                        const filteredValues = values.filmedGamesIds.filter(
                          f => f !== undefined
                        );

                        const data = filteredValues.map(g => {
                          const game = filmedGames.find(sg => sg._id === g);
                          return {
                            _id: game?._id,
                            abbreviation: game?.abbreviation,
                            name: game?.name,
                            url: game?.url,
                          };
                        });

                        const response = await fetch(
                          '/api/set-campers-filmed-games',
                          {
                            method: 'post',
                            body: JSON.stringify({
                              registrationId: r._id,
                              sessionId: s.id,
                              filmedGames: data,
                            }),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          }
                        );

                        const result = await response.json();

                        if (result.success) {
                          actions.setSubmitting(false);
                        }
                      }}
                    >
                      {({ isSubmitting, values }) => (
                        <Form>
                          <div className="tr">
                            <div className="td">
                              <div className="name">
                                {r.firstName} {r.lastName}
                              </div>
                              <div className="session">{s.name}</div>
                            </div>
                            {filmedGames.map(g => (
                              <div key={g._id} className="td">
                                <Field
                                  type="checkbox"
                                  name="filmedGamesIds"
                                  value={g._id}
                                  checked={values.filmedGamesIds.includes(
                                    g._id
                                  )}
                                />
                              </div>
                            ))}
                            <div className="td">
                              <button type="submit">
                                {isSubmitting ? 'Loading...' : 'Submit'}
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  );
                }
              })
            )}
          </div>
        </div>
      </CampersFilmedGamesStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { db } = await connectToDb();
    const registrations = await registration.getRegistrations(db, {
      'sessions.location': context.query.camp,
      'sessions.id': context.query.sessionId,
    });

    const sortedRegistrations = registrations.sort((a, b) => {
      if (a.lastName === b.lastName) return a.firstName < b.lastName ? -1 : 1;
      return a.lastName < b.lastName ? -1 : 1;
    });

    const filmedGames = await film.getFilmedGames(db, {
      camp: (context.query.camp as string).toLowerCase(),
      // day: context.query.day,
    });

    return {
      props: {
        registrations: sortedRegistrations,
        filmedGames,
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
