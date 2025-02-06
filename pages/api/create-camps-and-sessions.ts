import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { Camp, Request } from '../../types';
import { year } from '../../db';
import { createId } from '../../utils/misc';
import { currentYearString } from 'constants/currentYear';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const now = new Date().toISOString();

    const kaukaunaCampId = createId('camp');

    const kaukaunaCamp: Camp = {
      campId: kaukaunaCampId,
      name: 'Kaukauna Camp',
      dates: 'June 14th, 15th, & 16th',
      location: {
        name: 'Kaukauna High School',
        street: '1701 County Rd CE',
        city: 'Kaukauna',
        state: 'Wisconsin',
        zipcode: '54130',
        mapUrl: 'https://goo.gl/maps/4vFUHu7iFHhVEzik7',
      },
      sessions: [
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'Master & L5',
          mechanics: 3,
          dates: 'Fri 6/14',
          times: '10am-8pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'Master, L5, & L4',
          mechanics: 3,
          dates: 'Sat 6/15',
          times: '8am-6pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'All Levels 2-Person',
          mechanics: 2,
          dates: 'Sat 6/15',
          times: '12pm-9pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'All Levels 3-Person',
          mechanics: 3,
          dates: 'Sat 6/15',
          times: '12pm-9pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'All Levels 2-Person',
          mechanics: 2,
          dates: 'Sun 6/16',
          times: '8pm-5pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: kaukaunaCampId,
            name: 'Kaukauna',
          },
          category: 'High School',
          levels: 'All Levels 3-Person',
          mechanics: 3,
          dates: 'Sun 6/16',
          times: '8am-5pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      clinicians: [],
      active: true,
      questionnaireEmailSent: false,
      createdAt: now,
      updatedAt: now,
    };

    const plymouthCampId = createId('camp');

    const plymouthCamp: Camp = {
      campId: plymouthCampId,
      name: 'Plymouth Camp',
      dates: 'June 28th, 29th, & 30th',
      location: {
        name: 'Plymouth Middle School',
        street: '300 Riverside Cir',
        city: 'Plymouth',
        state: 'Wisconsin',
        zipcode: '53073',
        mapUrl: 'https://goo.gl/maps/mA54rZksnWVvkqCB7',
      },
      sessions: [
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'Master & L5',
          mechanics: 3,
          dates: 'Fri 6/28',
          times: '10am-8pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: "Women's College",
          levels: 'College',
          mechanics: 3,
          dates: 'Sat 6/29',
          times: '8am-6pm',
          price: 9000,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'Master, L5, & L4',
          mechanics: 3,
          dates: 'Sat 6/29',
          times: '8am-6pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'All Levels 2-Person',
          mechanics: 2,
          dates: 'Sat 6/29',
          times: '12pm-9pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'All Levels 3-Person',
          mechanics: 3,
          dates: 'Sat 6/29',
          times: '12pm-9pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: "Women's College",
          levels: 'College',
          mechanics: 3,
          dates: 'Sun 6/30',
          times: '8am-6pm',
          price: 9000,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'All Levels 2-Person',
          mechanics: 2,
          dates: 'Sun 6/30',
          times: '8pm-5pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          sessionId: createId('session'),
          camp: {
            campId: plymouthCampId,
            name: 'Plymouth',
          },
          category: 'High School',
          levels: 'All Levels 3-Person',
          mechanics: 3,
          dates: 'Sun 6/30',
          times: '8am-5pm',
          price: 2500,
          active: true,
          filmedGamesEmailSent: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      clinicians: [],
      active: true,
      questionnaireEmailSent: false,
      createdAt: now,
      updatedAt: now,
    };

    const yearData = await year.updateYear(req.db, currentYearString, {
      camps: [kaukaunaCamp, plymouthCamp],
    });

    res.send({ yearData });
  });

export default withAuth(handler);
