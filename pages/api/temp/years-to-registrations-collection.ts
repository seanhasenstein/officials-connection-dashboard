import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { RegistrationV2, Request, Year } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allYears = await req.db.collection<Year>('years').find({}).toArray();

    for (const year of allYears) {
      const yearRegistrations = year.registrations;

      for (const registration of yearRegistrations) {
        await req.db.collection<RegistrationV2>('registrations').insertOne({
          receiptId: registration.id,
          firstName: registration.firstName,
          lastName: registration.lastName,
          email: registration.email.toLowerCase().trim(),
          phone: registration.phone,
          address: registration.address,
          wiaaClass: registration.wiaaClass,
          wiaaNumber: registration.wiaaNumber,
          associations: registration.associations || '',
          foodAllergies: registration.foodAllergies || '',
          emergencyContact: registration.emergencyContact,
          sessions: registration.sessions,
          crewMembers: registration.crewMembers || [],
          discounts: registration.discounts || [],
          subtotal: registration.subtotal,
          total: registration.total,
          refundAmount: registration.refundAmount || 0,
          paymentStatus: registration.paymentStatus,
          paymentMethod: registration.paymentMethod,
          checkNumber: registration.checkNumber || '',
          stripeId: registration.stripeId || null,
          notes: registration.notes || [],
          createdAt: new Date(registration.createdAt),
          updatedAt: new Date(registration.updatedAt),
        });
      }
    }

    res.send({ success: true });
  });

export default withAuth(handler);
