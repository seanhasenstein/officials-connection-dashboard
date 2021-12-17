import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import useGame from '../../../hooks/useGame';
import useMenu from '../../../hooks/useMenu';
import useSession from '../../../hooks/useSessions';
import Layout from '../../../components/Layout';
import Menu from '../../../components/Menu';
import UpdateGameOfficials from '../../../components/UpdateGameOfficials';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Notification from '../../../components/Notification';

export default function CampGames() {
  const [session, sessionLoading] = useSession();
  const { gamesQuery, camp } = useGame();
  const { activeMenuId, handleMenuButtonClick, isOpen, setIsOpen } = useMenu();
  const [activeGameId, setActiveGameId] = React.useState<string>();
  const [showAddOfficials, setShowAddOfficials] = React.useState(false);
  const [showGameNotification, setShowGameNotification] = React.useState(false);

  const handleAddOfficialsClick = (id: string) => {
    setShowAddOfficials(true);
    setIsOpen(false);
    setActiveGameId(id);
  };

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <CampGameStyles>
        {gamesQuery.error instanceof Error && (
          <div>Error: {gamesQuery.error}</div>
        )}
        <div className="container">
          <h2>Games Schedule</h2>
          <h3>
            [<span>{camp} Camp</span>]
          </h3>
          {gamesQuery.isLoading && (
            <GamesSpinner isLoading={gamesQuery.isLoading} />
          )}
          {gamesQuery.isSuccess && gamesQuery.data && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Day/Time</th>
                    <th>Court</th>
                    <th className="text-center">Category</th>
                    <th>Officials</th>
                    <th>Clinician</th>
                    <th className="text-center">YouTube URL</th>
                    <th className="text-center">Menu</th>
                  </tr>
                </thead>
                <tbody>
                  {gamesQuery.data.map(g => (
                    <tr key={g._id}>
                      <td>{format(new Date(g.date), 'EEE @ h:mmaaa')}</td>
                      <td>{g.court}</td>
                      <td className="text-center">
                        {g.category === 'High School'
                          ? 'HS'
                          : g.category === "Men's College"
                          ? 'MC'
                          : g.category === "Women's College"
                          ? 'WC'
                          : g.category === 'Mixed'
                          ? 'Mixed'
                          : ''}
                      </td>
                      <td className="officials">
                        {g.officials?.map(o => (
                          <Link key={o.key} href={`/registrations/${o.rid}`}>
                            <a>
                              <p>{o.name}</p>
                            </a>
                          </Link>
                        ))}
                      </td>
                      <td>{g.clinician}</td>
                      <td className="youtube">
                        <a href={g.url} target="_blank" rel="noreferrer">
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
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </a>
                      </td>
                      <td>
                        <div className="links">
                          <button
                            type="button"
                            onClick={() => handleMenuButtonClick(g._id)}
                            className="menu-button"
                          >
                            <span className="sr-only">Menu</span>
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
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          <Menu
                            open={g._id === activeMenuId && isOpen}
                            setOpen={setIsOpen}
                          >
                            <>
                              <Link href={`/games?gid=${g._id}&camp=${camp}`}>
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
                                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  View Game
                                </a>
                              </Link>
                              <Link
                                href={`/games/update-game?gid=${g._id}&camp=${camp}`}
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
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  Update Game
                                </a>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleAddOfficialsClick(g._id)}
                              >
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                                Update Officials
                              </button>
                            </>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CampGameStyles>
      {showAddOfficials && (
        <UpdateGameOfficials
          show={showAddOfficials}
          setShow={setShowAddOfficials}
          gameId={activeGameId}
          game={gamesQuery?.data?.find(g => g._id === activeGameId)}
          setShowNotification={setShowGameNotification}
        />
      )}
      <GameNotification
        show={showGameNotification}
        setShow={setShowGameNotification}
        heading="Game successfully updated"
      />
    </Layout>
  );
}

const CampGameStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
  }

  h3 {
    margin: 0 0 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-align: center;
    color: #d1d5db;

    span {
      font-size: 1.125rem;
      font-weight: 600;
      color: #9ca3af;
    }
  }

  .table-container {
    padding: 0.75rem;
    overflow: visible;
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
    color: #374151;
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

    &.officials {
      a {
        margin: 0 0 0.3125rem;
        display: flex;

        &:hover {
          text-decoration: underline;
        }

        &:last-of-type {
          margin: 0;
        }
      }

      p {
        margin: 0;
      }
    }
  }

  .youtube {
    text-align: center;

    a {
      padding: 0.25rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      color: #9ca3af;
      border-radius: 9999px;

      &:hover {
        background-color: #edf0f3;
        color: #4b5563;
      }
    }

    svg {
      height: 1rem;
      width: 1rem;
    }
  }

  .links {
    position: relative;
    overflow: visible;
    color: #9ca3af;
    display: flex;
    justify-content: center;
  }

  .menu-button {
    margin: 0;
    padding: 0;
    height: 1.625rem;
    width: 1.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    border-radius: 9999px;

    svg {
      height: 1.125rem;
      width: 1.125rem;
    }

    &:hover {
      color: #111827;
    }
  }
`;

const GamesSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;

const GameNotification = styled(Notification)`
  align-items: center;
`;
