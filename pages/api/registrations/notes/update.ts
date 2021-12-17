import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../../utils/withAuth';
import database from '../../../../middleware/db';
import { registrations } from '../../../../db';
import { Request, Note } from '../../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const notes: Note[] = req.body.notes;
    const result = await registrations.updateRegistration(req.db, req.body.id, {
      notes,
    });
    res.send({ registration: result });
  });

export default withAuth(handler);
