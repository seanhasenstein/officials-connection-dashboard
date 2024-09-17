import React from 'react';
import { useQuery } from 'react-query';
import { Session, Year } from '../../types';

async function fetchYear() {
  const response = await fetch('/api/year');

  if (!response.ok) {
    throw new Error('Failed to fetch the year');
  }

  const data = await response.json();
  return data.year;
}

export default function useYearQuery() {
  // TODO: make year dynamic
  const yearQuery = useQuery<Year, Error>(['year', '2024'], fetchYear, {
    staleTime: 300000, // 5min
  });

  const kaukaunaCamp = yearQuery.data?.camps.find(
    c => c.name === 'Kaukauna Camp'
  );
  const plymouthCamp = yearQuery.data?.camps.find(
    c => c.name === 'Plymouth Camp'
  );
  const stevensPointCamp = yearQuery.data?.camps.find(
    c => c.name === 'UW-Stevens Point Camp'
  );

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
    registrations: yearQuery.data?.registrations,
    kaukaunaCamp,
    plymouthCamp,
    stevensPointCamp,
    sessions,
    getSession,
  };
}
