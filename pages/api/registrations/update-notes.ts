import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registration } from '../../../db';

import { currentYearString } from 'constants/currentYear';

import { Registration, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const updatedRegistration: Registration = req.body;
    const result = await registration.updateRegistration(
      req.db,
      currentYearString,
      updatedRegistration
    );
    res.send({ ...result });
  });

export default withAuth(handler);
