import {
  FilmedGame,
  HydratedSession,
  Registration,
  Session,
} from '../interfaces';

export const initialValues = {
  id: '',
  camp: '',
  sessions: [],
  name: '',
  url: '',
  officials: [] as { _id: string; name: string }[],
  clinicians: '',
};

type SortedFGAccumulator = Record<string, FilmedGame[]>;

export function hydrateSessions(
  registrations: Registration[],
  sessions: Session[],
  filmedGames: FilmedGame[]
) {
  const filmedGamesSortedBySession = filmedGames.reduce(
    (accumulator: SortedFGAccumulator, currentFilmedGame) => {
      currentFilmedGame.sessions.forEach(s => {
        accumulator[s] = [...(accumulator[s] || []), currentFilmedGame];
      });
      return accumulator;
    },
    {}
  );

  const hydratedSession: HydratedSession[] = sessions.map(session => {
    if (filmedGamesSortedBySession[session.sessionId]) {
      const isReadyToSendEmail = filmedGamesSortedBySession[
        session.sessionId
      ].every(fgsbs => {
        const hasRequiredFields =
          fgsbs.camp &&
          fgsbs.name &&
          fgsbs.url &&
          fgsbs.officials.length >= session.mechanics
            ? true
            : false;
        const allOfficialsAreValid = fgsbs.officials.every(official => {
          const registration = registrations.find(r => r._id === official._id);
          return (
            official.name &&
            registration?.email &&
            fgsbs.sessions.some(fgSessionId =>
              registration.sessions.some(
                regSession =>
                  regSession.attending && regSession.sessionId === fgSessionId
              )
            )
          );
        });
        return hasRequiredFields && allOfficialsAreValid;
      });

      return { ...session, isReadyToSendEmail };
    }

    return { ...session, isReadyToSendEmail: false };
  });

  return hydratedSession;
}
