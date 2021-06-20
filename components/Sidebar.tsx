import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { sessionsData } from '../data';

const SidebarStyles = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

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
    margin: 0.875rem 0;
  }

  a {
    font-weight: 500;
    color: #4b5563;

    &:hover {
      text-decoration: underline;
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
      console.log(e.key);
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
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
        {sessionsData.map(s => (
          <div key={s.id} className="sidebar-item">
            <Link href={`/session?id=${s.id}`}>
              <a>{s.name}</a>
            </Link>
          </div>
        ))}
      </div>
    </SidebarStyles>
  );
}
