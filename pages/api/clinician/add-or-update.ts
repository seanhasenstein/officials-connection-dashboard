import { NextApiResponse, NextApiRequest } from 'next';
import nc from 'next-connect';
import { Db } from 'mongodb';

import database from '../../../middleware/db';
import { year } from '../../../db';

import { withAuth } from '../../../utils/withAuth';
import { createId, removeNonDigits } from '../../../utils/misc';

interface Request extends NextApiRequest {
  db: Db;
  body: {
    mode: 'add' | 'update';
    camp: 'Kaukauna Camp' | 'Plymouth Camp';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { mode, camp, id, firstName, lastName, email, phone } = req.body;

    if (!mode || !camp || !id || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const clinician = {
      id: mode === 'add' ? createId() : id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: removeNonDigits(phone).trim(),
      camp,
    };

    let result;

    if (mode === 'add') {
      result = await year.addClinician(req.db, camp, clinician);
    }

    if (mode === 'update') {
      result = await year.updateClinician(req.db, camp, clinician);
    }

    return res.json({ ...result });
  });

export default withAuth(handler);
