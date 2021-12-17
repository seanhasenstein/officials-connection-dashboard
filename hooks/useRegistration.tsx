import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  FilterOptions,
  Registration,
  RegistrationInput,
  Session,
  SessionsQuery,
  SortOrder,
  SortVariable,
} from '../interfaces';
import { sessionsData } from '../data';
import { getUrlParam, sessionReducer } from '../utils';
import { gameKeys, registrationKeys } from './queries';

async function fetchRegistration(id: string | undefined) {
  if (!id) return;

  const response = await fetch(`/api/registrations/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the registration.');
  }

  const data = await response.json();
  return data.registration;
}

async function fetchRegistrations() {
  const response = await fetch('/api/registrations');

  if (!response.ok) {
    throw new Error('Failed to fetch the registrations.');
  }

  const data = await response.json();
  return data.registrations;
}

async function fetchSessions(sessionId: string | undefined) {
  if (!sessionId) {
    return;
  }

  const response = await fetch(`/api/registrations/session?id=${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the session registrations.');
  }

  const data = await response.json();
  return data.registrations;
}

export default function useRegistration() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rid, setRid] = React.useState<string>();
  const [session, setSession] = React.useState<Session>();
  const [sessions, setSessions] = React.useState(sessionsData);
  const [showHSFields, setShowHSFields] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('ascending');
  const [sortVariable, setSortVariable] =
    React.useState<SortVariable>('lastName');
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    paymentStatus: [],
    sessions: [],
  });

  React.useEffect(() => {
    if (router.query.rid) {
      setRid(getUrlParam(router.query.rid));
    }
    if (router.query.sid) {
      setSession(() => sessionsData.find(s => s.id === router.query.sid));
    }
  }, [router.query.rid, router.query.sid]);

  const handleSessionUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sessionsUpdate = sessions.map(s =>
      s.id === e.target.value
        ? { ...s, isChecked: !s.isChecked, attending: !s.isChecked }
        : s
    );
    setSessions(sessionsUpdate);
    const hsCheckUpdate = sessionsUpdate.some(
      s => s.isChecked && s.category === 'High School'
    );
    setShowHSFields(hsCheckUpdate);
  };

  const handleAttendingToggle = (id: string) => {
    const update = sessions.map(s => {
      if (s.id === id) {
        return { ...s, attending: !s.attending };
      }
      return s;
    });
    setSessions(update);
  };

  const registrationQuery = useQuery<Registration, Error>(
    registrationKeys.registration(rid),
    () => fetchRegistration(rid),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const state = queryClient.getQueryData<Registration[]>(
          registrationKeys.all
        );

        if (state) {
          return state.find(r => r._id === rid);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(registrationKeys.all)?.dataUpdatedAt;
      },
    }
  );

  const registrationsQuery = useQuery<Registration[], Error>(
    registrationKeys.all,
    fetchRegistrations,
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  const sessionQuery = useQuery<SessionsQuery, Error>(
    registrationKeys.session(session?.id),
    () => fetchSessions(session?.id),
    {
      staleTime: 1000 * 60 * 10,
      initialData: () => {
        const state = queryClient.getQueryData<Registration[]>(
          registrationKeys.all
        );

        if (state) {
          return sessionReducer(state, session?.id);
        }
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(registrationKeys.all)?.dataUpdatedAt;
      },
    }
  );

  const addRegistration = useMutation(
    async (registration: RegistrationInput) => {
      const selectedSessions = sessions.filter(s => s.isChecked);
      const body = { ...registration, sessions: selectedSessions };
      const response = await fetch(`/api/registrations/add`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the registration.');
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  const deleteRegistration = useMutation(
    async (id: string) => {
      const response = await fetch('/api/registrations/delete', {
        method: 'post',
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the registration.');
      }

      const data = await response.json();
      return data.success;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(registrationKeys.all);
        queryClient.invalidateQueries(gameKeys.all);
      },
    }
  );

  return {
    registrationQuery,
    registrationsQuery,
    sessionQuery,
    addRegistration,
    deleteRegistration,
    handleSessionUpdate,
    handleAttendingToggle,
    session,
    sessions,
    showHSFields,
    sortOrder,
    setSortOrder,
    sortVariable,
    setSortVariable,
    filterOptions,
    setFilterOptions,
  };
}
