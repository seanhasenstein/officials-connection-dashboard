import { NextApiResponse } from 'next';
import nc from 'next-connect';
import cloudinary from 'cloudinary';
import { Request } from '../../types';
import { withAuth } from '../../utils/withAuth';

const handler = nc<Request, NextApiResponse>().get(async (req, res) => {
  if (!process.env.CLOUDINARY_SECRET) {
    res.status(500).json({ error: 'Cloudinary secret not provided.' });
    return;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp,
      public_id: req.query.public_id,
      metadata: req.query.metadata,
    },
    process.env.CLOUDINARY_SECRET
  );

  res.status(200).json({ signature, timestamp });
});

export default withAuth(handler);
