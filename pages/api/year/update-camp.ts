import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';
import { year } from '../../../db';

import { currentYearString } from 'constants/currentYear';

import { Camp, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const campRequest: Camp = req.body;
    const yearData = await year.getYear(req.db, currentYearString);

    if (!yearData) {
      throw new Error('Failed to find the year');
    }

    const updatedCamps = yearData?.camps.map(c => {
      if (c.campId === campRequest.campId) {
        return campRequest;
      } else {
        return c;
      }
    });
    const updatedYear = { ...yearData, camps: updatedCamps || [] };
    const result = await year.updateYear(
      req.db,
      currentYearString,
      updatedYear
    );
    res.json(result);
  });

export default withAuth(handler);
