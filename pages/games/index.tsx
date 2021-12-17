import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import useGame from '../../hooks/useGame';
import useSession from '../../hooks/useSessions';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteModal from '../../components/DeleteModal';

export default function Game() {
  const [session, sessionLoading] = useSession();
  const router = useRouter();
  const { gameQuery, deleteGame } = useGame();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteMenuClick = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const deleteGameCallback = () => {
    if (!gameQuery.data) return;
    deleteGame.mutate(gameQuery.data, {
      onSuccess: () => router.push('/?deleteGameModal=true', '/'),
    });
  };

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <GameStyles>
        {gameQuery.isLoading && <GameSpinner isLoading={gameQuery.isLoading} />}
        {gameQuery.error instanceof Error && (
          <div>Error: {gameQuery.error}</div>
        )}
        {gameQuery.data && (
          <div className="container">
            <div className="header">
              <div className="column">
                <h2>Game</h2>
                <p>{gameQuery.data._id}</p>
              </div>
              <div className="menu">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(prevState => !prevState)}
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
                <GameMenu open={isMenuOpen} setOpen={setIsMenuOpen}>
                  <Link
                    href={`/games/update-game?gid=${gameQuery.data._id}&camp=${gameQuery.data.camp}`}
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
                    onClick={handleDeleteMenuClick}
                    className="delete-button"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Game
                  </button>
                </GameMenu>
              </div>
            </div>
            <div className="grid">
              <div className="item">
                <h3>Camp</h3>
                <p>{gameQuery.data.camp}</p>
              </div>
              <div className="item">
                <h3>Day/Time</h3>
                <p>{format(new Date(gameQuery.data.date), 'iii h:mmaaa')}</p>
              </div>
              <div className="item">
                <h3>Category</h3>
                <p>{gameQuery.data.category}</p>
              </div>
              <div className="item">
                <h3>Clinician</h3>
                <p>{gameQuery.data.clinician}</p>
              </div>
              <div className="item">
                <h3>Court</h3>
                <p>{gameQuery.data.court}</p>
              </div>
              <div className="item">
                <h3>URL</h3>
                <p>
                  {gameQuery.data.filmed ? (
                    <a
                      href={gameQuery.data.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {gameQuery.data.url}
                    </a>
                  ) : (
                    'Game not filmed'
                  )}
                </p>
              </div>
            </div>
            <div>
              <h3>Officials</h3>
              {gameQuery?.data?.officials ? (
                <div className="campers">
                  {gameQuery.data.officials.map(o => (
                    <Link key={o.key} href={`/registrations/${o.rid}`}>
                      <a className="camper">
                        <div className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="name">{o.name}</p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
        {gameQuery.data?._id && (
          <DeleteModal
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            callback={deleteGameCallback}
            isLoading={deleteGame.isLoading}
            category="game"
          />
        )}
      </GameStyles>
    </Layout>
  );
}

const GameStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    position: relative;
    margin: 0 auto;
    padding: 3rem 4rem;
    max-width: 56rem;
    width: 100%;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .header {
    margin: 0 0 2rem;
    padding: 0 0 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;

    p {
      color: #6b7280;
    }
  }

  .menu {
    .menu-button {
      margin: 0;
      padding: 0.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      border-radius: 9999px;

      svg {
        height: 1.25rem;
        width: 1.25rem;
      }

      &:hover {
        color: #111827;
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .item {
    margin: 0 0 2.5rem;
  }

  .game-id {
    margin: 0 0 2.5rem;
  }

  .campers {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .camper {
    flex: 1;
    margin: 1rem 0 0;
    padding: 0.5rem 1.5rem 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;

    .icon {
      height: 2.5rem;
      width: 2.5rem;
      color: #d1d5db;
    }

    &:hover {
      border-color: #d1d5db;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  h2 {
    margin: 0 0 0.25rem;
  }

  h3 {
    margin: 0 0 0.125rem;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    color: #111827;

    a {
      &:hover {
        text-decoration: underline;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        text-decoration: underline;
      }
    }

    &.name {
      margin: 0 0 0.125rem;
      font-size: 0.875rem;
    }
  }
`;

const GameMenu = styled(Menu)`
  top: 5.25rem;
  right: 3.5rem;

  .delete-button:hover,
  .delete-button:hover svg {
    color: #b91c1c;
    text-decoration: underline;
  }
`;

const GameSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
