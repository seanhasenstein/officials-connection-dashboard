import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { FilmedGame, Request as IRequest, Year } from '../../types';
import { registration, year } from '../../db';
import generateEmail from '../../emails/gameFilm';
import { sendEmail } from '../../utils/mailgun';
import { formatSessionName } from '../../utils/misc';

interface Request extends IRequest {
  body: {
    camp: 'Kaukauna' | 'Plymouth';
    sessionId: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const yearData = await year.getYear(req.db, '2022');
    const requestedSessionId = req.body.sessionId;
    const camp: 'Kaukauna' | 'Plymouth' = req.body.camp;
    const session = yearData.camps
      .find(c => c.name.includes(camp))
      ?.sessions.find(s => s.sessionId === requestedSessionId);

    if (!session) {
      res.json({ error: 'Invalid sessionId provided.' });
      return;
    }

    const registrationsData = await registration.getRegistrations(req.db);
    const filmedGamesBySessionAndOfficial = yearData.filmedGames.reduce(
      (
        accumulator: { [registrationId: string]: FilmedGame[] },
        currentFilmedGame
      ) => {
        if (currentFilmedGame.sessions.includes(requestedSessionId)) {
          currentFilmedGame.officials.forEach(official => {
            accumulator[official._id] = [
              ...(accumulator[official._id] || []),
              currentFilmedGame,
            ];
          });
        }
        return accumulator;
      },
      {}
    );

    for (const registrationId in filmedGamesBySessionAndOfficial) {
      const registration = registrationsData.find(
        r => r._id === registrationId
      );

      if (
        registration?.sessions.some(
          s => s.attending && s.sessionId === requestedSessionId
        )
      ) {
        const filmedGames = filmedGamesBySessionAndOfficial[registrationId];
        const { html, text } = generateEmail({
          firstName: registration.firstName,
          year: '2022',
          camp,
          filmedGames,
        });
        const result = await sendEmail({
          to: registration.email,
          from: 'WBYOC<wbyoc@officialsconnection.org>',
          subject: `2022 WBYOC Game Film for ${formatSessionName(session)}`,
          text,
          html,
        });

        console.log(result);
      }
    }

    // update the session.filmedGamesEmailSent to true
    const updatedCamps = yearData.camps.map(c => {
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
    const updatedYear: Year = { ...yearData, camps: updatedCamps };
    const result = await year.updateYear(req.db, updatedYear);

    res.send({ year: result });
  });

export default withAuth(handler);
