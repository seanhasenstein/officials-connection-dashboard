import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Db } from 'mongodb';
import { createObjectCsvStringifier, createObjectCsvWriter } from 'csv-writer';
import { format, utcToZonedTime } from 'date-fns-tz';
import fs from 'fs';

import database from '../../middleware/db';
import { year, registration } from '../../db';

import { sendEmail } from '../../utils/mailgun';
import {
  formatPhoneNumber,
  formatSessionNameFromId,
  formatToMoney,
} from 'utils/misc';

import { currentYearString } from 'constants/currentYear';

import { Registration } from 'types';

interface Request extends NextApiRequest {
  db: Db;
  body: {
    email: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.send({ error: 'Missing required email', code: 400 });
        return;
      }

      const acceptedEmails = [
        'seanhasenstein@gmail.com',
        'wbyoc@officialsconnection.org',
        'tom.rusch25@gmail.com',
      ];

      if (!acceptedEmails.includes(email)) {
        res.send({ error: 'Unauthorized', code: 401 });
        return;
      }

      const allSessions = await year.getSessions(req.db, currentYearString);

      if (!allSessions) {
        throw new Error('Failed to find the server sessions');
      }

      const allRegistrations = await registration.getAllRegistrationsForYear(
        req.db,
        currentYearString
      );

      if (!allRegistrations) {
        throw new Error('Failed to find the server registrations');
      }

      // todo: move this to a helper function
      const sessionIdsArray = allSessions?.map(s => s.sessionId);

      const sessionsAccumulator = sessionIdsArray?.reduce(
        (accumulator, currentId) => {
          return { ...accumulator, [currentId]: [] };
        },
        {}
      );

      const header = [
        { id: 'registrationId', title: 'ID' },
        { id: 'firstName', title: 'FIRST NAME' },
        { id: 'lastName', title: 'LAST NAME' },
        { id: 'email', title: 'EMAIL' },
        { id: 'phone', title: 'PHONE' },
        { id: 'city', title: 'CITY' },
        { id: 'state', title: 'STATE' },
        { id: 'wiaaClass', title: 'WIAA CLASS' },
        { id: 'wiaaNumber', title: 'WIAA NUMBER' },
        { id: 'associations', title: 'ASSOCIATIONS' },
        { id: 'discounts', title: 'DISCOUNTS' },
        { id: 'crew1', title: 'CREW MEMBER 1' },
        { id: 'crew2', title: 'CREW MEMEBER 2' },
        { id: 'total', title: 'TOTAL' },
        { id: 'paymentMethod', title: 'PMT METHOD' },
        { id: 'paymentStatus', title: 'PMT STATUS' },
        { id: 'stripeId', title: 'STRIPE ID' },
        { id: 'date', title: 'DATE' },
      ];

      const csvStringifier = createObjectCsvStringifier({ header });

      const registrationsBySession = allRegistrations.reduce(
        (acc: Record<string, any>, cr) => {
          const zonedDate = utcToZonedTime(
            new Date(cr.createdAt),
            'America/Chicago'
          );
          const createdAt = format(zonedDate, 'Pp', {
            timeZone: 'America/Chicago',
          });

          cr.sessions.forEach(s => {
            const registration = {
              registrationId: cr.id,
              firstName: cr.firstName,
              lastName: cr.lastName,
              email: cr.email,
              phone: formatPhoneNumber(cr.phone),
              city: cr.address.city,
              state: cr.address.state,
              wiaaClass: cr.wiaaClass,
              wiaaNumber: cr.wiaaNumber,
              associations: cr.associations,
              discounts:
                cr.discounts
                  ?.map(d => `${d.name} [${d.amount / 100}]`)
                  .join(', ') || '',
              crew1: cr.crewMembers[0] || '',
              crew2: cr.crewMembers[1] || '',
              total: formatToMoney(cr.total, true),
              paymentMethod: cr.paymentMethod.toUpperCase(),
              paymentStatus: cr.paymentStatus.toUpperCase(),
              stripeId: cr.stripeId,
              date: createdAt,
            };

            if (s.attending) {
              acc[s.sessionId] = [...acc[s.sessionId], registration];
              acc[s.sessionId].sort((a: Registration, b: Registration) => {
                if (a.lastName === b.lastName) {
                  if (a.firstName > b.firstName) {
                    return 1;
                  } else if (a.firstName < b.firstName) {
                    return -1;
                  } else {
                    return 0;
                  }
                }

                if (a.lastName > b.lastName) {
                  return 1;
                } else if (a.lastName < b.lastName) {
                  return -1;
                } else {
                  return 0;
                }
              });
            }
          });

          return acc;
        },
        sessionsAccumulator
      );

      const blankRow = header.reduce((acc, currHeader) => {
        return { ...acc, [currHeader.id]: '' };
      }, {});

      const records = Object.keys(registrationsBySession).reduce(
        (acc: Record<string, any>[], currSessionId) => {
          const sessionName = formatSessionNameFromId(
            allSessions || [],
            currSessionId
          );
          const sessionTitleRow = {
            registrationId: `${sessionName} [${registrationsBySession[currSessionId].length}]`,
          };

          return [
            ...acc,
            sessionTitleRow,
            ...registrationsBySession[currSessionId],
            blankRow,
          ];
        },
        []
      );

      const csv = `${csvStringifier.getHeaderString()} ${csvStringifier.stringifyRecords(
        records
      )}`;

      const filename = `/tmp/wbyoc-registrations-${new Date().toISOString()}.csv`;

      fs.createWriteStream(filename);

      const csvWriter = createObjectCsvWriter({
        path: filename,
        header,
      });

      await csvWriter.writeRecords(records);

      const csvFile = fs.readFileSync(filename);

      const timestampZonedDate = utcToZonedTime(new Date(), 'America/Chicago');
      const timestamp = format(timestampZonedDate, "PP 'at' p", {
        timeZone: 'America/Chicago',
      });

      const result = await sendEmail({
        to: email,
        from: 'WBYOC Registrations<no-reply@officialsconnection.org>',
        subject: `WBYOC spreadsheet as of ${timestamp}`,
        text: `Attached is the WBYOC spreadsheet that you requested.\n\nThis spreadsheet was created ${timestamp}.`,
        attachments: [
          {
            filename,
            url: 'data:text/csv;charset=utf-8,' + csv,
          },
        ],
        cachedFiles: { [filename]: csvFile },
      });

      res.send({ result, csv, timestamp, code: 200 });
    } catch (error: any) {
      console.error('Failed to send email', error);
      res.send({ error: error.message, code: 500 });
      return;
    }
  });

export default handler;
