import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { games } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const data = await games.addGame(req.db, req.body);
      res.json({ game: data });
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  });

export default withAuth(handler);
