import styled from 'styled-components';
import BasicLayout from '../components/BasicLayout';
import Logo from '../components/Logo';

export default function VerifyLogin() {
  return (
    <BasicLayout>
      <VerifyLoginStyles>
        <Logo />
        <div className="container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
            />
          </svg>
          <h3>Check your email</h3>
          <p>A sign in link has been sent to your email address.</p>
        </div>
      </VerifyLoginStyles>
    </BasicLayout>
  );
}

const VerifyLoginStyles = styled.div`
  padding: 6rem 1.5rem;
  min-height: 100vh;
  background-color: #f9fafb;
  background-image: url('/hero-background.svg');
  background-size: 1280px auto;
  background-position: top -40px center;

  h3 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    text-align: center;
    line-height: 1.35;
  }

  .container {
    margin: 2.5rem auto 0;
    padding: 2rem 4rem 2.75rem;
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
    margin: 0 0 1rem;
    height: 1.5rem;
    width: 1.5rem;
    color: #9ca3af;
  }
`;
