import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { FilmedGame, Registration, Session, Year } from '../../types';
import { formatSessionName, formatSessionNameFromId } from '../../utils/misc';
import useDragNDrop from '../../hooks/useDragNDrop';

type Props = {
  registrations: Registration[] | undefined;
  sessions: Session[];
  activeGames: FilmedGame[];
  inactiveGames: FilmedGame[];
  activeTab: 'kaukauna' | 'plymouth';
  setActiveTab: React.Dispatch<React.SetStateAction<'kaukauna' | 'plymouth'>>;
};

interface HydratedGame extends Omit<FilmedGame, 'officials'> {
  hydratedOfficials: {
    id: string;
    name: string;
    sessions: Session[];
    isValid: boolean;
  }[];
}

export default function Camp(props: Props) {
  const queryClient = useQueryClient();
  const [games, setGames] = React.useState<HydratedGame[]>([]);

  const updateGames = useMutation(
    async (updatedHydratedGames: HydratedGame[]) => {
      const updatedGames: FilmedGame[] = updatedHydratedGames.map(g => {
        const { hydratedOfficials, ...game } = g;
        const officials = hydratedOfficials.map(o => ({
          id: o.id,
          name: o.name,
        }));
        return { ...game, officials };
      });

      const response = await fetch('/api/filmed-games/update', {
        method: 'POST',
        body: JSON.stringify([...updatedGames, ...props.inactiveGames]),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the game.');
      }

      const data: { year: Year } = await response.json();
      return data.year;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('year');
      },
    }
  );
  const dnd = useDragNDrop<HydratedGame>(
    games,
    'grid-item',
    updateGames.mutate
  );

  React.useEffect(() => {
    if (props.registrations) {
      const hydratedGames = props.activeGames.map(g => {
        const updatedOfficials = g.officials.map(o => {
          const registration = props.registrations?.find(r => r.id === o.id);
          const isValid =
            registration?.sessions.some(
              s =>
                registration.email &&
                s.attending &&
                g.sessions.some(gs => gs === s.sessionId)
            ) || false;
          const sessions =
            registration?.sessions.filter(s => s.attending).map(s => s) || [];
          return { ...o, sessions, isValid };
        });
        return { ...g, hydratedOfficials: updatedOfficials };
      });

      setGames(hydratedGames);
    }
  }, [props.activeGames, props.registrations]);

  return (
    <CampStyles>
      <div className="grid">
        <div className="grid-header">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>Name</div>
          <div>Sessions</div>
          <div>Clinicians</div>
          <div>Officials</div>
          <div>URL</div>
          <div>Edit</div>
        </div>
        <div className="grid-body">
          {games.length > 0 ? (
            <>
              {dnd.list.map((game, index) => (
                <div
                  key={game.id}
                  draggable={dnd.dragging}
                  onDragStart={e => dnd.handleDragStart(e, index)}
                  onDragEnter={
                    dnd.dragging
                      ? e => dnd.handleDragEnter(e, index)
                      : undefined
                  }
                  onDragOver={e => e.preventDefault()}
                  onDrop={dnd.handleDrop}
                  className={dnd.dragging ? dnd.getStyles(index) : 'grid-item'}
                >
                  <button
                    type="button"
                    onMouseDown={dnd.handleMouseDown}
                    onMouseUp={dnd.handleMouseUp}
                    className="drag-n-drop-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  <div>{game.name}</div>
                  <div className="flex-col">
                    {game.sessions.map(s => (
                      <div key={s}>
                        {formatSessionNameFromId(props.sessions, s)}
                      </div>
                    ))}
                  </div>
                  <div>{game.clinicians}</div>
                  <div className="flex-col officials">
                    {game.hydratedOfficials.map(o => (
                      <div key={o.id} className="official">
                        <span
                          className={`dot ${o.isValid ? 'valid' : 'invalid'}`}
                        />
                        <div>
                          <Link href={`/registrations/${o.id}`}>
                            <div className="official-name">{o.name}</div>
                          </Link>
                          <div>
                            {o.sessions.map(s => (
                              <div
                                key={s.sessionId}
                                className="official-session"
                              >
                                {formatSessionName(s)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="url">
                    {game.url ? (
                      <a href={game.url} target="_blank" rel="noreferrer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">{game.url}</span>
                      </a>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="no-url-warning"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/filmed-games/update?id=${game.id}`}
                      className="edit-link"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="empty">There are currently 0 filmed games.</div>
          )}
        </div>
      </div>
    </CampStyles>
  );
}

const CampStyles = styled.div`
  .grid-header,
  .grid-item {
    display: grid;
    grid-template-columns: 3rem 1fr 1fr 0.75fr 0.75fr 3rem 3.5rem;

    > div:last-of-type {
      text-align: right;
    }
  }

  .grid-header {
    padding: 0.625rem 1rem 0.625rem 0.75rem;
    align-items: center;
    background-color: #f3f4f6;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid #e5e7eb;
    border-radius: 0.125rem;

    > div:first-of-type svg {
      height: 1.125rem;
      width: 1.125rem;
      color: #6b7280;
    }
  }

  .grid-body {
    padding: 0.25rem 0;
    background-color: #fff;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .grid-item {
    padding: 0.875rem 1rem 0.875rem 0.75rem;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #111827;

    a:hover {
      text-decoration: underline;
    }

    &:nth-of-type(even) {
      background-color: #f3f4f6;
      border-left: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
      border-radius: 0.125rem;
    }
  }

  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .drag-n-drop-button {
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #9ca3af;
    text-align: left;
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      color: #000;
    }

    svg {
      flex-shrink: 0;
      height: 1rem;
      width: 1rem;

      &:first-of-type {
        margin-right: -0.625rem;
      }
    }
  }

  .officials {
    gap: 0.625rem;
  }

  .official {
    display: flex;

    .dot {
      margin-top: 0.3475rem;
    }
  }

  .official-name {
    font-weight: 500;
  }

  .official-session {
    margin: 0.1875rem 0 0;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .url {
    a {
      height: 2.25rem;
      width: 2.25rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border-radius: 9999px;
      color: #374151;
      transition: background-color 150ms linear;

      &:hover {
        background-color: #f3f4f6;
        color: #111827;
      }
    }

    svg {
      height: 1.125rem;
      width: 1.125rem;

      &.no-url-warning {
        color: #be123c;
      }
    }
  }

  .edit-link {
    color: #0441ac;
    font-weight: 500;
  }

  .empty {
    padding: 1rem 0.875rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;
  }
`;
