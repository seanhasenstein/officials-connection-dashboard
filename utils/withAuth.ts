import { NextApiResponse } from 'next';
import { NextConnect } from 'next-connect';
import { getSession } from 'next-auth/react';
import { Request } from '../types';

export function withAuth(
  originalHandler: NextConnect<Request, NextApiResponse<any>>
) {
  return async function handler(req: Request, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    return originalHandler(req, res);
  };
}
