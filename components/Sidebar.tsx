import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { sessionsData } from '../data';
import { formatSessionName } from '../utils';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useOutsideClick from '../hooks/useOutsideClick';

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(isOpen, setIsOpen, sidebarRef);
  useEscapeKeydownClose(isOpen, setIsOpen);

  return (
    <SidebarStyles>
      <div
        ref={sidebarRef}
        className={`container ${isOpen ? 'open' : 'closed'}`}
      >
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
        <h4>2022 WBYOC Sessions</h4>
        {sessionsData.map(s => (
          <div key={s.id} className="sidebar-item">
            <Link href={`/registrations/session?sid=${s.id}`}>
              <a>
                {formatSessionName(s)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </Link>
          </div>
        ))}
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
    margin: 0 0 1.5rem;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    text-align: center;
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
    width: 16.5rem;
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
      box-shadow: inset 0 2px 2px #fff;

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
    top: 1.125rem;
    right: 1.125rem;
    display: inline-flex;
    display: none;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    color: #9ca3af;
    border-radius: 9999px;
    cursor: pointer;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    &:hover {
      color: #374151;
    }
  }
`;
