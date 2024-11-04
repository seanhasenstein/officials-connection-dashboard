import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { year } from '../../db';
import { mailgunAuthToken } from '../../constants/mailgun';
import { Request } from 'types';

export const config = {
  cache: {
    maxAge: 60,
    swr: true,
  },
};

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const mailingList = '2024-hs-marketing@mg.officialsconnection.org';

    const fetchedYear = await year.getYear(req.db, '2024');

    const allRegistrations = fetchedYear?.registrations || [];

    const highSchoolRegistrations = allRegistrations.filter(r => {
      if (r.sessions.some(s => s.category === 'High School')) {
        return true;
      } else {
        return false;
      }
    });

    for (let i = 0; i < highSchoolRegistrations.length; i++) {
      const registration = highSchoolRegistrations[i];
      const emailToResubscribe = registration.email;
      const response = await fetch(
        `https://api.mailgun.net/v3/lists/${mailingList}/members?address=${emailToResubscribe}&subscribed=yes&upsert=yes`,
        {
          method: 'POST',
          headers: {
            Authorization: mailgunAuthToken,
          },
        }
      );

      if (!response.ok) {
        console.log(`Error resubscribing email: ${emailToResubscribe}`);
      } else {
        console.log(`Successfully resubscribed email: ${emailToResubscribe}`);
      }
    }

    res.json({ success: true });
  });

export default withAuth(handler);
