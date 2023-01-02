import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Request } from '../../../types';
import { year } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const data = await year.getYear(req.db, '2022');
    res.send({ year: data });
  });

export default withAuth(handler);
