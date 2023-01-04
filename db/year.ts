import { Db } from 'mongodb';
import { FilmedGame, Session, Year } from '../types';

export async function getYear(db: Db, year: string) {
  const result = await db.collection<Year>('years').findOne({ year });

  return result;
}

export async function getSessions(db: Db, year: string) {
  const result = await db.collection<Year>('years').findOne({ year });

  const sessions = result?.camps.reduce(
    (sessions: Session[], currentCamp) => [
      ...sessions,
      ...currentCamp.sessions,
    ],
    []
  );
  return sessions;
}

// TODO: Fix the any type for update
export async function updateYear(db: Db, year: string, update: any) {
  const { _id, ...updateInput } = update;
  const result = await db.collection<Year>('years').findOneAndUpdate(
    { year },
    { $set: updateInput },
    {
      returnDocument: 'after',
    }
  );
  return result.value;
}

export async function updateFilmedGames(
  db: Db,
  updatedFilmedGames: FilmedGame[]
) {
  const result = await db.collection<Year>('years').findOneAndUpdate(
    // TODO: make year dynamic
    { year: '2023' },
    { $set: { filmedGames: updatedFilmedGames } }
  );
  return result.value;
}
