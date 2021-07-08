import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../middleware/db';
import { film } from '../../db';
import { Request } from '../../interfaces/api';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const data = await film.addGameToFilmSchedule(req.db, req.body);
      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
