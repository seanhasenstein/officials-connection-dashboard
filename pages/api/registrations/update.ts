import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Registration, Request } from '../../../interfaces';
import { registration, year } from '../../../db';
import { verifySelectedSessions } from '../../../utils/misc';
import { formatRegistrationForDb } from '../../../utils/registration';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const data: Registration = req.body;

    const serverSessions = await year.getSessions(req.db, '2022');

    const verifiedSessions = verifySelectedSessions(
      data.sessions,
      serverSessions
    );

    const formattedUpdate = formatRegistrationForDb({
      ...data,
      sessions: verifiedSessions,
      checkNumber: data.checkNumber || '',
      updatedAt: `${new Date().toISOString()}`,
    });

    const result = await registration.updateRegistration(
      req.db,
      data._id,
      formattedUpdate
    );

    res.json({ registration: result });
  });

export default withAuth(handler);
