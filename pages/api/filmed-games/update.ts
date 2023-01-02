import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Request } from '../../../types';
import { year } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const result = await year.updateFilmedGames(req.db, req.body);
    res.json({ year: result });
  });

export default withAuth(handler);
