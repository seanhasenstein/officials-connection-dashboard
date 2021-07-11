export interface FilmedGame {
  _id: string;
  camp?: 'kaukauna' | 'plymouth';
  session?: 'hs' | 'mc' | 'wc';
  day?: 'friday' | 'saturday' | 'sunday';
  abbreviation: string;
  name: string;
  clinician: string;
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
  attending: boolean;
  filmedGames: FilmedGame[];
}

export interface Registration {
  _id?: string;
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
