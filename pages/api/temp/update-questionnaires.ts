import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { CampSession, Questionnaire, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allQuestionnaires = await req.db
      .collection<Questionnaire>('questionnaires')
      .find({})
      .toArray();

    for (const questionnaire of allQuestionnaires) {
      const campSession = await req.db
        .collection<CampSession>('campSessions')
        .findOne({ _id: questionnaire.session });

      if (!campSession) {
        console.log(
          `No camp session found for questionnaire ${questionnaire.id} with session id ${questionnaire.session}`
        );
      }

      const updatedQuestionnaire = {
        camp: campSession?.camp || null,
      };

      await req.db
        .collection('questionnaires')
        .updateOne({ _id: questionnaire._id }, { $set: updatedQuestionnaire });

      console.log(
        `Updated questionnaire ${questionnaire.id} with camp._id ${updatedQuestionnaire.camp}`
      );
    }

    res.send({
      success: true,
    });
  });

export default withAuth(handler);
