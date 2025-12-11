import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Camp, CampLocation, Request } from '../../../types';

type CampLocationWithoutId = Omit<CampLocation, '_id'>;

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allCamps = await req.db.collection<Camp>('camps').find({}).toArray();

    for (const camp of allCamps) {
      const existingLocation = await req.db
        .collection('campLocations')
        .findOne({
          name: camp.location.name,
        });

      if (!existingLocation) {
        const newLocation: CampLocationWithoutId = {
          name: camp.location.name,
          street: camp.location.street,
          city: camp.location.city,
          state:
            camp.location.state === 'Wisconsin' ? 'WI' : camp.location.state,
          zipcode: camp.location.zipcode,
          mapUrl: camp.location.mapUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await req.db
          .collection('campLocations')
          .insertOne(newLocation);

        console.log(
          `Inserted camp location ${newLocation.name} with id ${result.insertedId}`
        );
      }
    }

    res.send({
      success: true,
    });
  });

export default withAuth(handler);
