import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import {
  RegistrationDbFormat,
  RegistrationInput,
  Request,
} from '../../../interfaces';
import { registration, year } from '../../../db';
import { createIdNumber, verifySelectedSessions } from '../../../utils/misc';
import { formatRegistrationForDb } from '../../../utils/registration';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const data: RegistrationInput = req.body;
    const serverSessions = await year.getSessions(req.db, '2022');
    const verifiedSessions = verifySelectedSessions(
      data.sessions,
      serverSessions
    );
    const now = `${new Date().toISOString()}`;
    const formattedRegistration: RegistrationDbFormat = formatRegistrationForDb(
      {
        ...data,
        registrationId: createIdNumber(),
        sessions: verifiedSessions,
        total: 0,
        stripeId: null,
        notes: [],
        createdAt: now,
        updatedAt: now,
      }
    );

    const result = await registration.addRegistration(
      req.db,
      formattedRegistration
    );
    res.json({ id: result });
  });

export default withAuth(handler);
