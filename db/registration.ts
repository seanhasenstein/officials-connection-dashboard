import { Db } from 'mongodb';
import { RegistrationForDb, Year } from '../types';

export async function getRegistration(
  db: Db,
  year: string,
  registrationId: string
) {
  const fetchedYear = await db.collection<Year>('years').findOne({ year });
  const registration = fetchedYear?.registrations.find(
    r => r.id === registrationId
  );

  return registration || null;
}

export async function getAllRegistrationsForYear(db: Db, year: string) {
  const fetchedYear = await db.collection<Year>('years').findOne({ year });

  return fetchedYear?.registrations || null;
}

export async function getSessionRegistrations(
  db: Db,
  year: string,
  sessionId: string
) {
  const fetchedYear = await db.collection<Year>('years').findOne({ year });
  const sessionRegistrations = fetchedYear?.registrations.filter(r => {
    return r.sessions.some(s => {
      s.sessionId === sessionId && s.attending;
    });
  });

  return sessionRegistrations || null;
}

export async function addRegistration(
  db: Db,
  year: string,
  registrationInput: RegistrationForDb
) {
  const updatedYear = await db
    .collection<Year>('years')
    .findOneAndUpdate(
      { year },
      { $push: { registrations: registrationInput } }
    );

  const addedRegistration = updatedYear.value?.registrations.find(
    r => r.id === registrationInput.id
  );

  return addedRegistration;
}

export async function updateRegistration(
  db: Db,
  year: string,
  registrationUpdate: RegistrationForDb
) {
  const updatedYear = await db
    .collection<Year>('years')
    .findOneAndUpdate(
      { year, 'registrations.id': registrationUpdate.id },
      { $set: { 'registrations.$': registrationUpdate } },
      { returnDocument: 'after' }
    );

  const updatedRegistration = updatedYear.value?.registrations.find(
    r => r.id === registrationUpdate.id
  );

  return updatedRegistration || null;
}

export async function deleteRegistration(
  db: Db,
  year: string,
  registrationId: string
) {
  const updatedYear = await db
    .collection<Year>('years')
    .findOneAndUpdate(
      { year },
      { $pull: { registrations: { id: registrationId } } },
      { returnDocument: 'after' }
    );

  const deletedRegistration = updatedYear.value?.registrations.find(
    r => r.id === registrationId
  );

  return deletedRegistration || null;
}
