import React from 'react';
import { createIdNumber } from '../utils/misc';

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
      // TODO: make the year dynamic
      `2024-wiaa-by-session-${createIdNumber()}.csv`
    );
    wiaaSessionRef.current?.click();
  };

  return { handleDownloadWiaaBySession, wiaaSessionRef };
}
