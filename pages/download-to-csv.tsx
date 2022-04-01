import { format } from 'date-fns';
import React from 'react';
import Layout from '../components/Layout';

export default function DownloadToCsv() {
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const handleClick = async () => {
    const response = await fetch('/api/registrations-to-csv');
    if (!response.ok) {
      throw new Error('Failed to fetch the csv file.');
    }

    const data = await response.json();

    linkRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${data.csv}`
    );
    linkRef.current?.setAttribute(
      'download',
      `2022-wbyoc-registrations-${format(new Date(), 'MMddyyHHmmss')}.csv`
    );
    linkRef.current?.click();
  };

  return (
    <Layout>
      <button type="button" onClick={handleClick}>
        Download to CSV
      </button>
      <a ref={linkRef} className="sr-only">
        Download registrations
      </a>
    </Layout>
  );
}
