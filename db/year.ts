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

export async function updateYear(db: Db, updatedYearInput: Year) {
  const { _id, ...updatedYear } = updatedYearInput;
  const result = await db.collection<Year>('years').findOneAndUpdate(
    // TODO: make year dynamic
    { year: '2023' },
    { $set: updatedYear },
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
