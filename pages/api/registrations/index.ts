import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registrations } from '../../../db';
import { Request, Registration } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const result: Registration[] = await registrations.getRegistrations(
        req.db
      );

      const sortedResults = result.sort((a, b) => {
        if (a.lastName === b.lastName)
          return a.firstName < b.firstName ? -1 : 1;
        return a.lastName < b.lastName ? -1 : 1;
      });

      res.send({ registrations: sortedResults });
    } catch (error) {
      console.error(error);
      res.send({ error });
    }
  });

export default withAuth(handler);
