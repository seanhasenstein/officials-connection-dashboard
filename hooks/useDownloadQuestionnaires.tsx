import React from 'react';
import { format } from 'date-fns';
import { currentYearString } from 'constants/currentYear';

export default function useDownloadQuestionnaires() {
  const questionnaireRef = React.useRef<HTMLAnchorElement>(null);

  const handleDownloadQuestionnairesClick = async (
    camp: 'kaukauna' | 'plymouth' | 'uw-stevens point'
  ) => {
    const response = await fetch(`/api/questionnaires-to-csv?c=${camp}`);

    if (!response.ok) {
      throw new Error('Failed to fetch the csv file.');
    }

    const data = await response.json();

    questionnaireRef.current?.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${encodeURIComponent(data.csv)}`
    );

    questionnaireRef.current?.setAttribute(
      'download',
      `${currentYearString}-wbyoc-${camp}-questionnaires-${format(
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
