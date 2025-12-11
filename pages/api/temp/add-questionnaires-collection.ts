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
      for (const questionnaire of year.questionnaires) {
        await req.db.collection('questionnaires').insertOne({
          year: year.year,
          ...questionnaire,
        });
      }
    }

    const allQuestionnaires = await req.db
      .collection('questionnaires')
      .find({})
      .toArray();

    res.send({
      success: true,
      totalQuestionnaires: allQuestionnaires.length,
      allQuestionnaires,
    });
  });

export default withAuth(handler);
