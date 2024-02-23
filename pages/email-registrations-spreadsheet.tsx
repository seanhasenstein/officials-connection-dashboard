import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import BasicLayout from '../components/BasicLayout';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EmailRegistrationsSpreadsheet() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'error' | 'success'>(
    'idle'
  );
  const [timestamp, setTimeStamp] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch('/api/email-registrations-spreadsheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: e.target.elements.email.value }),
    });
    if (!res.ok) {
      console.error('Failed to send email');
      setStatus('error');
      return;
    }

    const data: { timestamp?: string; error: string; code: number } =
      await res.json();

    if (data.code === 500) {
      setErrorMessage('A server error occurred. Please try again.');
      setStatus('error');
    }

    if (data.code === 400) {
      setErrorMessage('Missing required email.');
      setStatus('error');
    }

    if (data.code === 401) {
      setErrorMessage("You're not authorized to do this.");
      setStatus('error');
    }

    if (data.code === 200 && data.timestamp) {
      setTimeStamp(data.timestamp);
      setErrorMessage(undefined);
      setStatus('success');
    }

    setIsLoading(false);
  };

  return (
    <BasicLayout>
      <EmailRegistrationsSpreadsheetStyles>
        <Logo />
        <div className="container">
          {status === 'success' ? (
            <div className="success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              <h3>Check your email...</h3>
              <p>
                I've sent you the current WBYOC registration spreadsheet as of{' '}
                {timestamp ? timestamp : format(new Date(), "PP 'at' p")}.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="reset-button"
              >
                Request another spreadsheet
              </button>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>

              <h3>Get the latest registrations spreadsheet</h3>
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? (
                    <LoginSpinner isLoading={isLoading} />
                  ) : (
                    'Email the spreadsheet'
                  )}
                </button>
                {status === 'error' && <p className="error">{errorMessage}</p>}
              </form>
            </>
          )}
        </div>
      </EmailRegistrationsSpreadsheetStyles>
    </BasicLayout>
  );
}

const EmailRegistrationsSpreadsheetStyles = styled.div`
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
    padding: 2rem;
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

  .submit-button,
  .reset-button {
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

  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .icon {
      flex-shrink: 0;
      height: 2.5rem;
      width: 2.5rem;
      color: #047857;
    }
    p {
      color: #4b5563;
      line-height: 150%;
    }
    .reset-button {
      margin-top: 0.5rem;
    }
  }
  p.error {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #9f1239;
  }

  @media (min-width: 500px) {
    .container {
      padding: 3rem;
    }
  }
`;

const LoginSpinner = styled(LoadingSpinner)`
  .spinner {
    border: 2px solid #334155;
    border-top-color: #64748b;
  }
`;
