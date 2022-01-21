import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSession, signIn } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (session) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return { props: {} };
};

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.elements.email.value;
    signIn('email', { email, callbackUrl: '/' });
  };

  return (
    <BasicLayout>
      <LoginStyles>
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3>Sign in to your account</h3>
          <form method="post" onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? (
                <LoginSpinner isLoading={isLoading} />
              ) : (
                'Email a login link'
              )}
            </button>
          </form>
        </div>
      </LoginStyles>
    </BasicLayout>
  );
}

const LoginStyles = styled.div`
  padding: 6rem 1.5rem;
  min-height: 100vh;
  background-color: #f9fafb;
  background-image: url('/hero-background.svg');
  background-size: 1280px auto;
  background-position: top -40px center;

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
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #4b5563;
  }

  .logo {
    margin: 0 0 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    width: 100%;
  }

  .container {
    margin: 0 auto;
    padding: 3rem;
    width: 30rem;
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
    margin: 0 0 1rem;
    height: 1.75rem;
    width: 1.75rem;
    color: #9ca3af;
  }

  .item {
    margin: 2.75rem 0 0.875rem;
    display: flex;
    flex-direction: column;
  }

  .login-button {
    height: 2.625rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    background-color: #1f2937;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

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

const LoginSpinner = styled(LoadingSpinner)`
  .spinner {
    border: 2px solid #334155;
    border-top-color: #64748b;
  }
`;
