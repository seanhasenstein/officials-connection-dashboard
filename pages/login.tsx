import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';

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
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
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

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #111827;
  }

  .logo {
    margin: 0 0 2rem;
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
    transition: background-color 100ms linear;

    &:hover {
      background-color: #111827;
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

const LoginSpinner = styled(LoadingSpinner)`
  .spinner {
    border: 2px solid #334155;
    border-top-color: #64748b;
  }
`;
