import React from 'react';
import { createIdNumber } from '../utils/misc';

export default function useDownloadNameLabels() {
  const nameLabelLinkRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadNameLabelsClick = async () => {
    const response = await fetch('api/print-name-labels');
    if (!response.ok) {
      throw new Error('Failed to fetch the name labels csv file.');
    }

    const data = await response.json();

    nameLabelLinkRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${data.csv}`
    );
    nameLabelLinkRef.current?.setAttribute(
      'download',
      // TODO: make the year dynamic
      `2023-wbyoc-name-labels-${createIdNumber()}.csv`
    );
    nameLabelLinkRef.current?.click();
  };

  return { handleDownloadNameLabelsClick, nameLabelLinkRef };
}
