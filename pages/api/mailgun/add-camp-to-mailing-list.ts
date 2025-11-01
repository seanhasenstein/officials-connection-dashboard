import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { connectToDb, year as yearDb } from '../../../db';
import { withAuth } from '../../../utils/withAuth';

import { mailgunAuthToken } from 'constants/mailgun';

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  try {
    const { mailingList, year, campId } = req.body;

    if (!mailingList || !year || !campId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await connectToDb();

    const yearDocument = await yearDb.getYear(db, year);

    if (!yearDocument) {
      return res.status(404).json({ error: 'Year not found' });
    }

    const allRegistrations = yearDocument.registrations || [];
    const campRegistrations = allRegistrations.filter(r => {
      const sessions = r.sessions || [];
      const sessionCampIds = sessions.map(s => s.camp.campId);
      return sessionCampIds.includes(campId);
    });
    const emailsToSubscribe = Array.from(
      new Set(campRegistrations.map(r => r.email))
    );

    console.log(
      `Subscribing ${emailsToSubscribe.length} emails to mailing list ${mailingList}`
    );
    console.log('emailsToSubscribe', emailsToSubscribe);

    const formData = new FormData();
    formData.append('members', JSON.stringify(emailsToSubscribe));

    await fetch(
      `https://api.mailgun.net/v3/lists/${mailingList}/members.json`,
      {
        method: 'POST',
        headers: {
          Authorization: mailgunAuthToken,
        },
        body: formData,
      }
    );

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

export default withAuth(handler);
