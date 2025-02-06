import React from 'react';
import { format } from 'date-fns';

import { currentYearString } from 'constants/currentYear';

export default function useDownloadToCsv() {
  const csvLinkRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadToCsvClick = async () => {
    const response = await fetch('/api/registrations-to-csv');
    if (!response.ok) {
      throw new Error('Failed to fetch the csv file.');
    }

    const data = await response.json();

    csvLinkRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${data.csv}`
    );
    csvLinkRef.current?.setAttribute(
      'download',
      `${currentYearString}-wbyoc-registrations-${format(
        new Date(),
        'MMddyyHHmmss'
      )}.csv`
    );
    csvLinkRef.current?.click();
  };

  return {
    handleDownloadToCsvClick,
    csvLinkRef,
  };
}
