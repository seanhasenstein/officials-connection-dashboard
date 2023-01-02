import React from 'react';
import styled from 'styled-components';
import {
  FilmedGame,
  HydratedSession,
  Registration,
  Session,
} from '../../types';
import { hydrateSessions } from '../../utils/filmedGame';
import SendButton from './SendButton';

type Props = {
  registrations: Registration[];
  sessions: Session[] | undefined;
  filmedGames: FilmedGame[];
};

export default function SendGameFilmEmails(props: Props) {
  const [hydratedSessions, setHydratedSessions] = React.useState<
    HydratedSession[]
  >([]);

  React.useEffect(() => {
    if (props.sessions) {
      const updatedHydratedSessions = hydrateSessions(
        props.registrations,
        props.sessions,
        props.filmedGames
      );
      setHydratedSessions(updatedHydratedSessions);
    }
  }, [props.filmedGames, props.registrations, props.sessions]);

  return (
    <SendGameFilmEmailsStyles>
      <div className="email-grid">
        <div className="column box">
          <h3>Kaukauna Game Film Emails</h3>
          {hydratedSessions
            ?.filter(s => s.camp.name.toLowerCase() === 'kaukauna')
            .map(s => (
              <SendButton key={s.sessionId} camp="Kaukauna" session={s} />
            ))}
        </div>
        <div className="column box">
          <h3>Plymouth Game Film Emails</h3>
          {hydratedSessions
            ?.filter(s => s.camp.name.toLowerCase() === 'plymouth')
            .map(s => (
              <SendButton key={s.sessionId} camp="Plymouth" session={s} />
            ))}
        </div>
      </div>
    </SendGameFilmEmailsStyles>
  );
}

const SendGameFilmEmailsStyles = styled.div`
  .email-grid {
    margin: 3.5rem auto 0;
    display: flex;
    gap: 4rem;
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    width: 100%;

    h3 {
      margin: 0 0 1.75rem;
    }
  }
`;
