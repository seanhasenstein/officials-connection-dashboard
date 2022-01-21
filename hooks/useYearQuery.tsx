import React from 'react';
import { useQuery } from 'react-query';
import { Session, Year } from '../interfaces';

async function fetchYear() {
  const response = await fetch('/api/year');

  if (!response.ok) {
    throw new Error('Failed to fetch the year');
  }

  const data = await response.json();
  return data.year;
}

export function useYearQuery() {
  const yearQuery = useQuery<Year, Error>(['year', '2022'], fetchYear, {
    staleTime: Infinity,
  });

  const kaukaunaCamp = yearQuery.data?.camps.find(c => c.name === 'Kaukauna');
  const plymouthCamp = yearQuery.data?.camps.find(c => c.name === 'Plymouth');

  const sessions = React.useMemo(
    () =>
      yearQuery.data?.camps.reduce(
        (sessions: Session[], currentCamp) => [
          ...sessions,
          ...currentCamp.sessions,
        ],
        []
      ),
    [yearQuery.data?.camps]
  );

  const getSession = (sessionId: string) => {
    return sessions?.find(s => s.sessionId === sessionId);
  };

  return {
    isLoading: yearQuery.isLoading,
    isError: yearQuery.isError,
    isSuccess: yearQuery.isSuccess,
    error: yearQuery.error,
    year: yearQuery.data,
    kaukaunaCamp,
    plymouthCamp,
    sessions,
    getSession,
  };
}
