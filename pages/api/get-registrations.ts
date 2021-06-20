import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../middleware/db';
import { registration } from '../../db';
import { Request } from '../../interfaces/api';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const result = await registration.getRegistrations(req.db);
      res.send({ registrations: result });
    } catch (err) {
      // todo: add error handling
      console.log(err);
      res.send({ error: err.message });
    }
  });

export default handler;
