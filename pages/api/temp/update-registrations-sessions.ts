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
      const sessionsArray = [];

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

        const camp = await req.db
          .collection('camps')
          .findOne({ _id: campSession.camp });

        if (!camp) {
          console.log(
            `No camp found for campId ${campSession.camp} in registration ${registration._id}`
          );
        }

        sessionsArray.push({
          sessionId: campSession.sessionId,
          attending: session.attending,
          camp: {
            campId: campSession.camp,
            year: camp?.year || undefined,
            name: camp?.name || '',
            dates: camp?.dates || '',
            // location: camp?.location || '', // removed
          },
          registeredAs: {
            dates: campSession.dates,
            times: campSession.times,
            category: campSession.category,
            levels: campSession.levels,
            mechanics: campSession.mechanics,
            price: campSession.price,
          },
        });
      }

      await req.db.collection('registrations').updateOne(
        { _id: registration._id },
        {
          $set: {
            sessions: sessionsArray,
          },
        }
      );
    }

    res.send({ success: true });
  });

export default withAuth(handler);
