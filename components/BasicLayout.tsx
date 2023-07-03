import React from 'react';
import Head from 'next/head';
import GlobalStyles from '../styles/GlobalStyles';

type Props = {
  children: React.ReactNode;
};

export default function BasicLayout({ children }: Props) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>WBYOC Dashboard</title>
      </Head>
      {children}
    </>
  );
}
