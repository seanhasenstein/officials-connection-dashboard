import { Db, ObjectID } from 'mongodb';
import { Game } from '../interfaces';

export async function getGames(db: Db, filter: Record<string, unknown>) {
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
    throw new Error('An error occurred while getting the games.');
  }
}

export async function addGame(db: Db, game: Game) {
  try {
    const result = await db.collection('filmed-games').insertOne(game);
    return result.ops[0];
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred in addGameToFilmSchedule.');
  }
}

export async function updateGame(db: Db, id: string, update: Game) {
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
    throw new Error('An error occurred while updating the game.');
  }
}
