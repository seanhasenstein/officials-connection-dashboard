import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { Request as IRequest } from '../../types';
import { year } from '../../db';
import generateEmail from '../../emails/postSession';
import { sendEmail } from '../../utils/mailgun';
import { formatSessionName } from '../../utils/misc';

interface Request extends IRequest {
  body: {
    campName: 'Kaukauna' | 'Plymouth';
    registrationId: string;
    sessionId: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    let result = null;
    // TODO: make year dynamic
    const yearData = await year.getYear(req.db, '2024');

    if (!yearData) {
      throw new Error('Failed to find the year');
    }

    const {
      campName: requestedCampName,
      registrationId,
      sessionId: requestedSessionId,
    } = req.body;

    const registration = yearData?.registrations.find(
      r => r.id === registrationId
    );

    const session = yearData?.camps
      .find(c => c.name.includes(requestedCampName))
      ?.sessions.find(s => s.sessionId === requestedSessionId);

    if (!session) {
      res.json({ error: 'Invalid sessionId provided.' });
      return;
    }

    if (registration) {
      const filmedGames = yearData.filmedGames.filter(
        fg =>
          fg.sessions.includes(requestedSessionId) &&
          fg.officials.some(o => o.id === registrationId)
      );

      const { html, text } = generateEmail({
        registrationId: registration.id,
        sessionId: requestedSessionId,
        firstName: registration.firstName,
        // TODO: make year dynamic
        year: '2024',
        camp: requestedCampName,
        filmedGames,
      });

      result = await sendEmail({
        to: registration.email,
        from: 'WBYOC<wbyoc@officialsconnection.org>',
        // TODO: make year dynamic
        subject: `Thanks for attending the 2024 WBYOC - ${formatSessionName(
          session
        )}`,
        text,
        html,
      });
    }

    console.log(result);

    res.send({ year: yearData, success: true });
  });

export default withAuth(handler);
