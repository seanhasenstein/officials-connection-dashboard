import { NextApiResponse } from 'next';
import nc from 'next-connect';
import database from '../../../middleware/db';
import { withAuth } from '../../../utils/withAuth';
import { Game, Request } from '../../../interfaces';
import { game, registration } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const id = req.body;

    await registration.deleteRegistration(req.db, id);

    const gamesQuery = await game.getGames(req.db, {});

    gamesQuery.forEach((g: Game) => {
      g.officials?.forEach(o => {
        if (o.rid === id) {
          const updatedOfficials = g.officials
            ? g.officials.filter(v => v.rid !== id)
            : [];
          game.updateGameOfficials(req.db, g._id, updatedOfficials);
        }
      });
    });

    res.json({ success: true });
  });

export default withAuth(handler);
