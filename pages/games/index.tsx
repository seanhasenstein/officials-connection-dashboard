import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import { Game, Registration } from '../../interfaces';

const GamesStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .wrapper {
    margin: 0 auto;
    max-width: 70rem;
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

  .table-wrapper {
    padding: 0.75rem;
    overflow: hidden;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  table {
    min-width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #f9fafb;
    border-top: 1px solid #edf0f3;
    border-bottom: 1px solid #edf0f3;
  }

  th,
  td {
    &.text-center {
      text-align: center;
    }
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &.text-right {
      text-align: right;
    }
  }

  tbody {
    background-color: #fff;
    border-top: 1px solid rgb(229, 231, 235);
  }

  tr:nth-of-type(even) td {
    background-color: #f9fafb;
  }

  td {
    padding: 0.875rem 1.5rem;
    white-space: nowrap;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 1px solid #edf0f3;

    &.officials div {
      margin: 0 0 0.25rem;

      &:lst-of-type {
        margin: 0;
      }
    }
  }

  .youtube a:hover {
    text-decoration: underline;
  }

  .links {
    color: #9ca3af;
    text-align: right;

    a {
      padding: 0.25rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border-radius: 9999px;

      &:first-of-type {
        margin: 0 0.5rem 0 0;
      }

      &:hover {
        background-color: #edf0f3;
        color: #4b5563;
      }
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;

export default function Games() {
  const { query } = useRouter();
  const { camp } = query;

  const {
    isLoading,
    isError,
    isSuccess,
    data: games,
    error,
  } = useQuery<Game[]>(
    ['games', camp],
    async () => {
      if (!camp) return;
      const response = await fetch(`/api/games/camp/${camp}`);

      if (!response.ok) {
        throw new Error('Failed to fetch the games.');
      }
      const data = await response.json();
      return data.games;
    },
    { staleTime: 600000 }
  );
  const [officials] = React.useState<Registration[]>();

  return (
    <Layout>
      <GamesStyles>
        <div className="wrapper">
          <h2>Filmed Games</h2>
          <h3>[{camp} camp]</h3>
          {isLoading && <div>Loading...</div>}
          {isError && error instanceof Error && <div>Error: {error}</div>}
          {isSuccess && games && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Game</th>
                    <th className="text-center">Camp</th>
                    <th>Officials</th>
                    <th>Clinician</th>
                    <th>YouTube URL</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(g => (
                    <tr key={g._id}>
                      <td>{g.abbreviation}</td>
                      <td className="text-center">
                        {g.session === 'hs'
                          ? 'HS'
                          : g.session === 'mc'
                          ? 'MC'
                          : g.session === 'wc'
                          ? 'WC'
                          : ''}
                      </td>
                      <td className="officials">
                        {officials &&
                          officials.map(o => {
                            let returnOfficial = false;
                            o.sessions.forEach(s => {
                              s.filmedGames &&
                                s.filmedGames.forEach(fg => {
                                  if (fg._id === g._id) {
                                    returnOfficial = true;
                                  }
                                });
                            });
                            if (returnOfficial) {
                              return (
                                <div key={o._id}>
                                  {o.firstName} {o.lastName}
                                </div>
                              );
                            }
                          })}
                      </td>
                      <td>{g.clinician}</td>
                      <td className="youtube">
                        <a href={g.url} target="_blank" rel="noreferrer">
                          {g.url}
                        </a>
                      </td>
                      <td className="links">
                        <Link href={`/games/${g._id}`}>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                          </a>
                        </Link>
                        <Link
                          href={`/games/update-game?camp=${g.camp}&id=${g._id}`}
                        >
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                              />
                            </svg>
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GamesStyles>
    </Layout>
  );
}
