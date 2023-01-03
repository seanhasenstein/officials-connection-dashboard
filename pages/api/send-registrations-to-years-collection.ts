import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../middleware/db';
import { Request, Registration } from '../../types';
import { withAuth } from '../../utils/withAuth';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const data = await req.db
      .collection<Registration>('registrations')
      .find({});

    const registrations = await data.toArray();

    const formattedRegistrations = registrations.map((r: any) => {
      const { _id, id, registrationId, ...rest } = r;

      return {
        id: registrationId,
        ...rest,
      };
    });

    const updatedYear = await req.db
      .collection('years')
      .findOneAndUpdate(
        { year: '2022' },
        { $set: { registrations: formattedRegistrations } },
        { returnDocument: 'after' }
      );

    res.json({
      year: updatedYear.value,
    });
  });

export default withAuth(handler);
