import React from 'react';
import styled from 'styled-components';
import { Game, GameOfficial } from '../interfaces';
import { formatGameName, formatSessionName } from '../utils/misc';
import { useRegistrationsQuery } from '../hooks/useRegistrationsQuery';
import useGame from '../hooks/useGame';
import useOutsideClick from '../hooks/useOutsideClick';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useToggleScroll from '../hooks/useToggleScroll';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  gameId: string | undefined;
  game: Game | undefined;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateGameOfficials({
  show,
  setShow,
  gameId,
  game,
  setShowNotification,
}: Props) {
  const { isLoading, error, data: registrations } = useRegistrationsQuery();
  const { updateGameOfficials } = useGame();
  const containerRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(show, setShow, containerRef);
  useEscapeKeydownClose(show, setShow);
  useToggleScroll(show);
  const [showResults, setShowResults] = React.useState(false);
  const [results, setResults] = React.useState<GameOfficial[]>([]);
  const [search, setSearch] = React.useState('');
  const [officials, setOfficials] = React.useState<GameOfficial[]>([]);

  React.useEffect(() => {
    if (game?.officials) {
      setOfficials(game.officials);
    }
  }, [game?.officials]);

  React.useEffect(() => {
    if (registrations && search.length >= 3) {
      const filterResults = registrations.filter(r => {
        const name = `${r.firstName} ${r.lastName}`;
        return name.toLowerCase().includes(search.toLowerCase());
      });

      const results = filterResults.reduce((acc: GameOfficial[], currRes) => {
        const result = currRes.sessions
          .filter(
            s =>
              s.attending &&
              !officials.find(
                o => o.rid === currRes._id && o.sid === s.sessionId
              )
          )
          .map(s => {
            return {
              key: `${currRes._id}${s.sessionId}`,
              name: `${currRes.firstName} ${currRes.lastName}`,
              rid: currRes._id,
              sid: s.sessionId,
              sessionName: formatSessionName(s),
            };
          });

        return [...acc, ...result];
      }, []);

      setShowResults(true);
      setResults(results);
    }
    if (search.length < 3 || results.length === 0) {
      setShowResults(false);
    }
  }, [officials, registrations, results.length, search]);

  const handleAddOfficialClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    r: GameOfficial
  ) => {
    e.stopPropagation();
    setOfficials(prevState => [...prevState, r]);
    setSearch('');
  };

  const handleRemoveOfficial = (
    e: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    e.stopPropagation();
    const update = officials.filter(o => o.key !== key);
    setOfficials(() => update);
  };

  const handleSubmitClick = () => {
    if (!gameId) {
      throw new Error('No game id was provided.');
    }
    updateGameOfficials.mutate(
      { officials, gameId },
      {
        onSuccess: () => {
          setShowResults(false);
          setResults([]);
          setSearch('');
          setOfficials([]);
          setShow(false);
          setShowNotification(true);
        },
      }
    );
  };

  return (
    <UpdateGameOfficialsStyles show={show} showResults={showResults}>
      <div ref={containerRef} className="container">
        {isLoading && <QueryLoader isLoading={isLoading} />}
        <h3>Add officials to this game</h3>
        <p>{game && formatGameName(game)}</p>
        {error instanceof Error && <div>Error: {error.message}</div>}
        {registrations && (
          <>
            <label htmlFor="search">Search for officials</label>
            <div className="search-container">
              <div className="inner">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <div className="results-container">
                  {showResults && (
                    <div className="results-list">
                      {results.map(r => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={e => handleAddOfficialClick(e, r)}
                          className="result-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {r.name} - {r.sessionName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {
              <div className="added-officials">
                {officials.length > 0 && <h4>Selected officials:</h4>}
                {officials.map(o => (
                  <div key={o.key} className="official">
                    {o.name} - {o.sessionName}
                    <button
                      type="button"
                      onClick={e => handleRemoveOfficial(e, o.key)}
                      className="remove-button"
                    >
                      <span className="sr-only">Remove official</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            }
            <div className="row">
              <div>
                {officials.length === 0 && (
                  <div className="empty">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No officials selected.
                  </div>
                )}
                {updateGameOfficials.isError && (
                  <div className="error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    An error occurred adding the game.
                  </div>
                )}
              </div>
              <div className="actions">
                {updateGameOfficials.isLoading ? (
                  <LoadingSpinner isLoading={updateGameOfficials.isLoading} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmitClick}
                  className="submit-button"
                >
                  Add officials
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </UpdateGameOfficialsStyles>
  );
}

const UpdateGameOfficialsStyles = styled.div<{
  show: boolean;
  showResults: boolean;
}>`
  padding: 8rem 0 0;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: ${props => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.5);

  .container {
    position: relative;
    padding: 3rem 4rem 2rem;
    width: 40rem;
    background-color: #fff;
    border-radius: 0.5rem;
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  h4 {
    margin: 0 0 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0 0 2rem;
    font-size: 1rem;
    font-weight: 500;
    color: #4b5563;

    &.official {
      margin: 0;
    }
  }

  label {
    margin: 0 0 0.75rem;
    display: flex;
  }

  .search-container {
    position: relative;
  }

  .inner {
    position: ${props => (props.showResults ? 'absolute' : 'static')};
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: ${props =>
      props.showResults
        ? 'rgb(255, 255, 255) 0px 0px 0px 0px,rgba(17, 24, 39, 0.05) 0px 0px 0px 1px,rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;'
        : 'none'};
    border-radius: 0.5rem;
  }

  input {
    padding: ${props => (props.showResults ? '0.75rem 1rem' : '')};
    border: ${props => (props.showResults ? 'none' : '')};
    border-radius: ${props => (props.showResults ? '0.5rem 0.5rem 0 0' : '')};
    box-shadow: ${props => (props.showResults ? 'none' : '')};

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
  }

  .results-container {
    position: relative;

    .results-list {
      padding: 0 1rem;
      position: relative;
      display: flex;
      flex-direction: column;
      z-index: 9999;
    }

    .result-button {
      padding: 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.4375rem;
      background-color: transparent;
      border: none;
      color: #374151;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;

      svg {
        height: 0.875rem;
        width: 0.875rem;
        color: #d1d5db;
      }

      &:first-of-type {
        border-top: 1px solid #d1d5db;
      }

      &:last-of-type {
        border-bottom: none;
      }

      &:hover {
        color: #000;

        svg {
          color: #06a976;
        }
      }
    }
  }

  .added-officials {
    margin: 1.75rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .empty {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;

    svg {
      margin: 0 0.375rem 0 0;
      height: 0.875rem;
      width: 0.875rem;
      color: #bbc1ca;
    }
  }

  .official {
    padding: 0.875rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    border-bottom: 1px solid #e5e7eb;

    &:first-of-type {
      border-top: 1px solid #e5e7eb;
    }
  }

  .remove-button {
    margin: 0 0 0 0.3125rem;
    padding: 0;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #ef4444;
    cursor: pointer;

    svg {
      height: 0.875rem;
      width: 0.875rem;
    }

    &:hover {
      color: #dc2626;
    }
  }

  .row {
    margin: 2rem 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .cancel-button,
  .submit-button {
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
  }

  .cancel-button {
    background-color: transparent;
    border: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-width: 2px;
    }
  }

  .submit-button {
    padding: 0.5rem 0.75rem;
    color: #f9fafb;
    background-color: #1f2937;
    border: 1px solid #000;
    border-radius: 0.25rem;
    box-shadow: inset 0 1px 1px #6b7280;

    &:hover {
      background-color: #111827;
    }
  }

  .error {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;

    svg {
      margin: 0 0.375rem 0 0;
      height: 0.875rem;
      width: 0.875rem;
      color: #f87171;
    }
  }
`;

const QueryLoader = styled(LoadingSpinner)`
  position: absolute;
  top: 2rem;
  right: 2rem;
`;
