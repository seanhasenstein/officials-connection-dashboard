import { Db, ObjectID } from 'mongodb';
import { FilmedGame } from '../interfaces';

export async function setCampersFilmedGames(
  db: Db,
  registrationId: string,
  sessionId: number,
  update: FilmedGame[]
) {
  try {
    const result = await db
      .collection('registrations')
      .findOneAndUpdate(
        { _id: new ObjectID(registrationId), 'sessions.id': sessionId },
        { $set: { [`sessions.$.filmedGames`]: update } },
        { returnDocument: 'after' }
      );
    return result.value;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred in updateFilmedGames.');
  }
}

export async function addGameToFilmSchedule(db: Db, filmedGame: FilmedGame) {
  try {
    const result = await db.collection('filmed-games').insertOne(filmedGame);
    return result.ops[0];
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred in addGameToFilmSchedule.');
  }
}

export async function getFilmedGames(db: Db, filter: Record<string, unknown>) {
  try {
    const result = await db
      .collection('filmed-games')
      .aggregate([
        {
          $match: { ...filter },
        },
        {
          $set: {
            _id: {
              $toString: '$_id',
            },
          },
        },
      ])
      .toArray();

    return await result;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred in getFilmedGames.');
  }
}
