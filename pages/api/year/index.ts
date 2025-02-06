import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';
import { year } from '../../../db';

import { currentYearString } from 'constants/currentYear';

import { Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const data = await year.getYear(req.db, currentYearString);
    res.send({ year: data });
  });

export default withAuth(handler);
