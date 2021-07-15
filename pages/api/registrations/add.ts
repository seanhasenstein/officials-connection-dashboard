import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { registrations } from '../../../db';
import { Request } from '../../../interfaces';
import { removeNonDigits } from '../../../utils';
import { sessionsData } from '../../../data';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const verifiedSessions = req.body.sessions.map((s: string) => {
        const session = sessionsData.find(v => v.id === s);

        return { ...session, attending: true };
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { paymentAmount, ...document } = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        phone: removeNonDigits(req.body.phone),
        sessions: verifiedSessions,
        hsCrewDeal: req.body.hsCrewDeal === 'true' ? true : false,
        crewMembers: req.body.crewMembers.filter((m: string) => m !== ''),
        emergencyContact: {
          name: req.body.emergencyContact.name,
          phone: removeNonDigits(req.body.emergencyContact.phone),
        },
        paymentAmount: req.body.paymentAmount,
        subtotal:
          req.body.hsCrewDeal === 'true'
            ? req.body.paymentAmount * 100 + 1000
            : req.body.paymentAmount * 100,
        total: req.body.paymentAmount * 100,
        stripeId: 'OFFLINE_REGISTRATION',
      };

      const data = await registrations.addRegistration(req.db, document);

      res.json({ registration: data });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
