import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Camp, Request } from '../../../types';
import { year } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const campRequest: Camp = req.body;
    // TODO: make year dynamic
    const yearData = await year.getYear(req.db, '2023');

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
    // TODO: Make year dynamic
    const result = await year.updateYear(req.db, '2023', updatedYear);
    res.json(result);
  });

export default withAuth(handler);
