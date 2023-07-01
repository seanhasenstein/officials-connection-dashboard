import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import generateEmail from '../../emails/template';
import { sendEmail } from '../../utils/mailgun';

interface Request extends NextApiRequest {
  body: {
    to: string;
    from: string;
    bcc: string | undefined;
    replyTo: string | undefined;
    subject: string;
    body: string[];
    signOff: string | undefined;
    includeMoreInfoLinks: boolean;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const {
      to,
      from,
      bcc,
      replyTo,
      subject,
      body,
      signOff,
      includeMoreInfoLinks,
    } = req.body;

    if (
      !to ||
      !from ||
      !subject ||
      !body ||
      includeMoreInfoLinks === undefined
    ) {
      throw new Error(
        'Missing required fields. Required fields are: to, from, subject, body, includeMoreInfoLinks'
      );
    }

    const { html, text } = generateEmail(body, includeMoreInfoLinks, signOff);

    const result = await sendEmail({
      to,
      from,
      replyTo,
      bcc,
      subject,
      html,
      text,
    });

    res.send({ result });
  });

export default withAuth(handler);
