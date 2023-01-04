import fs from 'fs';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../middleware/db';
import { registration, year } from '../../db';
import { Camp, Request as IRequest } from '../../types';
import { withAuth } from '../../utils/withAuth';
import { getCloudinaryAttachments } from '../../utils/cloudinary';
import { sendEmail } from '../../utils/mailgun';
import generateEmail from '../../emails/questionnaire';
import { createIdNumber } from '../../utils/misc';

interface Request extends IRequest {
  body: {
    camp: Camp;
    nextYearsDates: string;
    subject: string;
  };
}

type Attachment = {
  url: string;
  filename: string;
};

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const requestedCamp = req.body.camp;
      // TODO: make year dynamic
      const yearData = await year.getYear(req.db, '2023');

      if (!yearData) {
        throw new Error('Failed to find the year');
      }

      // TODO: make year dynamic
      const registrationsData = await registration.getAllRegistrationsForYear(
        req.db,
        '2023'
      );
      const cloudinaryData = await getCloudinaryAttachments();

      const cachedFiles: Record<string, Buffer> = {};
      const attachmentsToDelete: string[] = [];

      for (const registration of registrationsData || []) {
        if (
          registration.sessions.some(
            session =>
              session.attending && session.camp.campId === requestedCamp.campId
          )
        ) {
          const attachments = registration.sessions.reduce(
            (accumulator: Attachment[], currentSession) => {
              if (
                currentSession.attending &&
                currentSession.camp.campId === requestedCamp.campId
              ) {
                const attachment = cloudinaryData.cloudinaryAttachments.find(
                  attachment =>
                    attachment.session_ids?.includes(currentSession.sessionId)
                );

                if (attachment) {
                  const attachmentObj: Attachment = {
                    url: attachment.url,
                    filename: attachment.filename,
                  };
                  accumulator.push(attachmentObj);

                  // check if we need to add attachment to the attachmentsToDelete array
                  const attachmentExists = attachmentsToDelete.some(
                    atd => atd === attachment.filename
                  );

                  if (attachmentExists === false) {
                    attachmentsToDelete.push(attachment.filename);
                  }
                }
              }

              return accumulator;
            },
            []
          );

          const { html, text } = generateEmail({
            id: registration.id,
            firstName: registration.firstName,
            camp: requestedCamp.location.city,
            nextYearsDates: req.body.nextYearsDates,
          });

          const result = await sendEmail({
            to: 'seanhasenstein@gmail.com',
            from: 'WBYOC<wbyoc@officialsconnection.org>',
            subject: `${req.body.subject} [#${createIdNumber()}]`,
            html,
            text,
            attachments,
            cachedFiles,
          });

          console.log(result);
        }
      }

      for (const attachment of attachmentsToDelete) {
        fs.unlinkSync(`/tmp/${attachment}`);
        console.log(`successfully deleted /tmp/${attachment}`);
      }

      const tmp = fs.readdirSync('/tmp');
      console.log(tmp);

      const updatedCamps = yearData?.camps.map(c => {
        if (c.campId === requestedCamp.campId) {
          return { ...c, questionnaireEmailSent: true };
        } else {
          return c;
        }
      });
      const updatedYear = { ...yearData, camps: updatedCamps };
      // TODO: Make year dynamic
      await year.updateYear(req.db, '2023', updatedYear);

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json({ success: false, error });
    }
  });

export default withAuth(handler);
