import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { RegistrationV2, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allRegistrations = await req.db
      .collection<RegistrationV2>('registrations')
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    const emailToRegistrations = new Map();
    const phoneToRegistrations = new Map();

    for (const registration of allRegistrations) {
      const { firstName, lastName, email, phone, _id, createdAt } =
        registration;
      const formattedEmail = email.toLowerCase().trim();
      const formattedPhone = phone.trim();

      if (!emailToRegistrations.has(formattedEmail)) {
        emailToRegistrations.set(formattedEmail, []);
      }
      emailToRegistrations
        .get(formattedEmail)
        .push({ _id, firstName, lastName, email, phone, createdAt });

      if (!phoneToRegistrations.has(formattedPhone)) {
        phoneToRegistrations.set(formattedPhone, []);
      }
      phoneToRegistrations
        .get(formattedPhone)
        .push({ _id, firstName, lastName, email, phone, createdAt });
    }

    const conflicts = [];

    // Find emails with multiple different phones
    for (const [email, regs] of emailToRegistrations) {
      const uniquePhones = new Set(regs.map(r => r.phone));
      if (uniquePhones.size > 1) {
        conflicts.push({
          type: 'SAME_EMAIL_DIFFERENT_PHONES',
          email,
          registrations: regs.map(r => ({
            _id: r._id,
            name: `${r.firstName} ${r.lastName}`,
            phone: r.phone,
            email: r.email,
            createdAt: r.createdAt,
          })),
        });
      }
    }

    // Find phones with multiple different emails
    for (const [phone, regs] of phoneToRegistrations) {
      const uniqueEmails = new Set(regs.map(r => r.email.toLowerCase().trim()));
      if (uniqueEmails.size > 1) {
        conflicts.push({
          type: 'SAME_PHONE_DIFFERENT_EMAILS',
          phone,
          registrations: regs.map(r => ({
            receiptId: r.receiptId,
            name: `${r.firstName} ${r.lastName}`,
            email: r.email.toLowerCase().trim(),
            date: r.createdAt,
            sessions: r.sessions,
          })),
        });
      }
    }

    res.send({ success: true, conflicts });
  });

export default withAuth(handler);
