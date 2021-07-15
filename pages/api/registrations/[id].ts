import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { ObjectID } from 'mongodb';
import database from '../../../middleware/db';
import { registrations } from '../../../db';
import { Request } from '../../../interfaces';
//
const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      const result = await registrations.getRegistrations(req.db, {
        _id: new ObjectID(id),
      });
      res.send({ registration: result[0] });
    } catch (error) {
      console.error(error);
      res.send({ error: error.message });
    }
  });

export default handler;
