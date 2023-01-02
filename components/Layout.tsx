import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import useDownloadToCsv from '../hooks/useDownloadCsv';
import useDownloadNameLabels from '../hooks/useDownloadNameLabels';
import Sidebar from './Sidebar';
import Logo from './Logo';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = '' }: Props) {
  const router = useRouter();
  const { handleDownloadToCsvClick, csvLinkRef } = useDownloadToCsv();
  const { handleDownloadNameLabelsClick, nameLabelLinkRef } =
    useDownloadNameLabels();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [router.query.sid]);

  return (
    <LayoutStyles>
      <GlobalStyles />
      <Head>
        <title>{title === '' ? '' : `${title} | `}WBYOC Dashboard</title>
      </Head>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="secondary-nav">
        <div className="container">
          <Link href="/registrations/add">Add an offline registration</Link>
          <button type="button" onClick={handleDownloadToCsvClick}>
            Download registrations to csv
          </button>
          <button type="button" onClick={handleDownloadNameLabelsClick}>
            Download name labels
          </button>
          <a ref={csvLinkRef} className="sr-only">
            Download registrations
          </a>
          <a ref={nameLabelLinkRef} className="sr-only">
            Download name labels
          </a>
          <Link href="/filmed-games/add">Add filmed game</Link>
          <button type="button" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
      <header>
        <div className="container">
          <Logo />
          <div className="primary-nav">
            <nav className="lg-nav">
              <Link href="/">All Registrations</Link>
              <Link href="/filmed-games">Filmed Games</Link>
              <Link href="/questionnaire-emails">Questionnaire Emails</Link>
            </nav>
            <nav className="sm-nav">
              <Link href="/">All Registrations</Link>
            </nav>
            <button
              type="button"
              className="sidebar-btn"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {children}
    </LayoutStyles>
  );
}

const LayoutStyles = styled.div`
  width: 100%;
  background-color: #fff;
  overflow-x: hidden;

  header {
    padding: 1.5rem 2.5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    position: relative;

    .container {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      max-width: 90rem;
      width: 100%;
    }
  }

  .primary-nav {
    display: flex;
    gap: 3.5rem;
  }

  .lg-nav {
    display: flex;
  }

  .sm-nav {
    display: none;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3.5rem;

    a {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;

      svg {
        height: 1.5rem;
        width: 1.5rem;
      }

      &:hover {
        color: #111827;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        text-decoration: underline;
        color: #111827;
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

  .secondary-nav {
    padding: 0.5rem 1rem;
    background-color: #151a23;

    .container {
      margin: 0 auto;
      display: flex;
      justify-content: flex-end;
      gap: 1.875rem;
      max-width: 90rem;
      width: 100%;
    }

    a,
    button {
      margin: 0;
      padding: 0;
      display: block;
      font-size: 0.8125rem;
      color: #e5e7eb;
      background-color: transparent;
      border: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        text-decoration: underline;
        color: #fff;
      }
    }
  }

  @media (max-width: 992px) {
    .lg-nav {
      display: none;
    }

    .sm-nav {
      display: flex;
    }
  }
`;
