import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { RegistrationInput, Request } from '../../../interfaces';
import { registration, year } from '../../../db';
import { formatRegistrationForDb } from '../../../utils/registration';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const requestBody: RegistrationInput = req.body;
    const serverSessions = await year.getSessions(req.db, '2022');
    const registrationForDb = formatRegistrationForDb(
      requestBody,
      serverSessions
    );
    const id = await registration.addRegistration(req.db, registrationForDb);
    res.json({ id });
  });

export default withAuth(handler);
