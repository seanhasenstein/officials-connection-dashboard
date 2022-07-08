import { useQuery, UseQueryOptions } from 'react-query';
import { useRouter } from 'next/router';

async function fetchSession() {
  const response = await fetch('/api/auth/session');
  const session = await response.json();

  if (Object.keys(session).length) {
    return session;
  }

  return null;
}

type Props = {
  required?: boolean;
  redirectTo?: string;
  queryConfig?: UseQueryOptions<unknown, unknown, unknown, 'session'>;
};

export default function useAuthSession({
  required = true,
  redirectTo = '/login',
  queryConfig = {},
}: Props = {}) {
  const router = useRouter();
  const query = useQuery('session', fetchSession, {
    ...queryConfig,
    onSettled: (data, error) => {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error);
      if (data || !required) return;
      router.push(redirectTo);
    },
  });

  return [query.data, query.status === 'loading'];
}
