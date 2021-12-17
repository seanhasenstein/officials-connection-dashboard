import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectToDb } from '../../../db';

async function clientPromise() {
  const { dbClient } = await connectToDb();
  return dbClient;
}

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.NEXTAUTH_EMAIL_SERVER,
      from: process.env.NEXTAUTH_EMAIL_FROM,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise()),
  callbacks: {
    async signIn(context) {
      const allowedEmailAccounts = [
        'wbyoc@officialsconnection.org',
        'seanhasenstein@gmail.com',
      ];
      if (
        context.user.email &&
        allowedEmailAccounts.includes(context.user.email)
      ) {
        return true;
      } else {
        return '/unauthorized';
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/authentication-error',
    verifyRequest: '/verify-login',
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
});
