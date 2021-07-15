import { Db, ObjectID } from 'mongodb';
import { Registration, Game } from '../interfaces';

export const getRegistration = async (db: Db, id: string) => {
  try {
    const result = await db
      .collection('registrations')
      .findOne({ _id: new ObjectID(id) });

    if (!result) {
      throw new Error('A registration with that id does not exist.');
    }

    return {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toString(),
      updatedAt: result.updatedAt.toString(),
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getRegistrations = async (
  db: Db,
  filter: Record<string, unknown> = {}
) => {
  try {
    const result = await db
      .collection('registrations')
      .aggregate([
        {
          $match: { ...filter },
        },
        {
          $set: {
            _id: {
              $toString: '$_id',
            },
            createdAt: {
              $toString: '$createdAt',
            },
            updatedAt: {
              $toString: '$updatedAt',
            },
          },
        },
      ])
      .toArray();
    return await result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export async function addRegistration(db: Db, registration: Registration) {
  try {
    const result = await db.collection('registrations').insertOne(registration);
    return result.ops[0];
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function updateRegistration(
  db: Db,
  id: string,
  registration: Registration
) {
  try {
    const update = { ...registration, updatedAt: new Date() };
    const result = await db
      .collection('registrations')
      .findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: update },
        { returnDocument: 'after' }
      );
    return result.value;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function updateFilmedGames(
  db: Db,
  registrationId: string,
  sessionId: number,
  update: Game[]
) {
  try {
    const result = await db
      .collection('registrations')
      .findOneAndUpdate(
        { _id: new ObjectID(registrationId), 'sessions.id': sessionId },
        { $set: { [`sessions.$.filmedGames`]: update, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    return result.value;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred updating filmed games.');
  }
}
