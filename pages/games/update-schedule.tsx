import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { Game, Registration, Session } from '../../interfaces';
import { sessionsData } from '../../data';
import Layout from '../../components/Layout';

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

export default function CampersFilmedGames() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [session, setSession] = React.useState<Session>();
  const gamesQuery = useQuery<Game[]>(
    [
      'games',
      router.query.camp && Array.isArray(router.query.camp)
        ? router.query.camp[0].toLowerCase()
        : router.query.camp?.toLowerCase(),
    ],
    async () => {
      if (!router.query.camp) return;
      const camp = Array.isArray(router.query.camp)
        ? router.query.camp[0].toLowerCase()
        : router.query.camp?.toLowerCase();
      const response = await fetch(`/api/games/camp/${camp}`);

      if (!response.ok) {
        throw new Error('Failed to fetch the games.');
      }

      const data = await response.json();
      return data.games;
    },
    {
      staleTime: 600000,
      initialData: () => {
        if (!router.query.camp) return;
        const data = queryClient.getQueryData<Game[]>([
          'games',
          router.query.camp,
        ]);
        return data;
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(['games', router.query.camp])
          ?.dataUpdatedAt;
      },
    }
  );

  const registrationsQuery = useQuery<{
    attending: Registration[];
    notAttending: Registration[];
  }>(
    ['session-registrations', router.query.sessionId],
    async () => {
      if (!router.query.sessionId) return;
      const response = await fetch(
        `/api/registrations/session?id=${router.query.sessionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch the registrations.');
      }

      const data = await response.json();
      return data.registrations;
    },
    {
      initialData: () => {
        if (!router.query.sessionId) return;
        const data =
          queryClient.getQueryData<{ registrations: Registration[] }>(
            'registrations'
          );

        const reducedData = data?.registrations.reduce(
          (
            acc: { attending: Registration[]; notAttending: Registration[] },
            currReg
          ) => {
            currReg.sessions.forEach(s => {
              if (s.id === router.query.sessionId) {
                s.attending
                  ? acc.attending.push(currReg)
                  : acc.notAttending.push(currReg);
              }
            });
            return acc;
          },
          { attending: [], notAttending: [] }
        );
        return reducedData;
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState('registrations')?.dataUpdatedAt;
      },
      staleTime: 600000,
    }
  );

  const mutation = useMutation(
    async ({
      gameIds,
      registrationId,
    }: {
      gameIds: string[];
      registrationId: string;
    }) => {
      const filmedGames = gameIds.map(g => {
        const game = gamesQuery.data?.find(sg => sg._id === g);
        return {
          _id: game?._id,
          abbreviation: game?.abbreviation,
          name: game?.name,
          url: game?.url,
        };
      });

      const response = await fetch(`/api/update-filmed-games`, {
        method: 'POST',
        body: JSON.stringify({
          registrationId,
          sessionId: router.query.sessionId,
          filmedGames,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the game.');
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'session-registrations',
          router.query.sessionId,
        ]);
        queryClient.invalidateQueries([
          'games',
          router.query.camp && Array.isArray(router.query.camp)
            ? router.query.camp[0].toLowerCase()
            : router.query.camp?.toLowerCase(),
        ]);
      },
    }
  );

  React.useEffect(() => {
    setSession(() => sessionsData.find(s => s.id === router.query.sessionId));
  }, [router.query.sessionId]);

  return (
    <Layout>
      <CampersFilmedGamesStyles>
        <div className="wrapper">
          <h2>{router.query.camp} Camp Filming Schedule</h2>
          <h3>[{session?.name}]</h3>
          {(gamesQuery.isLoading || registrationsQuery.isLoading) && (
            <div className="loading">Loading...</div>
          )}
          {gamesQuery.isError && gamesQuery.error instanceof Error && (
            <div>Error: {gamesQuery.error.message}</div>
          )}
          {registrationsQuery.isError &&
            registrationsQuery.error instanceof Error && (
              <div>Error: {registrationsQuery.error.message}</div>
            )}
          {gamesQuery.isSuccess &&
            gamesQuery.data &&
            registrationsQuery.isSuccess &&
            registrationsQuery.data && (
              <div className="table-container">
                <div className="thead">
                  <div className="th" />
                  {gamesQuery.data.map(g => (
                    <div key={g._id} className="th">
                      <span>{g.abbreviation}</span>
                    </div>
                  ))}
                  <div className="th" />
                </div>
                {registrationsQuery.data.attending.map(r =>
                  r.sessions.map(s => {
                    if (
                      s.attending === true &&
                      s.location === router.query.camp &&
                      s.id === router.query.sessionId
                    ) {
                      const initialFilmedGames = Array.isArray(s.filmedGames)
                        ? s.filmedGames.map(g => g._id)
                        : [];
                      return (
                        <Formik
                          key={`${r._id}-${s.id}`}
                          initialValues={{
                            filmedGamesIds: initialFilmedGames,
                          }}
                          onSubmit={async values => {
                            const gameIds = values.filmedGamesIds.filter(
                              (id): id is string => !!id
                            );

                            await mutation.mutate({
                              gameIds,
                              registrationId: r._id,
                            });
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
                                {gamesQuery.data.map(g => (
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
            )}
        </div>
      </CampersFilmedGamesStyles>
    </Layout>
  );
}
