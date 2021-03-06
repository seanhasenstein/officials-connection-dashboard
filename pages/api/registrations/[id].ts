import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registration } from '../../../db';
import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const result = await registration.getRegistration(req.db, id);
    res.send({ registration: result });
  });

export default withAuth(handler);
