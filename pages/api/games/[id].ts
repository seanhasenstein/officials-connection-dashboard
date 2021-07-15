import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { ObjectID } from 'mongodb';
import database from '../../../middleware/db';
import { games } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      if (!req.query.id) {
        throw new Error('You must specify a game ID.');
      }
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      const result = await games.getGames(req.db, {
        _id: new ObjectID(id),
      });
      res.send({ game: result[0] });
    } catch (error) {
      console.error(error);
      res.send({ error: error.message });
    }
  });

export default handler;
