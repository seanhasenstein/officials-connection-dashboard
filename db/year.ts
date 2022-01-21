import { Db } from 'mongodb';
import { Session, Year } from '../interfaces';

export async function getYear(db: Db, year: string) {
  const result: Year | null = await db
    .collection<Year>('camps')
    .findOne({ year });

  if (!result) {
    throw new Error('Failed to fetch the year.');
  }

  return result;
}

export async function getSessions(db: Db, year: string) {
  const result: Year | null = await db
    .collection<Year>('camps')
    .findOne({ year });

  if (!result) {
    throw new Error('Failed to fetch the year.');
  }

  const sessions = result.camps.reduce(
    (sessions: Session[], currentCamp) => [
      ...sessions,
      ...currentCamp.sessions,
    ],
    []
  );
  return sessions;
}
