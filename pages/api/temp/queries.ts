import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { RegistrationV2, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allRegistrations = await req.db
      .collection<RegistrationV2>('registrations')
      .find({})
      .toArray();

    for (const registration of allRegistrations) {
      for (const session of registration.sessions) {
        const sessionId = session.sessionId;

        const campSession = await req.db
          .collection('campSessions')
          .findOne({ sessionId });

        if (!campSession) {
          console.log(
            `No camp session found for sessionId ${sessionId} in registration ${registration._id}`
          );
          continue;
        }
      }
    }

    res.send({ success: true });
  });

export default withAuth(handler);
