import React from 'react';
import { format } from 'date-fns';

export default function useDownloadQuestionnaires() {
  const questionnaireRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadQuestionnairesClick = async (
    camp: 'kaukauna' | 'plymouth'
  ) => {
    const response = await fetch(`/api/questionnaires-to-csv?c=${camp}`);

    if (!response.ok) {
      throw new Error('Failed to fetch the csv file.');
    }

    const data = await response.json();

    questionnaireRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${data.csv}`
    );

    questionnaireRef.current?.setAttribute(
      'download',
      // TODO: make the year dynamic
      `2023-wbyoc-${camp}-questionnaires-${format(
        new Date(),
        'MMddyyHHmmss'
      )}.csv`
    );

    questionnaireRef.current?.click();
  };

  return {
    handleDownloadQuestionnairesClick,
    questionnaireRef,
  };
}
