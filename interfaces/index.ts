import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export type ActiveOption = 'filter' | 'sort' | undefined;

export type FilterOptions = { paymentStatus: string[]; sessions: string[] };

type Camp = 'Kaukauna' | 'Plymouth';

type SessionCategory = "Men's College" | "Women's College" | 'High School';

export type GameCategory =
  | "Men's College"
  | "Women's College"
  | 'High School'
  | 'Mixed';

type WiaaClass =
  | 'default'
  | 'Master'
  | 'L5'
  | 'L4'
  | 'L3'
  | 'L2'
  | 'L1'
  | 'LR'
  | 'New';

type PaymentStatus =
  | 'default'
  | 'paid'
  | 'unpaid'
  | 'fullyRefunded'
  | 'partiallyRefunded';

export type PaymentMethod =
  | 'default'
  | 'unpaid'
  | 'card'
  | 'check'
  | 'cash'
  | 'free';

export type SortOrder = 'ascending' | 'descending';

export type SortVariable = 'lastName' | 'date';

export interface GameOfficial {
  key: string;
  name: string;
  rid: string;
  sid: string;
  sessionName: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  camp: Camp;
  category: GameCategory;
  date: string;
  court: string;
  clinician: string;
  url: string;
  filmed: 'true' | 'false';
  officials?: GameOfficial[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GameInput extends Omit<Game, '_id'> {
  time: string;
}

export interface Session {
  id: string;
  camp: Camp;
  dates: string;
  times: string;
  category: SessionCategory;
  levels?: string;
  mechanics?: number;
  price: number;
  attending?: boolean;
  isChecked?: boolean;
}

export interface SessionsQuery {
  attending: Registration[];
  notAttending: Registration[];
}

export interface Registration {
  _id: string;
  registrationId: string;
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
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations: string;
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  discount: boolean;
  crewMembers: string[];
  sessions: Session[];
  subtotal: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  checkNumber?: string;
  refundAmount: number;
  notes: Note[];
  stripeId: string;
  createdAt: string;
  updatedAt: string;
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
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations: string;
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  discount: string;
  crewMembers: string[];
  paymentAmount: number | string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  checkNumber: string;
  refundAmount: number | string;
  notes: Note[];
}

export type RegistrationUpdate = Partial<Registration>;

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { [key: string]: string | string[] };
}
