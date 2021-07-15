import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { games } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const game = await games.updateGame(req.db, req.query.id, req.body);

      res.json({ game });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
