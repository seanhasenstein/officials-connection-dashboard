import { NextApiResponse, NextApiRequest } from 'next';
import nc from 'next-connect';
import { Db } from 'mongodb';

import database from '../../../middleware/db';
import { year } from '../../../db';

import { withAuth } from '../../../utils/withAuth';
import { createId, removeNonDigits } from '../../../utils/misc';

import { Camps } from 'types';

interface Request extends NextApiRequest {
  db: Db;
  body: {
    mode: 'add' | 'update';
    camp: Camps;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      city: string;
      state: string;
    };
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { mode, camp, id, firstName, lastName, email, phone, address } =
      req.body;
    const { city = '', state = '' } = address;

    if (
      !mode ||
      !camp ||
      !id ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !city ||
      !state
    ) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const clinician = {
      id: mode === 'add' ? createId() : id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: removeNonDigits(phone).trim(),
      address: {
        city: city.trim(),
        state: state.trim().toUpperCase(),
      },
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
