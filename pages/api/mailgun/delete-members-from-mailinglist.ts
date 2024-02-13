import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import fetch from 'node-fetch';
import { withAuth } from '../../../utils/withAuth';
import { mailgunAuthToken } from 'constants/mailgun';

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  try {
    const mailingList = 'hs-officials-master-list@mg.officialsconnection.org';
    const filepath = './public/...';

    const emailsToDelete = fs
      .readFileSync(filepath)
      .toString()
      .split('\n')
      .map(v => v.trim());

    for (const email of emailsToDelete) {
      const response = await fetch(
        `https://api.mailgun.net/v3/lists/${mailingList}/members/${email}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: mailgunAuthToken,
          },
        }
      );

      if (!response.ok) {
        console.log(`THE EMAIL ${email} DOESN'T EXIST`);
      }

      console.log(`SUCCESSFULLY DELETED ${email}`);
    }

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

export default withAuth(handler);
