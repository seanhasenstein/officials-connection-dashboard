import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';
import Logo from '../components/Logo';

type Props = {
  children: React.ReactNode;
};

function AuthErrorLayout({ children }: Props) {
  return (
    <BasicLayout>
      <AuthErrorStyles>
        <Logo />
        <div className="container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
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
  padding: 6rem 1.5rem;
  min-height: 100vh;
  background-color: #f9fafb;
  background-image: url('/hero-background.svg');
  background-size: 1280px auto;
  background-position: top -40px center;

  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
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
    height: 1.5rem;
    width: 1.5rem;
    color: #c71c45;
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
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }
`;
