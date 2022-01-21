import { Db, ObjectId } from 'mongodb';
import { formatISO } from 'date-fns';
import { Game, GameInput, GameOfficial } from '../interfaces';
import { formatGameDate } from '../utils/misc';

export async function getGame(db: Db, id: string) {
  const result = await db
    .collection('games')
    .findOne({ _id: new ObjectId(id) });

  return result;
}

export async function getGames(db: Db, filter: Record<string, unknown>) {
  const result = await db
    .collection<Game>('games')
    .aggregate([
      {
        $match: { ...filter },
      },
    ])
    .toArray();

  return await result;
}

export async function addGame(db: Db, input: GameInput) {
  const { time, ...gameInput } = input;
  const date = formatGameDate(input.date, input.time);
  const filmed = input.filmed === 'true' ? true : false;
  const url = filmed ? input.url : '';
  const now = formatISO(new Date());

  const game = {
    ...gameInput,
    date,
    url,
    filmed,
    officials: [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('games').insertOne(game);

  return { ...game, _id: result.insertedId };
}

export async function updateGame(db: Db, id: string, game: GameInput) {
  const date = formatGameDate(game.date, game.time);
  const filmed = game.filmed === 'true' ? true : false;
  const url = filmed ? game.url : '';
  const updatedAt = formatISO(new Date());

  const result = await db.collection('games').findOneAndUpdate(
    { _id: new ObjectId(id) },
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
    .collection('games')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { officials } },
      { returnDocument: 'after' }
    );

  return result.value;
}

export async function deleteGame(db: Db, id: string) {
  const result = await db
    .collection('games')
    .deleteOne({ _id: new ObjectId(id) });

  return result;
}
