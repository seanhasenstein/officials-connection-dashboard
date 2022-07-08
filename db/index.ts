import { mongoClientPromise } from './connect';
import * as registration from './registration';
import * as year from './year';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb, registration, year };
