import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { withAuth } from '../../../utils/withAuth';
import { Request } from '../../../types';
import { registration } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const id = req.body;
    // TODO: make year dynamic
    await registration.deleteRegistration(req.db, '2023', id);
    res.json({ success: true });
  });

export default withAuth(handler);
