import React from 'react';
import Head from 'next/head';
import GlobalStyles from '../styles/GlobalStyles';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function BasicLayout({
  children,
  title = 'WBYOC Dashboard',
}: Props) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
}
