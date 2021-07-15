import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { sessionsData } from '../data';

const SidebarStyles = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  h4 {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 700;
  }

  .wrapper {
    padding: 3.5rem 4rem;
    min-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    z-index: 9999;
    transform: translateX(-100%);
    transition: transform 300ms ease-in-out;

    &.open {
      transform: translateX(0);
    }
  }

  .sidebar-item {
    border-bottom: 1px solid #e5e7eb;

    &:first-of-type {
      border-top: 1px solid #e5e7eb;
    }
  }

  a {
    padding: 0.625rem 0.5rem;
    display: flex;
    font-size: 0.8125rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: #4b5563;

    &:hover {
      background-color: #f3f4f6;
      color: #111827;
    }
  }

  .close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    border: none;
    background-color: transparent;
    color: #374151;
    cursor: pointer;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    &:hover {
      color: #000;
    }
  }
`;

type Props = {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = 'inherit';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setIsOpen, isOpen]);

  return (
    <SidebarStyles>
      <div className={`wrapper ${isOpen ? 'open' : 'closed'}`}>
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
        <h4>Session Film Schedules:</h4>
        {sessionsData.map(s => (
          <div key={s.id} className="sidebar-item">
            <Link
              href={`/games/update-schedule?camp=${s.location}&sessionId=${s.id}`}
            >
              <a>{s.name}</a>
            </Link>
          </div>
        ))}
      </div>
    </SidebarStyles>
  );
}
