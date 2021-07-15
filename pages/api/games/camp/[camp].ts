import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../../middleware/db';
import { games } from '../../../../db';
import { Request } from '../../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const result = await games.getGames(req.db, { camp: req.query.camp });
      res.send({ games: result });
    } catch (error) {
      console.error(error);
      res.send({ error: error.message });
    }
  });

export default handler;
