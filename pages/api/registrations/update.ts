import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { registrations } from '../../../db';
import { removeNonDigits } from '../../../utils';
import { Request, Session } from '../../../interfaces';
import { sessionsData } from '../../../data';

type CalcSubtotalParams = {
  subtotal: number;
  paymentAmount: number;
  paymentMethod: 'card' | 'cash' | 'check' | 'free';
  hsCrewDeal: 'true' | 'false';
};

const calcSubtotal = ({
  subtotal,
  paymentAmount,
  paymentMethod,
  hsCrewDeal,
}: CalcSubtotalParams) => {
  if (paymentMethod === 'card') {
    return subtotal;
  }

  if (hsCrewDeal === 'true' && paymentMethod !== 'free') {
    return paymentAmount * 100 + 1000;
  }

  return paymentAmount * 100;
};

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const verifiedSessions = req.body.sessions.map((s: string) => {
        const session = sessionsData.find(v => v.id === s);

        return { ...session, attending: true };
      });

      verifiedSessions.sort(
        (a: Session, b: Session) => Number(a.id) - Number(b.id)
      );

      const subtotal = calcSubtotal({
        subtotal: req.body.subtotal,
        paymentAmount: req.body.paymentAmount,
        paymentMethod: req.body.paymentMethod,
        hsCrewDeal: req.body.hsCrewDeal,
      });
      const total =
        req.body.paymentMethod === 'card'
          ? req.body.total
          : req.body.paymentAmount * 100;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, paymentAmount, ...document } = {
        ...req.body,
        _id: req.body._id,
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
        subtotal,
        total,
        stripeId: req.body.stripeId,
        updatedAt: new Date(),
      };

      const data = await registrations.updateRegistration(
        req.db,
        req.body._id,
        document
      );

      res.json({ registration: data });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
