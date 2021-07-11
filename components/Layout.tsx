import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { createGlobalStyle } from 'styled-components';
import { sessionsData } from '../data';
import Sidebar from './Sidebar';

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/Inter-Regular.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Regular.woff?v=3.18") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/Inter-Medium.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Medium.woff?v=3.18") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/Inter-SemiBold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-SemiBold.woff?v=3.18") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/Inter-Bold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Bold.woff?v=3.18") format("woff");
}
html,
  body {
  padding: 0;
  margin: 0;
  font-size: 16px;
  /* letter-spacing: -0.011em; */
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "cv02","cv03","cv04","cv09", "cv11";
}
html, body, button, input, textarea {
  font-family: 'Inter',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
#__next {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
}
a {
  color: inherit;
  text-decoration: none;
}
* {
  box-sizing: border-box;
}
.sr-only {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
label {
  margin: 0 0 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6e788c;
}
input, select, textarea {
  appearance: none;
  background-color: #fff;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
input, textarea {
  padding: 0.625rem 0.75rem;
}
textarea {
  min-height: 7rem;
  resize: vertical;
}
select {
  padding: 0 2.5rem 0 0.75rem;
  height: 42px;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-size: 1.375em 1.375em;
  background-repeat: no-repeat;
  color-adjust: exact;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #36383e;
  cursor: pointer;
}
select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(65, 141, 203, 0.2);
  border-color: #8faef4;
}

input[type='checkbox'] {
  appearance: none;
  padding: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  color: #2563eb;
  border: 1px solid #d1d5db;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  background-color: #fff;
}

input[type='checkbox']:checked, input[type='radio']:checked {
  border-color: transparent;
  background-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

input[type='checkbox']:checked:hover,
input[type='checkbox']:checked:focus, input[type='radio']:checked:hover, input[type='radio']:checked:focus {
  border-color: transparent;
  background-color: currentColor;
}

input[type='checkbox']:focus, input[type='radio']:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #3b82f6 0px 0px 0px 4px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;
}

input[type='radio'] {
  padding: 0;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 100%;
  color: #2563EB;
}

input[type='radio']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}
`;

const LayoutStyles = styled.div`
  width: 100%;
  background-color: #fff;

  header {
    padding: 1.25rem 1.5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    z-index: 9999;
    position: relative;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 3rem;

    a {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;

      svg {
        height: 1.5rem;
        width: 1.5rem;
      }

      &:hover {
        color: #374151;
      }
    }
  }

  .sidebar-btn {
    background-color: transparent;
    border: none;
    color: #4b5563;
    cursor: pointer;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    &:hover {
      color: #000;
    }
  }
`;

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [router.query.sessionId]);

  const handleBlur = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'default') return;
    router.push(`/session?id=${e.target.value}`);
  };

  return (
    <LayoutStyles>
      <GlobalStyles />
      <header>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <button
          type="button"
          className="sidebar-btn"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
        <nav>
          <Link href="/">
            <a>2021 Master Registrations List</a>
          </Link>
          <Link href="/filmed-games?camp=kaukauna">
            <a>Kau. Film Schedule</a>
          </Link>
          <Link href="/filmed-games?camp=plymouth">
            <a>Ply. Film Schedule</a>
          </Link>
          <Link href="/add-game-to-film-schedule">
            <a>Add Game to Schdule</a>
          </Link>
          <Link href="/add-offline-registration">
            <a>Add Registration</a>
          </Link>
          <select onBlur={handleBlur}>
            <option value="default">Select a session</option>
            {sessionsData.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </nav>
      </header>
      {children}
    </LayoutStyles>
  );
}
