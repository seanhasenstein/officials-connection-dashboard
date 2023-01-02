import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from '../../types';
import database from '../../middleware/db';
import { year, registration } from '../../db';
import { withAuth } from '../../utils/withAuth';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const sessions = await year.getSessions(req.db, '2022');
    const registrations = await registration.getRegistrations(req.db);

    const sessionIdsArray = sessions.map(s => s.sessionId);
    const sessionsAccumulator = sessionIdsArray.reduce(
      (accumulator, currentId) => {
        return { ...accumulator, [currentId]: [] };
      },
      {}
    );

    type NameObj = { firstName: string; lastName: string };

    const namesBySession = registrations.reduce(
      (acc: Record<string, NameObj[]>, cr) => {
        cr.sessions.forEach(s => {
          if (s.attending) {
            const nameObj = { firstName: cr.firstName, lastName: cr.lastName };
            acc[s.sessionId] = [
              ...acc[s.sessionId],
              nameObj,
              nameObj,
              nameObj,
              nameObj,
            ];
            acc[s.sessionId].sort((a: NameObj, b: NameObj) => {
              if (a.lastName === b.lastName) {
                if (a.firstName > b.firstName) {
                  return 1;
                } else if (a.firstName < b.firstName) {
                  return -1;
                } else {
                  return 0;
                }
              } else if (a.lastName > b.lastName) {
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

    const combinedArray = Object.keys(namesBySession).reduce(
      (acc: NameObj[], currSessionId) => {
        return [...acc, ...namesBySession[currSessionId]];
      },
      []
    );

    const records = combinedArray.map(nameObj => ({
      name: `${nameObj.firstName} ${nameObj.lastName}`,
    }));

    const csvStringifier = createObjectCsvStringifier({
      header: [{ id: 'name', title: '' }],
    });
    const csv = csvStringifier.stringifyRecords(records);

    res.json({ csv });
  });

export default withAuth(handler);
