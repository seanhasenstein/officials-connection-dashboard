import { Db, ObjectID } from 'mongodb';
import { Registration, RegistrationUpdate } from '../interfaces';

export const getRegistration = async (db: Db, id: string) => {
  const result = await db
    .collection('registrations')
    .findOne({ _id: new ObjectID(id) });

  return result;
};

export const getRegistrations = async (
  db: Db,
  filter: Record<string, unknown> = {}
) => {
  const result = await db
    .collection('registrations')
    .aggregate([
      {
        $match: { ...filter },
      },
    ])
    .toArray();

  return await result;
};

export async function addRegistration(db: Db, registration: Registration) {
  const result = await db.collection('registrations').insertOne(registration);
  return result.ops[0];
}

export async function updateRegistration(
  db: Db,
  id: string,
  update: RegistrationUpdate
) {
  const result = await db
    .collection('registrations')
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: update },
      { returnDocument: 'after' }
    );

  return result.value;
}

export async function deleteRegistration(db: Db, id: string) {
  const result = await db
    .collection('registrations')
    .deleteOne({ _id: new ObjectID(id) });

  return result;
}
