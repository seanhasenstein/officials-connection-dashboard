import React from 'react';
import { format } from 'date-fns';

export default function useDownloadToCsv() {
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadClick = async () => {
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

  return {
    handleDownloadClick,
    linkRef,
  };
}
