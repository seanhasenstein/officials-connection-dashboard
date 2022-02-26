import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export type ActiveOption = 'filter' | 'sort' | undefined;

export type FilterOptions = { paymentStatus: string[]; sessions: string[] };

type SessionCategory = "Men's College" | "Women's College" | 'High School';

export type GameCategory =
  | "Men's College"
  | "Women's College"
  | 'High School'
  | 'Mixed';

export type WiaaClass =
  | 'default'
  | 'Master'
  | 'L5'
  | 'L4'
  | 'L3'
  | 'L2'
  | 'L1'
  | 'LR'
  | 'New';

export type PaymentStatus =
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

type Discount = 'HSCREW' | 'TOURNAMENT';

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

export interface Year {
  _id: string;
  year: string;
  camps: Camp[];
}

export interface Camp {
  campId: string;
  name: string;
  dates: string;
  location: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    mapUrl: string;
  };
  sessions: Session[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  camp: 'Kaukauna' | 'Plymouth';
  category: GameCategory;
  date: string;
  court: string;
  clinician: string;
  url: string;
  filmed: 'true' | 'false';
  officials: GameOfficial[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GameInput extends Omit<Game, '_id'> {
  time: string;
}

export interface Session {
  sessionId: string;
  camp: {
    campId: string;
    name: string;
  };
  dates: string;
  times: string;
  category: SessionCategory;
  levels: string | null;
  mechanics: number;
  price: number;
  attending: boolean;
  active?: boolean;
  isChecked?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  sessions: Session[];
  discount: {
    active: boolean;
    name: Discount;
    amount: number;
  };
  crewMembers: string[];
  subtotal: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  checkNumber?: string;
  refundAmount: number;
  notes: Note[];
  stripeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  registrationId?: string;
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
  sessions: Session[];
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations: string;
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  discount: {
    active: boolean;
    name: string;
    amount: number;
  };
  crewMembers: string[];
  subtotal: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  checkNumber: string;
  refundAmount: number;
  notes: Note[];
}

export interface RegistrationDbFormat
  extends Omit<
    RegistrationInput,
    'wiaaClass' | 'paymentStatus' | 'paymentMethod'
  > {
  registrationId: string;
  wiaaClass: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  stripeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationUpdate = Partial<RegistrationDbFormat>;

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { [key: string]: string | string[] };
}
