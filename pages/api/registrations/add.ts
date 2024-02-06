import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { RegistrationInput, Request } from '../../../types';
import { registration, year } from '../../../db';
import { formatRegistrationForDb } from '../../../utils/registration';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const requestBody: RegistrationInput = req.body;
    const serverSessions = await year.getSessions(req.db, '2024');

    // TODO: Is this the correct way to handle this?
    if (!serverSessions) {
      throw new Error('Failed to fetch server sessions');
    }

    const dbFormattedRegistration = formatRegistrationForDb(
      requestBody,
      serverSessions
    );
    const createdRegistration = await registration.addRegistration(
      req.db,
      '2024', // TODO: make this dynamic
      dbFormattedRegistration
    );
    res.json({ id: createdRegistration?.id });
  });

export default withAuth(handler);
