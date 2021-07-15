import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export interface Game {
  _id?: string;
  camp?: string;
  session?: string;
  day?: string;
  abbreviation: string;
  name: string;
  clinician?: string;
  url: string;
}

export interface Session {
  id: string;
  name: string;
  location: string;
  dates: string[];
  approxTimes: string;
  category: string;
  levels: string[];
  mechanics: number;
  price: number;
  isChecked: boolean;
  attending?: boolean;
  filmedGames?: Game[];
}

export interface Registration {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  wiaaInformation: {
    wiaaClass: string;
    wiaaNumber: string;
    associations: string;
  };
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  sessions: Session[];
  hsCrewDeal: boolean;
  crewMembers: string[];
  subtotal: number;
  total: number;
  paymentStatus: 'succeeded' | 'fully_refunded' | 'unpaid';
  paymentMethod: string;
  checkNumber?: string;
  notes?: string[];
  stripeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  wiaaInformation: {
    wiaaClass: string;
    wiaaNumber: string;
    associations: string;
  };
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  sessions: string[];
  hsCrewDeal: string;
  crewMembers: string[];
  paymentStatus: string;
  paymentMethod: string;
  checkNumber?: string;
  notes?: string | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { [key: string]: string | string[] };
}
