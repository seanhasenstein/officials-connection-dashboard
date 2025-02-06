import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';
import { registration } from '../../../db';

import { currentYearString } from 'constants/currentYear';

import { Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const id = req.body;
    await registration.deleteRegistration(req.db, currentYearString, id);
    res.json({ success: true });
  });

export default withAuth(handler);
