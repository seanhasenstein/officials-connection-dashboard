import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Camp, CampSession, Request } from '../../../types';

type SessionWithoutId = Omit<CampSession, '_id'>;

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allCamps = await req.db.collection<Camp>('camps').find({}).toArray();

    for (const camp of allCamps) {
      for (const session of camp.sessions) {
        const newSession: SessionWithoutId = {
          sessionId: session.sessionId,
          camp: camp._id,
          year: camp.year,
          dates: session.dates,
          times: session.times,
          category: session.category,
          levels: session.levels,
          mechanics: session.mechanics,
          price: session.price,
          active: session.active,
          filmedGamesEmailSent: session.filmedGamesEmailSent,
          createdAt: session.createdAt
            ? new Date(session.createdAt)
            : new Date(),
          updatedAt: session.updatedAt
            ? new Date(session.updatedAt)
            : new Date(),
        };

        const result = await req.db
          .collection('campSessions')
          .insertOne(newSession);

        console.log(
          `Inserted session ${newSession.sessionId} for camp ${camp.name} with id ${result.insertedId}`
        );
      }
    }

    res.send({
      success: true,
    });
  });

export default withAuth(handler);
