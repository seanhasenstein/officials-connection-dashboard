import React from 'react';

import { createIdNumber } from '../utils/misc';

import { currentYearString } from 'constants/currentYear';

export default function useDownloadWiaaBySession() {
  const wiaaSessionRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadWiaaBySession = async () => {
    const response = await fetch('api/download-wiaa-by-session');
    if (!response.ok) {
      throw new Error('Failed to fetch the name labels csv file.');
    }

    const data = await response.json();

    wiaaSessionRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${data.csv}`
    );
    wiaaSessionRef.current?.setAttribute(
      'download',
      `${currentYearString}-wiaa-by-session-${createIdNumber()}.csv`
    );
    wiaaSessionRef.current?.click();
  };

  return { handleDownloadWiaaBySession, wiaaSessionRef };
}
