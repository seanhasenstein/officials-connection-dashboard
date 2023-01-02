import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Camp, Request, Year } from '../../../types';
import { year } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const campRequest: Camp = req.body;
    const yearData = await year.getYear(req.db, '2022');
    const updatedCamps = yearData.camps.map(c => {
      if (c.campId === campRequest.campId) {
        return campRequest;
      } else {
        return c;
      }
    });
    const updatedYear: Year = { ...yearData, camps: updatedCamps };
    const result = await year.updateYear(req.db, updatedYear);
    res.json(result);
  });

export default withAuth(handler);
