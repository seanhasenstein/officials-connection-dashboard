import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registration } from '../../../db';
import { Registration, Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { _id, ...updatedRegistration }: Registration = req.body;
    const result = await registration.updateRegistration(
      req.db,
      _id,
      updatedRegistration
    );
    res.send({ ...result });
  });

export default withAuth(handler);
