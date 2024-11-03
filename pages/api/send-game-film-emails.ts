import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { FilmedGame, Request as IRequest } from '../../types';
import { year } from '../../db';
import generateEmail from '../../emails/postSession';
import { sendEmail } from '../../utils/mailgun';
import { formatSessionName } from '../../utils/misc';

interface Request extends IRequest {
  body: {
    camp: 'Kaukauna' | 'Plymouth' | 'UW-Stevens Point';
    sessionId: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    // TODO: make year dynamic
    const yearData = await year.getYear(req.db, '2024');

    if (!yearData) {
      throw new Error('Failed to find the year');
    }

    const requestedSessionId = req.body.sessionId;
    const camp: 'Kaukauna' | 'Plymouth' | 'UW-Stevens Point' = req.body.camp;
    const session = yearData?.camps
      .find(c => c.name.includes(camp))
      ?.sessions.find(s => s.sessionId === requestedSessionId);

    if (!session) {
      res.json({ error: 'Invalid sessionId provided.' });
      return;
    }

    // TODO: make year dynamic
    // const registrationsData = await registration.getAllRegistrationsForYear(
    //   req.db,
    //   '2024'
    // );

    const filmedGamesBySessionAndOfficial = yearData?.filmedGames.reduce(
      (
        accumulator: { [registrationId: string]: FilmedGame[] },
        currentFilmedGame
      ) => {
        // if this filmed game has an official attending the requested session...
        if (currentFilmedGame.sessions.includes(requestedSessionId)) {
          // for each official on this filmed game, add the filmed game to the officials array
          currentFilmedGame.officials.forEach(official => {
            accumulator[official.id] = [
              ...(accumulator[official.id] || []),
              currentFilmedGame,
            ];
          });
        }
        return accumulator;
      },
      {}
    );

    for (const registrationId in filmedGamesBySessionAndOfficial) {
      const registration = yearData?.registrations?.find(
        r => r.id === registrationId
      );

      if (
        registration?.sessions.some(
          s => s.attending && s.sessionId === requestedSessionId
        )
      ) {
        const filmedGames = filmedGamesBySessionAndOfficial[registrationId];
        const { html, text } = generateEmail({
          registrationId: registration.id,
          sessionId: requestedSessionId,
          firstName: registration.firstName,
          // TODO: make year dynamic
          year: '2024',
          camp,
          filmedGames,
        });
        const result = await sendEmail({
          to: registration.email,
          from: 'WBYOC<wbyoc@officialsconnection.org>',
          // TODO: make year dynamic
          subject: `Thanks for attending the 2024 WBYOC - ${formatSessionName(
            session
          )}`,
          text,
          html,
        });

        console.log(result);
      }
    }

    // update the session.filmedGamesEmailSent to true
    const updatedCamps = yearData?.camps.map(c => {
      if (c.name.includes(camp)) {
        const updatedSessions = c.sessions.map(s => {
          if (s.sessionId === requestedSessionId) {
            return { ...s, filmedGamesEmailSent: true };
          } else {
            return s;
          }
        });
        return { ...c, sessions: updatedSessions };
      } else {
        return c;
      }
    });
    const updatedYear = { ...yearData, camps: updatedCamps || [] };
    // TODO: Make year dynamic
    const result = await year.updateYear(req.db, '2024', updatedYear);

    res.send({ year: result });
  });

export default withAuth(handler);
