import { NextApiResponse } from 'next';
import { NextConnect } from 'next-connect';
import { getServerSession } from 'next-auth';

import { authOptions } from 'pages/api/auth/[...nextauth]';
import { Request } from 'types';

export function withAuth(
  originalHandler: NextConnect<Request, NextApiResponse>
) {
  return async function handler(req: Request, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    return originalHandler(req, res);
  };
}
