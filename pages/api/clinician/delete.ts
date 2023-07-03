import { NextApiResponse, NextApiRequest } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../utils/withAuth';
import database from '../../../middleware/db';
import { year } from '../../../db';
import { Db } from 'mongodb';

interface Request extends NextApiRequest {
  db: Db;
  body: {
    camp: 'Kaukauna Camp' | 'Plymouth Camp';
    id: string;
  };
}

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { camp, id } = req.body;

    if (!camp || !id) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const result = await year.removeClinician(req.db, camp, req.body.id);

    res.json(result);
  });

export default withAuth(handler);
