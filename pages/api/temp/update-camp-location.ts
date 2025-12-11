import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Camp, CampLocation, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allCamps = await req.db.collection<Camp>('camps').find({}).toArray();

    for (const camp of allCamps) {
      const campLocation = await req.db
        .collection<CampLocation>('campLocations')
        .findOne({
          name: camp.location.name,
        });

      if (campLocation) {
        await req.db.collection('camps').updateOne(
          { _id: camp._id },
          {
            $set: {
              location: campLocation._id,
            },
          }
        );

        console.log(
          `Updated camp ${camp.name} with location ${campLocation.name}`
        );
      } else {
        console.log(
          `No camp location found for camp ${camp.name} with location name ${camp.location.name}`
        );
      }
    }

    res.send({
      success: true,
    });
  });

export default withAuth(handler);
