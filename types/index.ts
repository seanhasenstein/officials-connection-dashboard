import { NextApiRequest } from 'next';
import { Db, MongoClient, ObjectId } from 'mongodb';

export type Camps = 'Kaukauna Camp' | 'Plymouth Camp' | 'UW-Stevens Point Camp';

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
  officials: { id: string; name: string }[];
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
  registrations: Registration[];
  questionnaires: Questionnaire[];
}

export type CampLocation = {
  _id: ObjectId | string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  mapUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Camp {
  _id: ObjectId | string;
  campId: string;
  year: number;
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
  // sessions: CampSession[]; // remove for v2
  active: boolean;
  clinicians: ObjectId[] | Clinician[];
  questionnaireEmailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampSession {
  _id: ObjectId | string;
  sessionId: string; // eventually phase out
  camp: ObjectId | string | Camp;
  // camp: {
  //   campId: string;
  //   name: string;
  // };
  year: number;
  dates: string;
  times: string;
  category: SessionCategory;
  levels: string | null;
  mechanics: number;
  price: number;
  // attending: boolean; // this is only for registrations
  active: boolean;
  // isChecked?: boolean; // UI use only, add where needed
  filmedGamesEmailSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Clinician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: {
    city: string;
    state: string;
  };
}

export interface SessionWithAttachment extends CampSession {
  attachment: CloudinaryAttachment;
}

export interface HydratedSession extends CampSession {
  isReadyToSendEmail: boolean;
}

export interface SessionsQuery {
  attending: Registration[];
  notAttending: Registration[];
}

export interface RegistrationDiscount {
  active?: boolean;
  amount: number;
  name: DiscountName;
}

export interface Registration {
  id: string;
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
  sessions: CampSession[];
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations: string;
  foodAllergies: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  discounts?: RegistrationDiscount[]; // TODO: temporarily optional
  discount?: RegistrationDiscount; // TODO: temporarily included
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

export type RegistrationInput = Omit<Registration, '_id'>;

export type RegistrationForDb = Omit<Registration, '_id'>;

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { [key: string]: string | string[] };
}

type QuestionnaireOptions =
  | 'exceeded_expectations'
  | 'above_expectations'
  | 'met_expectations'
  | 'below_expectations'
  | 'did_not_meet_expectations'
  | 'not_applicable';

export interface Questionnaire {
  _id: ObjectId | string;
  year: number;
  camp: ObjectId | string;
  session: ObjectId | string;
  official: ObjectId | string;
  overall: {
    registration: QuestionnaireOptions;
    checkin: QuestionnaireOptions;
    facility: QuestionnaireOptions;
    classroom: QuestionnaireOptions;
    clinicians: QuestionnaireOptions;
    competition: QuestionnaireOptions;
    film: QuestionnaireOptions;
    communication: QuestionnaireOptions;
    meals: QuestionnaireOptions;
    comments: string;
    improvements: string;
  };
  classroom: {
    materials: QuestionnaireOptions;
    interpersonal: QuestionnaireOptions;
    knowledge: QuestionnaireOptions;
    organization: QuestionnaireOptions;
    relevance: QuestionnaireOptions;
    favorite: string;
    comments: string;
    topics: string;
  };
  oncourt: {
    evaluations: QuestionnaireOptions;
    interpersonal: QuestionnaireOptions;
    receptiveness: QuestionnaireOptions;
    reinforcement: QuestionnaireOptions;
    raise: QuestionnaireOptions;
    clinician: string;
    comments: string;
  };
  testimonial: string;
  createdAt: Date;
  updatedAt: Date;
}

// API version 2 ***************************************************

export type UserRole = 'admin' | 'clinician' | 'official';

export type User = {
  _id: ObjectId | string;
  email: string; // unique
  phone: string; // unique
  roles: UserRole[];
  // primaryRole: UserRole; // potential future use

  // Profile
  firstName: string;
  lastName: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zipcode: string;
  };

  // Official Info
  wiaaClass: WiaaClass;
  wiaaNumber: string;
  associations?: string;
  foodAllergies?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };

  // Auth preferences (optional, for future use)
  // preferredAuthMethod?: 'email' | 'sms';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};

export type RegistrationV2 = {
  // Id's
  _id: ObjectId | string;
  receiptId: string;

  // Linked user
  user: User | ObjectId | string;

  // Camp-specific data
  year: number;
  sessions: Array<{
    sessionId: ObjectId | string;
    session?: CampSession; // Optional - populated on frontend
    attending: boolean;

    // Camp snapshot for this session
    camp: {
      campId: ObjectId | string;
      year: number;
      name: string;
      dates: string;
    };

    // Session snapshot
    registeredAs: {
      dates: string;
      times: string;
      category: SessionCategory;
      levels: string;
      mechanics: number;
      price: number;
    };
  }>;

  crewMembers: string[];

  // Financial
  discounts?: RegistrationDiscount[];
  subtotal: number;
  total: number;
  refundAmount: number;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  checkNumber?: string;
  stripeId: string | null;

  // Metadata
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
};
