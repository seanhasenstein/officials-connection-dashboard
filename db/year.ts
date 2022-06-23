import { Db } from 'mongodb';
import { FilmedGame, Session, Year } from '../interfaces';

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

export async function updateFilmedGames(
  db: Db,
  updatedFilmedGames: FilmedGame[]
) {
  const result = await db
    .collection<Year>('camps')
    .findOneAndUpdate(
      { year: '2022' },
      { $set: { filmedGames: updatedFilmedGames } }
    );
  return result.value;
}
