import Link from 'next/link';
import styled from 'styled-components';

export default function Logo() {
  return (
    <LogoStyles>
      <Link href="/">
        <a className="logo">
          <h1>Officials Connection</h1>
          <h2>Wisconsin Basketball Yearbook Officials Camps</h2>
        </a>
      </Link>
    </LogoStyles>
  );
}

const LogoStyles = styled.div`
  display: flex;
  justify-content: center;

  .logo {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;

    h1 {
      margin: 0;
      font-family: 'Teko', sans-serif;
      font-size: 2.375rem;
      font-weight: 400;
      letter-spacing: 0em;
      color: #000;
      line-height: 0.8125;
    }

    h2 {
      margin: 0 0 0 0.0625rem;
      font-family: 'Teko';
      font-size: 1rem;
      font-weight: 400;
      text-align: center;
      letter-spacing: 0;
      color: #ac1036;
      line-height: 1;
    }
  }
`;
