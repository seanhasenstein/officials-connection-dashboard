import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Camp, Request, Year } from '../../../types';

type CampWithoutId = Omit<Camp, '_id'>;

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allYears = await req.db.collection<Year>('years').find({}).toArray();

    for (const year of allYears) {
      for (const camp of year.camps) {
        const newCamp: CampWithoutId = {
          ...camp,
          year: Number(year.year),
          createdAt: new Date(camp.createdAt),
          updatedAt: new Date(camp.updatedAt),
        };

        const result = await req.db.collection('camps').insertOne(newCamp);

        console.log(
          `Inserted camp ${newCamp.name} for year ${year.year} with id ${result.insertedId}`
        );
      }
    }

    res.send({
      success: true,
    });
  });

export default withAuth(handler);
