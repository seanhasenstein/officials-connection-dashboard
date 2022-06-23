import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FilmedGame, Session } from '../../interfaces';
import useYearQuery from '../../hooks/queries/useYearQuery';
import Layout from '../../components/Layout';
import ButtonSwitch from '../../components/ButtonSwitch';
import { formatSessionNameFromId, getUrlParam } from '../../utils/misc';
import Link from 'next/link';

type CampProps = {
  sessions: Session[];
  games: FilmedGame[];
};

function Camp(props: CampProps) {
  return (
    <div className="grid">
      <div className="grid-header">
        <div>Name</div>
        <div>Sessions</div>
        <div>Clinicians</div>
        <div>Officials</div>
        <div>URL</div>
        <div>Edit</div>
      </div>
      <div className="grid-body">
        {props.games.length > 0 ? (
          <>
            {props.games.map(g => (
              <div key={g.id} className="grid-item">
                <div>{g.name}</div>
                <div>
                  {g.sessions.map(s =>
                    formatSessionNameFromId(props.sessions, s)
                  )}
                </div>
                <div>{g.clinicians}</div>
                <div className="flex-col">
                  {g.officials.map(o => (
                    <div key={o._id}>{o.name}</div>
                  ))}
                </div>
                <div className="url">
                  {g.url && (
                    <a href={g.url} target="_blank" rel="noreferrer">
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
                      <span className="sr-only">{g.url}</span>
                    </a>
                  )}
                </div>
                <div>
                  <Link href={`/filmed-games/update?id=${g.id}`}>
                    <a className="edit-link">Edit</a>
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
  );
}

export default function FilmedGames() {
  const router = useRouter();
  const yearQuery = useYearQuery();
  const [kaukaunaFilmedGames, setKaukaunaFilmedGames] = React.useState<
    FilmedGame[]
  >([]);
  const [plymouthFilmedGames, setPlymouthFilmedGames] = React.useState<
    FilmedGame[]
  >([]);
  const [activeTab, setActiveTab] = React.useState<'kaukauna' | 'plymouth'>(
    'kaukauna'
  );

  React.useEffect(() => {
    if (yearQuery.isSuccess) {
      if (yearQuery.kaukaunaCamp) {
        setKaukaunaFilmedGames(
          yearQuery.year?.filmedGames.filter(g => g.camp === 'kaukauna') || []
        );
      }
      if (yearQuery.plymouthCamp) {
        setPlymouthFilmedGames(
          yearQuery.year?.filmedGames.filter(g => g.camp === 'plymouth') || []
        );
      }
    }
  }, [
    yearQuery.isSuccess,
    yearQuery.kaukaunaCamp,
    yearQuery.plymouthCamp,
    yearQuery.year?.filmedGames,
  ]);

  React.useEffect(() => {
    if (router.isReady) {
      const query = getUrlParam(router.query.active);
      const tab = query === 'plymouth' ? 'plymouth' : 'kaukauna';
      setActiveTab(tab);
    }
  }, [activeTab, router.isReady]);

  return (
    <Layout title="Filmed games">
      <FilmedGamesStyles>
        <div className="container">
          <h2>{new Date().getFullYear()} filmed games</h2>
          {yearQuery.isLoading ? (
            'Loading...'
          ) : (
            <>
              <div className="tab-buttons">
                <ButtonSwitch<'kaukauna', 'plymouth'>
                  active={activeTab}
                  setActive={setActiveTab}
                  optionA="kaukauna"
                  optionB="plymouth"
                  handleClick={option =>
                    router.push(`/filmed-games?active=${option}`)
                  }
                />
              </div>
              <div className="camps">
                {activeTab === 'kaukauna' ? (
                  <Camp
                    sessions={yearQuery.sessions || []}
                    games={kaukaunaFilmedGames}
                  />
                ) : activeTab === 'plymouth' ? (
                  <Camp
                    sessions={yearQuery.sessions || []}
                    games={plymouthFilmedGames}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      </FilmedGamesStyles>
    </Layout>
  );
}

const FilmedGamesStyles = styled.div`
  padding: 5rem 0;
  background-color: #f3f4f6;
  min-height: calc(100vh - 151px);

  .container {
    margin: 0 auto;
    max-width: 74rem;
    width: 100%;
  }

  h2 {
    text-align: center;
  }

  .tab-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .camps {
    margin: 2.5rem 0 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .grid-header,
  .grid-item {
    display: grid;
    grid-template-columns: 1fr 1fr 0.8fr 0.8fr 5rem 5rem;
  }

  .grid-header {
    padding: 0.75rem 1rem;
    background-color: #e5e7eb;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    border-bottom: 1px solid #d1d5db;
  }

  .grid-body {
    padding: 0.25rem 0;
    background-color: #fff;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .grid-item {
    padding: 1rem;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.9375rem;
    color: #111827;

    a:hover {
      text-decoration: underline;
    }

    &:last-of-type {
      border-bottom: none;
    }
  }

  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 0.3125rem;
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
    }
  }

  .edit-link {
    color: #4338ca;
  }

  .empty {
    padding: 1rem 0.875rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;
  }
`;
