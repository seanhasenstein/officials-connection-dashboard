import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { registrations } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const result = await registrations.getRegistrations(req.db);
      res.send({ registrations: result });
    } catch (error) {
      console.error(error);
      res.send({ error: error.message });
    }
  });

export default handler;
