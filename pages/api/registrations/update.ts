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
    const requestBody: { _id: string; formValues: RegistrationInput } =
      req.body;
    const serverSessions = await year.getSessions(req.db, '2022');
    const registrationForDb = formatRegistrationForDb(
      requestBody.formValues,
      serverSessions
    );
    const result = await registration.updateRegistration(
      req.db,
      requestBody._id,
      registrationForDb
    );

    res.json({ registration: result });
  });

export default withAuth(handler);
