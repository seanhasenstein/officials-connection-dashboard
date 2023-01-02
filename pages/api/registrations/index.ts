import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registration } from '../../../db';
import { Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const result = await registration.getRegistrations(req.db);

    const sortedResults = result.sort((a, b) => {
      if (a.lastName === b.lastName) return a.firstName < b.firstName ? -1 : 1;
      return a.lastName < b.lastName ? -1 : 1;
    });

    res.send({ registrations: sortedResults });
  });

export default withAuth(handler);
