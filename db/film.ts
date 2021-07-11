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

export async function getFilmedGame(db: Db, filter: Record<string, unknown>) {
  try {
    const checkedFilter =
      filter._id && typeof filter._id === 'string'
        ? { _id: new ObjectID(filter._id) }
        : filter;
    const result = await db.collection('filmed-games').findOne(checkedFilter);
    if (!result) {
      throw new Error('No game found.');
    }

    return {
      ...result,
      _id: result._id.toString(),
    };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred getting the game.');
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

export async function updateFilmedGame(db: Db, id: string, update: FilmedGame) {
  try {
    const result = await db
      .collection('filmed-games')
      .findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: update },
        { returnDocument: 'after' }
      );

    if (!result) {
      throw new Error('Invalid Game ID.');
    }

    return result.value;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred updating the game.');
  }
}
