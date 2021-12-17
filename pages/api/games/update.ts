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
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      const game = await games.updateGame(req.db, id, req.body);
      res.json({ game });
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  });

export default withAuth(handler);
