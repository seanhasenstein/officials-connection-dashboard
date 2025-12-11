import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { withAuth } from '../../../utils/withAuth';

import database from '../../../middleware/db';

import { Camp, Request } from '../../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const allCamps = await req.db.collection<Camp>('camps').find({}).toArray();

    for (const camp of allCamps) {
      if (camp.clinicians) {
        for (const clinician of camp.clinicians) {
          if (typeof clinician === 'object' && 'email' in clinician) {
            const user = await req.db
              .collection('users')
              .findOne({ email: clinician.email });

            if (user) {
              await req.db.collection('camps').updateOne(
                { _id: camp._id },
                {
                  $set: {
                    'clinicians.$[elem]': user._id,
                  },
                },
                {
                  arrayFilters: [{ 'elem.email': clinician.email }],
                }
              );

              console.log(
                `Updated clinician ${clinician.email} to user ID ${user._id} in camp ${camp.name}`
              );
            }
          }
        }
      }
    }

    res.send({ success: true });
  });

export default withAuth(handler);
