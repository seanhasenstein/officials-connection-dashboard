import React from 'react';

import { createIdNumber } from '../utils/misc';

import { currentYearString } from 'constants/currentYear';

export default function useDownloadWiaaBySession() {
  const wiaaSessionThreeTimesRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadWiaaBySessionThreeTimes = async () => {
    const response = await fetch('api/download-wiaa-by-session-three-times');
    if (!response.ok) {
      throw new Error(
        'Failed to fetch the WIAA form by session three times csv file.'
      );
    }

    const data = await response.json();

    wiaaSessionThreeTimesRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${encodeURIComponent(data.csv)}`
    );
    wiaaSessionThreeTimesRef.current?.setAttribute(
      'download',
      `${currentYearString}-wiaa-by-session-three-times-${createIdNumber()}.csv`
    );
    wiaaSessionThreeTimesRef.current?.click();
  };

  return { handleDownloadWiaaBySessionThreeTimes, wiaaSessionThreeTimesRef };
}
