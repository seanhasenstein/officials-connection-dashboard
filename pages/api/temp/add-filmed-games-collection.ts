import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allYears = await req.db.collection('years').find({}).toArray();

    for (const year of allYears) {
      for (const filmedGame of year.filmedGames) {
        await req.db.collection('filmedGames').insertOne({
          year: year.year,
          ...filmedGame,
        });
      }
    }

    const allFilmedGames = await req.db
      .collection('filmedGames')
      .find({})
      .toArray();

    res.send({
      success: true,
      totalFilmedGames: allFilmedGames.length,
      allFilmedGames,
    });
  });

export default withAuth(handler);
