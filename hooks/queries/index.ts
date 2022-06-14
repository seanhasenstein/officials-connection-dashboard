export const registrationKeys = {
  all: ['registrations'] as const,
  sessions: () => [...registrationKeys.all, 'session'] as const,
  session: (session: string | undefined) =>
    [...registrationKeys.sessions(), session] as const,
  registrations: () => [...registrationKeys.all, 'registration'] as const,
  registration: (id: string | undefined) =>
    [...registrationKeys.registrations(), id] as const,
};

export const gameKeys = {
  all: ['games'] as const,
  camps: () => [...gameKeys.all, 'camp'] as const,
  camp: (camp: string | undefined) => [...gameKeys.camps(), camp] as const,
  games: () => [...gameKeys.all, 'game'] as const,
  game: (id: string | undefined) => [...gameKeys.games(), id] as const,
};
