import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { games } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    await games.updateGameOfficials(
      req.db,
      req.body.gameId,
      req.body.officials
    );
    res.json({ success: true });
  });

export default withAuth(handler);
