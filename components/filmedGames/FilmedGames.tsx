import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Camp as ICamp,
  FilmedGame,
  Registration,
  Session,
  Year,
} from '../../interfaces';
import ButtonSwitch from '../ButtonSwitch';
import Camp from './Camp';

type Props = {
  year: Year | undefined;
  isSuccess: boolean;
  kaukaunaCamp: ICamp | undefined;
  plymouthCamp: ICamp | undefined;
  registrations: Registration[];
  sessions: Session[];
};

export default function FilmedGames(props: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'kaukauna' | 'plymouth'>(
    'kaukauna'
  );
  const [kaukaunaFilmedGames, setKaukaunaFilmedGames] = React.useState<
    FilmedGame[]
  >([]);
  const [plymouthFilmedGames, setPlymouthFilmedGames] = React.useState<
    FilmedGame[]
  >([]);

  React.useEffect(() => {
    if (props.isSuccess) {
      if (props.kaukaunaCamp) {
        setKaukaunaFilmedGames(
          props.year?.filmedGames.filter(g => g.camp === 'kaukauna') || []
        );
      }
      if (props.plymouthCamp) {
        setPlymouthFilmedGames(
          props.year?.filmedGames.filter(g => g.camp === 'plymouth') || []
        );
      }
    }
  }, [
    props.isSuccess,
    props.kaukaunaCamp,
    props.plymouthCamp,
    props.year?.filmedGames,
  ]);

  return (
    <FilmedGamesStyles>
      <div className="box">
        <div className="header-row">
          <h2>2022 filmed games</h2>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            role="switch"
            aria-checked={open}
            className={`toggle ${open ? 'on' : 'off'}`}
          >
            <span aria-hidden="true" className="switch" />
          </button>
        </div>
        {open ? (
          <div>
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
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  registrations={props.registrations}
                  sessions={props.sessions || []}
                  activeGames={kaukaunaFilmedGames}
                  inactiveGames={plymouthFilmedGames}
                />
              ) : activeTab === 'plymouth' ? (
                <Camp
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  registrations={props.registrations}
                  sessions={props.sessions || []}
                  activeGames={plymouthFilmedGames}
                  inactiveGames={kaukaunaFilmedGames}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </FilmedGamesStyles>
  );
}

const FilmedGamesStyles = styled.div`
  .tab-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .camps {
    margin: 2.25rem 0 0;
  }
`;
