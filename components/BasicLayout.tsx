import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';

type Props = {
  children: React.ReactNode;
};

export default function BasicLayout({ children }: Props) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
}
