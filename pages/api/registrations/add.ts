import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { Request } from '../../../interfaces';
import { registrations } from '../../../db';
import {
  calculateTotals,
  checkForDefault,
  createIdNumber,
  formatZipcode,
  removeNonDigits,
  verifySelectedSessions,
} from '../../../utils';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const data = req.body;
      const verifiedSessions = verifySelectedSessions(data.sessions);
      const { subtotal, total } = calculateTotals(
        data.subtotal,
        data.total,
        data.paymentAmount,
        data.paymentMethod,
        data.discount
      );
      const now = `${new Date().toISOString()}`;

      const { paymentAmount, ...registration } = {
        ...data,
        registrationId: createIdNumber(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        phone: removeNonDigits(data.phone),
        address: {
          street: data.address.street.trim(),
          street2: data.address.street2.trim(),
          city: data.address.city.trim(),
          state: checkForDefault(data.address.state),
          zipcode: formatZipcode(data.address.zipcode),
        },
        wiaaClass: checkForDefault(data.wiaaClass),
        wiaaNumber: data.wiaaNumber.trim(),
        associations: data.associations.trim(),
        foodAllergies: data.foodAllergies.trim(),
        emergencyContact: {
          name: data.emergencyContact.name.trim(),
          phone: removeNonDigits(data.emergencyContact.phone),
        },
        sessions: verifiedSessions,
        discount: data.discount === 'true' ? true : false,
        crewMembers: data.crewMembers.filter((m: string) => m !== ''),
        paymentMethod: checkForDefault(data.paymentMethod),
        paymentStatus: checkForDefault(data.paymentStatus),
        paymentAmount: data.paymentAmount,
        checkNumber: data.checkNumber.trim(),
        stripeId: '',
        refundAmount: data.refundAmount * 100,
        subtotal,
        total,
        createdAt: now,
        updatedAt: now,
      };

      const result = await registrations.addRegistration(req.db, registration);

      res.json({ registration: result });
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  });

export default withAuth(handler);
