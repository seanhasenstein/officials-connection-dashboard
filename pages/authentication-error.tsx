import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';

type Props = {
  children: React.ReactNode;
};

function AuthErrorLayout({ children }: Props) {
  return (
    <BasicLayout>
      <AuthErrorStyles>
        <div className="logo">
          <h1>Officials Connection</h1>
          <h2>Wisconsin Basketball Yearbook Officials Camps</h2>
        </div>
        <div className="container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {children}
        </div>
      </AuthErrorStyles>
    </BasicLayout>
  );
}

export default function AuthenticationError() {
  const router = useRouter();
  const error =
    typeof router.query.error === 'string' && router.query.error.toLowerCase();

  if (error === 'configuration') {
    return (
      <AuthErrorLayout>
        <h3>Server Error</h3>
        <p>
          There was a problem with the server configuration. Check the server
          logs for more information.
        </p>
        <Link href="/login">
          <a className="login-link">Go to login</a>
        </Link>
      </AuthErrorLayout>
    );
  }

  if (error === 'accessdenied') {
    return (
      <AuthErrorLayout>
        <h3>Access Denied</h3>
        <p>You do not have permission to sign in.</p>
        <Link href="/login">
          <a className="login-link">Try logging in again</a>
        </Link>
      </AuthErrorLayout>
    );
  }

  if (error == 'verification') {
    return (
      <AuthErrorLayout>
        <h3>Unable to sign in</h3>
        <p>
          The sign in link is no longer valid. It may have been used already or
          it may have expired.
        </p>
        <Link href="/login">
          <a className="login-link">Go to login</a>
        </Link>
      </AuthErrorLayout>
    );
  } else {
    return (
      <AuthErrorLayout>
        <h3>Authentication Error</h3>
        <p>An error occurred while trying to authenticate.</p>
        <Link href="/login">
          <a className="login-link">Go to login</a>
        </Link>
      </AuthErrorLayout>
    );
  }
}

const AuthErrorStyles = styled.div`
  padding: 5rem 1.5rem;
  min-height: 100vh;
  background-color: #f9fafb;

  h1 {
    margin: 0 0 4px;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: -0.05em;
    color: #111827;
    line-height: 1;
  }

  h2 {
    margin: 0 0 0 3px;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    color: #be123c;
    line-height: 1;
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #6b7280;
    text-align: center;
    line-height: 1.25;
  }

  .container {
    margin: 2.5rem auto 0;
    padding: 2rem 4rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .icon {
    margin: 0 0 0.5rem;
    height: 1.75rem;
    width: 1.75rem;
    color: #9ca3af;
  }

  .login-link {
    margin: 1.5rem 0 0;
    padding: 0.5rem 2.5rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #31363f;
    color: #f3f4f5;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.011em;
    border: 1px solid #181a1e;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;

    &:hover {
      background-color: #282d34;
    }
    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      text-decoration: underline;
    }
  }
`;
