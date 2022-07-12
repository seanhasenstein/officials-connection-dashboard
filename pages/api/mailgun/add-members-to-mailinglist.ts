import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { withAuth } from '../../../utils/withAuth';

const AUTHTOKEN = `Basic ${Buffer.from(
  `api:${process.env.MAILGUN_API_KEY}`
).toString(`base64`)}`;

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  try {
    const filepath = './public/...';

    const membersToAdd = fs
      .readFileSync(filepath)
      .toString()
      .split('\n')
      .map(v => {
        const array = v.split(',');
        return {
          address: array[3].trim().toLowerCase(),
          name: array[2].trim(),
          vars: {
            firstName: array[0].trim(),
            lastName: array[1].trim(),
          },
        };
      });

    const form = new FormData();
    form.append('members', JSON.stringify(membersToAdd));

    await fetch(
      `https://api.mailgun.net/v3/lists/hs-officials-master-list@mg.officialsconnection.org/members.json`,
      {
        method: 'POST',
        body: form,
        headers: {
          Authorization: AUTHTOKEN,
        },
      }
    );

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

export default withAuth(handler);
