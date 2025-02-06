import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { createObjectCsvStringifier } from 'csv-writer';
import { format, utcToZonedTime } from 'date-fns-tz';

import database from '../../middleware/db';
import { year, registration } from '../../db';

import {
  formatPhoneNumber,
  formatSessionNameFromId,
  formatToMoney,
} from '../../utils/misc';
import { withAuth } from '../../utils/withAuth';

import { currentYearString } from 'constants/currentYear';

import { Registration, Request } from '../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
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

    res.json({ csv });
  });

export default withAuth(handler);
