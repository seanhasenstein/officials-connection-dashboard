import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Registration, Request } from '../../interfaces';
import { withAuth } from '../../utils/withAuth';
import { registration, year } from '../../db';
import database from '../../middleware/db';
import { getCloudinaryAttachments } from '../../utils/cloudinary';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    try {
      const sessionsData = await year.getSessions(req.db, '2022');
      const registrationData = await registration.getRegistrations(req.db);
      const cloudinaryData = await getCloudinaryAttachments();

      const sessionsWithAttachments = sessionsData.map(session => {
        const attachment =
          cloudinaryData.sessionsWithAttachments[session.sessionId];
        return { ...session, attachment };
      });

      type EmailsAccumulator = {
        kaukauna: Registration[];
        plymouth: Registration[];
      };

      const emailsNeeded = registrationData.reduce(
        (accumulator: EmailsAccumulator, currentRegistration) => {
          if (!currentRegistration.email || currentRegistration.email === '') {
            const attendingKaukauna = currentRegistration.sessions.some(
              s => s.attending && s.camp.name === 'Kaukauna'
            );
            const attendingPlymouth = currentRegistration.sessions.some(
              s => s.attending && s.camp.name === 'Plymouth'
            );

            if (attendingKaukauna) {
              accumulator.kaukauna.push(currentRegistration);
            }

            if (attendingPlymouth) {
              accumulator.plymouth.push(currentRegistration);
            }
          }

          return accumulator;
        },
        { kaukauna: [], plymouth: [] }
      );

      res.json({
        attachments: cloudinaryData.cloudinaryAttachments,
        kaukaunaEmailsNeeded: emailsNeeded.kaukauna,
        plymouthEmailsNeeded: emailsNeeded.plymouth,
        sessions: sessionsWithAttachments,
      });
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  });

export default withAuth(handler);
