import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { createObjectCsvStringifier } from 'csv-writer';

import database from '../../middleware/db';
import { year, registration } from '../../db';

import { withAuth } from '../../utils/withAuth';
import { formatSessionName } from 'utils/misc';

import { currentYearString } from 'constants/currentYear';

import { Request } from '../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const sessions = await year.getSessions(req.db, currentYearString);

    if (!sessions) {
      throw new Error('Failed to find the server sessions');
    }

    const registrations = await registration.getAllRegistrationsForYear(
      req.db,
      currentYearString
    );

    if (!registrations) {
      throw new Error('Failed to find the server registrations');
    }

    const sessionIdsArray = sessions?.map(s => s.sessionId);
    const sessionsAccumulator: Record<string, RegObjType[]> =
      sessionIdsArray?.reduce((accumulator, currentId) => {
        return { ...accumulator, [currentId]: [] };
      }, {} as Record<string, RegObjType[]>);

    type RegObjType = {
      firstName: string;
      lastName: string;
      city: string;
      wiaaNumber: string;
      sessionName: string;
    };

    const namesBySession = registrations.reduce(
      (acc: Record<string, RegObjType[]>, cr) => {
        cr.sessions.forEach(s => {
          if (s.attending) {
            const regObj = {
              firstName: cr.firstName,
              lastName: cr.lastName,
              city: cr.address.city,
              wiaaNumber: cr.wiaaNumber,
              sessionName: formatSessionName(s),
            };
            acc[s.sessionId] = [...acc[s.sessionId], regObj, regObj]; // two times
            // acc[s.sessionId] = [...acc[s.sessionId], regObj, regObj, regObj]; // three times
            acc[s.sessionId].sort((a: RegObjType, b: RegObjType) => {
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
      (acc: RegObjType[], currSessionId) => {
        return [...acc, ...namesBySession[currSessionId]];
      },
      []
    );

    const records = combinedArray.map(regObj => ({
      name: `${regObj.firstName} ${regObj.lastName}`,
      blankOne: '',
      city: regObj.city,
      blankTwo: '',
      wiaaNumber: regObj.wiaaNumber,
      sessionName: regObj.sessionName,
    }));

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: '' },
        { id: 'blankOne', title: '' },
        { id: 'city', title: '' },
        { id: 'blankTwo', title: '' },
        { id: 'wiaaNumber', title: '' },
        { id: 'sessionName', title: '' },
      ],
    });
    const csv = csvStringifier.stringifyRecords(records);

    res.json({ csv });
  });

export default withAuth(handler);
