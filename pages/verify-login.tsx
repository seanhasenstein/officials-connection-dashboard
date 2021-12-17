import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';

export default function VerifyLogin() {
  return (
    <BasicLayout>
      <VerifyLoginStyles>
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
              d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
            />
          </svg>
          <h3>Check your email...</h3>
          <p>A sign in link has been sent to your email address.</p>
        </div>
      </VerifyLoginStyles>
    </BasicLayout>
  );
}

const VerifyLoginStyles = styled.div`
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
    max-width: 26rem;
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
`;
