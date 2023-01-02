import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export type ActiveOption = 'filter' | 'sort' | undefined;

export type FilterOptions = {
  paymentStatus: string[];
  sessions: string[];
};

type SessionCategory = "Men's College" | "Women's College" | 'High School';

export type WiaaClass =
  | 'default'
  | 'Master'
  | 'L5'
  | 'L4'
  | 'L3'
  | 'L2'
  | 'L1'
  | 'L0'
  | 'LR'
  | 'New'
  | '';

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

export interface CloudinaryAttachment {
  public_id: string;
  filename: string;
  url: string;
  secure_url: string;
  session_ids: string | undefined;
}

export type DiscountName =
  | 'HSCREW'
  | 'TOURNAMENT'
  | 'EASTER'
  | 'MEMORIAL'
  | 'OTHER'
  | '';

export type SortOrder = 'ascending' | 'descending';

export type SortVariable = 'lastName' | 'date';

export interface FilmedGame {
  id: string;
  camp: string;
  sessions: string[];
  name: string;
  url: string;
  officials: { _id: string; name: string }[];
  clinicians: string;
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
  filmedGames: FilmedGame[];
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
  questionnaireEmailSent: boolean;
  createdAt: string;
  updatedAt: string;
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
  filmedGamesEmailSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionWithAttachment extends Session {
  attachment: CloudinaryAttachment;
}

export interface HydratedSession extends Session {
  isReadyToSendEmail: boolean;
}

export interface SessionsQuery {
  attending: Registration[];
  notAttending: Registration[];
}

export interface RegistrationDiscount {
  active: boolean;
  name: DiscountName;
  amount: number;
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
  sessions: Session[];
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations: string;
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  discount: RegistrationDiscount;
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

export type TemporaryDiscountName = 'default' | 'hscrew' | 'other' | 'skip';

export interface RegistrationInput extends Omit<Registration, '_id'> {
  temporaryDiscountName: TemporaryDiscountName;
}

export type RegistrationForDb = Omit<Registration, '_id'>;

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { [key: string]: string | string[] };
}
