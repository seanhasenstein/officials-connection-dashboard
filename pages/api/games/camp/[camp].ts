import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../../utils/withAuth';
import database from '../../../../middleware/db';
import { game } from '../../../../db';
import { Request } from '../../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const result = await game.getGames(req.db, { camp: req.query.camp });
    res.send({ games: result });
  });

export default withAuth(handler);
