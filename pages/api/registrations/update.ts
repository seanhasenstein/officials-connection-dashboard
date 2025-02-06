import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';
import { registration, year } from '../../../db';

import { formatRegistrationForDb } from '../../../utils/registration';

import { currentYearString } from 'constants/currentYear';

import { RegistrationInput, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const requestBody: { id: string; formValues: RegistrationInput } = req.body;
    const serverSessions = await year.getSessions(req.db, currentYearString);
    const registrationForDb = formatRegistrationForDb(
      requestBody.formValues,
      serverSessions || []
    );
    const result = await registration.updateRegistration(
      req.db,
      currentYearString,
      registrationForDb
    );

    res.json({ registration: result });
  });

export default withAuth(handler);
