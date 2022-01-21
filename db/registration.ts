import { Db, ObjectId } from 'mongodb';
import {
  Registration,
  RegistrationDbFormat,
  RegistrationUpdate,
} from '../interfaces';

export const getRegistration = async (db: Db, id: string) => {
  const result = await db
    .collection('registrations')
    .findOne({ _id: new ObjectId(id) });

  return result;
};

export const getRegistrations = async (
  db: Db,
  filter: Record<string, unknown> = {}
) => {
  const result: Registration[] = await db
    .collection('registrations')
    .aggregate<Registration>([
      {
        $match: { ...filter },
      },
    ])
    .toArray();
  const data = await result;

  return data;
};

export async function addRegistration(
  db: Db,
  registration: RegistrationDbFormat
) {
  const result = await db.collection('registrations').insertOne(registration);
  return result.insertedId;
}

export async function updateRegistration(
  db: Db,
  id: string,
  update: RegistrationUpdate
) {
  const result = await db
    .collection('registrations')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );

  return result.value;
}

export async function deleteRegistration(db: Db, id: string) {
  const result = await db
    .collection('registrations')
    .deleteOne({ _id: new ObjectId(id) });

  return result;
}
