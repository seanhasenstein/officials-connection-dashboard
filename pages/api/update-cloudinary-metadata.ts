import { NextApiResponse } from 'next';
import nc from 'next-connect';
import cloudinary from 'cloudinary';
import { withAuth } from '../../utils/withAuth';
import database from '../../middleware/db';
import { Request } from '../../types';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    if (!req.query.public_id) {
      res
        .status(500)
        .json({ error: 'public_id query parameter not provided.' });
      return;
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_NAME) {
      res.status(500).json({ error: 'Cloudinary cloud_name not provided.' });
      return;
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_KEY) {
      res.status(500).json({ error: 'Cloudinary api_key not provided.' });
      return;
    }

    if (!process.env.CLOUDINARY_SECRET) {
      res.status(500).json({ error: 'Cloudinary api_secret not provided.' });
      return;
    }

    await cloudinary.v2.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });

    const public_id = Array.isArray(req.query.public_id)
      ? [req.query.public_id[0]]
      : [req.query.public_id];

    cloudinary.v2.uploader.update_metadata(
      `session_ids=${req.query.metadata}`,
      public_id,
      { resource_type: 'raw' },
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error });
        } else {
          res.json({ success: true, result });
        }
      }
    );
  });

export default withAuth(handler);
