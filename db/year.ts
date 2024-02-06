import { Db } from 'mongodb';
import { Clinician, FilmedGame, Session, Year } from '../types';

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
    { year: '2024' },
    { $set: { filmedGames: updatedFilmedGames } }
  );
  return result.value;
}

export const addClinician = async (
  db: Db,
  campName: 'Kaukauna Camp' | 'Plymouth Camp',
  clinician: Clinician
) => {
  const result = await db.collection<Year>('years').findOneAndUpdate(
    // TODO: make year dynamic
    { year: '2024' },
    { $push: { [`camps.$[camp].clinicians`]: clinician } },
    { arrayFilters: [{ 'camp.name': campName }] }
  );
  return result.value;
};

export const updateClinician = async (
  db: Db,
  campName: 'Kaukauna Camp' | 'Plymouth Camp',
  clinician: Clinician
) => {
  const result = await db.collection<Year>('years').findOneAndUpdate(
    // TODO: make year dynamic
    { year: '2024' },
    { $set: { [`camps.$[camp].clinicians.$[clinician]`]: clinician } },
    {
      arrayFilters: [
        { 'camp.name': campName },
        { 'clinician.id': clinician.id },
      ],
    }
  );
  return result.value;
};

export const removeClinician = async (
  db: Db,
  campName: 'Kaukauna Camp' | 'Plymouth Camp',
  clinicianId: string
) => {
  const result = await db.collection<Year>('years').findOneAndUpdate(
    // TODO: make year dynamic
    { year: '2024' },
    { $pull: { [`camps.$[camp].clinicians`]: { id: clinicianId } } },
    { arrayFilters: [{ 'camp.name': campName }] }
  );
  return result.value;
};
