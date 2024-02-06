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
    const requestBody: { id: string; formValues: RegistrationInput } = req.body;
    // TODO: make year dynamic
    const serverSessions = await year.getSessions(req.db, '2024');
    const registrationForDb = formatRegistrationForDb(
      requestBody.formValues,
      serverSessions || []
    );
    // TODO: make year dynamic
    const result = await registration.updateRegistration(
      req.db,
      '2024',
      registrationForDb
    );

    res.json({ registration: result });
  });

export default withAuth(handler);
