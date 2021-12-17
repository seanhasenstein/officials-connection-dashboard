import { Db, ObjectID } from 'mongodb';
import { formatISO } from 'date-fns';
import { GameInput, GameOfficial } from '../interfaces';
import { formatGameDate } from '../utils';

export async function getGame(db: Db, id: string) {
  const result = await db
    .collection('filmed-games')
    .findOne({ _id: new ObjectID(id) });

  return result;
}

export async function getGames(db: Db, filter: Record<string, unknown>) {
  const result = await db
    .collection('filmed-games')
    .aggregate([
      {
        $match: { ...filter },
      },
    ])
    .toArray();

  return await result;
}

export async function addGame(db: Db, gameInput: GameInput) {
  const { time, ...game } = gameInput;
  const date = formatGameDate(gameInput.date, gameInput.time);
  const filmed = gameInput.filmed === 'true' ? true : false;
  const url = filmed ? gameInput.url : '';
  const now = formatISO(new Date());

  const result = await db.collection('filmed-games').insertOne({
    ...game,
    date,
    url,
    filmed,
    createdAt: now,
    updatedAt: now,
  });

  return result.ops[0];
}

export async function updateGame(db: Db, id: string, game: GameInput) {
  const date = formatGameDate(game.date, game.time);
  const filmed = game.filmed === 'true' ? true : false;
  const url = filmed ? game.url : '';
  const updatedAt = formatISO(new Date());

  const result = await db.collection('filmed-games').findOneAndUpdate(
    { _id: new ObjectID(id) },
    {
      $set: {
        ...game,
        date,
        url,
        filmed,
        updatedAt,
      },
    },
    { returnDocument: 'after' }
  );

  return result.value;
}

export async function updateGameOfficials(
  db: Db,
  id: string,
  officials: GameOfficial[]
) {
  const result = await db
    .collection('filmed-games')
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { officials } },
      { returnDocument: 'after' }
    );

  return result.value;
}

export async function deleteGame(db: Db, id: string) {
  const result = await db
    .collection('filmed-games')
    .deleteOne({ _id: new ObjectID(id) });

  return result;
}
