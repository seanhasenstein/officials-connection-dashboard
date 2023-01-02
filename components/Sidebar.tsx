import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { formatSessionName } from '../utils/misc';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useOutsideClick from '../hooks/useOutsideClick';
import useRegistrationsQuery from '../hooks/queries/useRegistrationsQuery';
import useYearQuery from '../hooks/queries/useYearQuery';

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type SidebarSessions = {
  sessionId: string;
  name: string;
  totalAttending: number;
}[];

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const {
    isLoading: rLoading,
    error: rError,
    data: registrations,
  } = useRegistrationsQuery();
  const { sessions, isLoading: yLoading, error: yError } = useYearQuery();
  useOutsideClick(isOpen, setIsOpen, sidebarRef);
  useEscapeKeydownClose(isOpen, setIsOpen);
  const [sidebarSessions, setSidebarSessions] =
    React.useState<SidebarSessions>();

  React.useEffect(() => {
    if (sessions && registrations) {
      const accumulator = sessions.map(s => ({
        sessionId: s.sessionId,
        name: formatSessionName(s),
        totalAttending: 0,
      }));
      const reducerResult = registrations.reduce(
        (accumulator: SidebarSessions, currentRegistration) => {
          const sessionIds = currentRegistration.sessions.map(s => {
            if (s.attending) {
              return s.sessionId;
            }
          });
          return accumulator.map(a => {
            if (sessionIds.includes(a.sessionId)) {
              return { ...a, totalAttending: a.totalAttending + 1 };
            }
            return a;
          });
        },
        accumulator
      );

      setSidebarSessions(reducerResult);
    }
  }, [registrations, sessions]);

  return (
    <SidebarStyles>
      <div
        ref={sidebarRef}
        className={`container ${isOpen ? 'open' : 'closed'}`}
      >
        {rLoading || (yLoading && <div>Loading...</div>)}
        {rError || yError ? (
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
            <span>An error occurred loading the registrations</span>
          </div>
        ) : (
          <>
            {/* TODO: make year dynamic */}
            <h4>2023 WBYOC Sessions</h4>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {sidebarSessions?.map(s => (
              <div key={s.sessionId} className="sidebar-item">
                <Link href={`/registrations/session?sid=${s.sessionId}`}>
                  {s.name}
                  <span>{s.totalAttending}</span>
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </SidebarStyles>
  );
}

const SidebarStyles = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;

  h4 {
    margin: 0 0 2rem;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.075em;
  }

  .container {
    padding: 2.25rem 3rem 0;
    min-height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;

    &.open {
      transform: translateX(0);
    }
  }

  .sidebar-item {
    border-bottom: 1px solid #f0f1f4;

    &:first-of-type {
      border-top: 1px solid #f0f1f4;
    }
  }

  a {
    padding: 0.75rem 0.375rem 0.75rem;
    width: 17rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #374151;

    svg {
      height: 0.8125rem;
      width: 0.8125rem;
      color: #9ca3af;
    }

    &:hover {
      background-color: #f9fafb;
      color: #111827;

      svg {
        color: #4f46e5;
      }
    }
    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      text-decoration: underline;

      svg {
        color: #4f46e5;
      }
    }
  }

  .close-btn {
    padding: 0.375rem;
    position: absolute;
    top: 2rem;
    right: 1.125rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    color: #9ca3af;
    border-radius: 9999px;
    cursor: pointer;

    svg {
      height: 1rem;
      width: 1rem;
    }

    &:hover {
      color: #374151;
    }
  }

  .error {
    max-width: 15rem;
    display: flex;
    gap: 0.625rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    line-height: 1.35;

    svg {
      margin: 1px 0 0;
      flex-shrink: 0;
      height: 1.125rem;
      width: 1.125rem;
      color: #b91c1c;
    }
  }
`;
