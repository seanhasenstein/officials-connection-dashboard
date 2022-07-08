import React from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { HydratedSession, Year } from '../../interfaces';
import { formatSessionName } from '../../utils/misc';

type SendButtonProps = {
  camp: 'Kaukauna' | 'Plymouth';
  session: HydratedSession;
};

export default function SendButton(props: SendButtonProps) {
  const queryClient = useQueryClient();
  const [active, setActive] = React.useState(false);

  const sendGame = useMutation(
    async ({
      camp,
      sessionId,
    }: {
      camp: 'Kaukauna' | 'Plymouth';
      sessionId: string;
    }) => {
      const response = await fetch('/api/send-game-film-emails', {
        method: 'POST',
        body: JSON.stringify({ sessionId, camp }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send game film session emails.');
      }

      const data: { year: Year } = await response.json();

      return data.year;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('year');
        setActive(false);
      },
    }
  );

  return (
    <SendButtonStyles key={props.session.sessionId}>
      <button
        type="button"
        disabled={
          !active ||
          !props.session.isReadyToSendEmail ||
          sendGame.isLoading ||
          sendGame.isSuccess ||
          props.session.filmedGamesEmailSent
        }
        onClick={() =>
          sendGame.mutate({
            camp: props.camp,
            sessionId: props.session.sessionId,
          })
        }
        className={`send-game-film-button${
          props.session.filmedGamesEmailSent ? ' line-through' : ''
        }`}
      >
        <span
          className={`dot ${
            props.session.isReadyToSendEmail ? 'valid' : 'invalid'
          }`}
        />
        {sendGame.isLoading ? 'Loading...' : formatSessionName(props.session)}
      </button>
      <button
        type="button"
        onClick={() => setActive(!active)}
        role="switch"
        aria-checked={active}
        className={`toggle ${active ? 'on' : 'off'}`}
        disabled={
          !props.session.isReadyToSendEmail ||
          sendGame.isLoading ||
          props.session.filmedGamesEmailSent
        }
      >
        <span aria-hidden="true" className="switch" />
      </button>
    </SendButtonStyles>
  );
}

const SendButtonStyles = styled.div`
  margin: 0 0 0.4375rem;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

  .dot {
    margin: 0 0.6875rem 0 0;
  }

  .send-game-film-button {
    margin: 0 1.25rem 0 0;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    background-color: #1f2937;
    border: none;
    border-radius: 0.375rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f3f4f6;
    cursor: pointer;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: all 150ms linear;

    &:hover:not(:disabled) {
      background-color: #111827;
    }

    &:disabled {
      padding-left: 0.25rem;
      background-color: transparent;
      box-shadow: none;
      color: #4b5563;
      pointer-events: none;
      cursor: default;
    }
  }

  .toggle:disabled {
    pointer-events: none;
  }

  & .line-through {
    text-decoration: line-through;
    cursor: default;
  }
`;
