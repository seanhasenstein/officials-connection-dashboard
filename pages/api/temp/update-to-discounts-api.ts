import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Db } from 'mongodb';

import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { registration } from '../../../db';

interface CustomRequest extends NextApiRequest {
  db: Db;
}

const handler = nc<CustomRequest, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allRegsQuery = await registration.getAllRegistrationsForYear(
      req.db,
      '2022'
    );

    if (!allRegsQuery) {
      throw new Error('Failed to fetch all registrations');
    }

    for (let i = 0; i < allRegsQuery.length; i++) {
      const currentRegistration = allRegsQuery[i];

      if (!currentRegistration.discounts) {
        const currentRegistrationDiscount = currentRegistration.discount;
        const discounts =
          currentRegistrationDiscount?.active === true
            ? [
                {
                  amount: currentRegistrationDiscount?.amount,
                  name: currentRegistrationDiscount?.name,
                },
              ]
            : [];

        const updatedRegistration = { ...currentRegistration, discounts };

        await registration.updateRegistration(
          req.db,
          '2022',
          updatedRegistration
        );
      }
    }

    const updatedRegsQuery = await registration.getAllRegistrationsForYear(
      req.db,
      '2022'
    );

    res.json({ updatedRegsQuery });
  });

export default withAuth(handler);
