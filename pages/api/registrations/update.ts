import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { RegistrationUpdate, Request } from '../../../interfaces';
import { registrations } from '../../../db';
import {
  calculateTotals,
  checkForDefault,
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

      const update: RegistrationUpdate = {
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
          name: data.emergencyContact.name,
          phone: removeNonDigits(data.emergencyContact.phone),
        },
        sessions: verifiedSessions,
        discount: data.discount === 'true' ? true : false,
        crewMembers: data.crewMembers.filter((m: string) => m !== ''),
        subtotal,
        total,
        paymentStatus: checkForDefault(data.paymentStatus),
        paymentMethod: checkForDefault(data.paymentMethod),
        checkNumber: data.checkNumber.trim(),
        refundAmount: data.refundAmount * 100,
        notes: data.notes,
        updatedAt: `${new Date().toISOString()}`,
      };

      const result = await registrations.updateRegistration(
        req.db,
        data._id,
        update
      );

      res.json({ registration: result });
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  });

export default withAuth(handler);
