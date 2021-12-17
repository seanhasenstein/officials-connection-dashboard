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
      const result = await registrations.getRegistrations(req.db, {
        'sessions.id': req.query.id,
      });

      const sortedResult = result.sort((a, b) => {
        if (a.lastName === b.lastName)
          return a.firstName < b.firstName ? -1 : 1;
        return a.lastName < b.lastName ? -1 : 1;
      });

      const data = sortedResult.reduce(
        (
          acc: { attending: Registration[]; notAttending: Registration[] },
          currReg: Registration
        ) => {
          currReg.sessions.forEach(s => {
            if (s.id === req.query.id && s.attending) {
              acc.attending.push(currReg);
              return;
            } else if (s.id === req.query.id) {
              acc.notAttending.push(currReg);
            }
          });
          return acc;
        },
        { attending: [], notAttending: [] }
      );

      res.send({ registrations: data });
    } catch (error) {
      console.error(error);
      res.send({ error });
    }
  });

export default withAuth(handler);
