import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Camp as ICamp,
  FilmedGame,
  Registration,
  Session,
  Year,
} from '../../types';
import ButtonSwitch from '../ButtonSwitch';
import Camp from './Camp';

type Props = {
  year: Year | undefined;
  isSuccess: boolean;
  kaukaunaCamp: ICamp | undefined;
  plymouthCamp: ICamp | undefined;
  stevensPointCamp: ICamp | undefined;
  registrations: Registration[];
  sessions: Session[];
};

export default function FilmedGames(props: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'kaukauna' | 'stevensPoint'>(
    'stevensPoint'
  );
  const [kaukaunaFilmedGames, setKaukaunaFilmedGames] = React.useState<
    FilmedGame[]
  >([]);
  // const [plymouthFilmedGames, setPlymouthFilmedGames] = React.useState<
  //   FilmedGame[]
  // >([]);
  const [stevensPointFilmedGames, setStevensPointFilmedGames] = React.useState<
    FilmedGame[]
  >([]);

  React.useEffect(() => {
    if (props.isSuccess) {
      if (props.kaukaunaCamp) {
        setKaukaunaFilmedGames(
          props.year?.filmedGames.filter(g => g.camp === 'kaukauna') || []
        );
      }
      // if (props.plymouthCamp) {
      //   setPlymouthFilmedGames(
      //     props.year?.filmedGames.filter(g => g.camp === 'plymouth') || []
      //   );
      // }
      if (props.stevensPointCamp) {
        setStevensPointFilmedGames(
          props.year?.filmedGames.filter(g => g.camp === 'stevensPoint') || []
        );
      }
    }
  }, [
    props.isSuccess,
    props.kaukaunaCamp,
    props.plymouthCamp,
    props.stevensPointCamp,
    props.year?.filmedGames,
  ]);

  return (
    <FilmedGamesStyles>
      <div className="box">
        <div className="header-row">
          {/* TODO: make year dynamic */}
          <h2>2024 filmed games</h2>
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
              <ButtonSwitch<'kaukauna', 'stevensPoint'>
                active={activeTab}
                setActive={setActiveTab}
                optionA="kaukauna"
                optionB="stevensPoint"
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
                  inactiveGames={stevensPointFilmedGames}
                />
              ) : activeTab === 'stevensPoint' ? (
                <Camp
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  registrations={props.registrations}
                  sessions={props.sessions || []}
                  activeGames={stevensPointFilmedGames}
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
