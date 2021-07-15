import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../middleware/db';
import { registrations } from '../../db';
import { Request } from '../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const data = await registrations.updateFilmedGames(
        req.db,
        req.body.registrationId,
        req.body.sessionId,
        req.body.filmedGames
      );
      res.json({ game: data });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
