import * as crypto from 'crypto';
import { format, formatISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  Game,
  PaymentMethod,
  Registration,
  Session,
  SessionsQuery,
} from '../interfaces';

export function getCampAbbreviation(camp: string) {
  return camp === 'Kaukauna' ? 'Kau' : camp === 'Plymouth' ? 'Ply' : '';
}

export function getUrlParam(param: string | string[] | undefined) {
  if (!param) return '';
  return Array.isArray(param) ? param[0] : param;
}

export function checkForDefault<T>(value: 'default' | T) {
  return value === 'default' ? '' : value;
}

export function removeNonDigits(input: string) {
  return input.replace(/\D/g, '');
}

export function formatToMoney(input: number, includeDecimal = false) {
  const price = input / 100;

  if (includeDecimal) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price}`;
  }
}

export function getCategoryAbbreviation(category: string) {
  return category === "Men's College"
    ? 'MC'
    : category === "Women's College"
    ? 'WC'
    : category === 'High School'
    ? 'HS'
    : '';
}

function getSessionDays(dates: string) {
  const array = dates.split(' ');
  const filteredArray = array.filter(
    t => t === 'Fri' || t === 'Sat' || t === 'Sun'
  );
  return filteredArray.length === 1
    ? filteredArray[0]
    : `${filteredArray[0]}/${filteredArray[1]}`;
}

export function formatSessionName(session: Session) {
  const camp = getCampAbbreviation(session.camp.name);
  const category = getCategoryAbbreviation(session.category);
  const days = getSessionDays(session.dates);
  const levels = session.levels ? ` (${session.levels})` : '';

  return `${camp} ${category} ${days}${levels}`;
}

export function formatSessionNameFromId(sessions: Session[], id: string) {
  const session = sessions.find(s => s.sessionId === id);
  if (session) {
    return formatSessionName(session);
  }
}

export function formatGameName(game: Game) {
  const camp = getCampAbbreviation(game.camp);
  const category = getCategoryAbbreviation(game.category);
  const timestamp = format(new Date(game.date), 'EEE @ h:mmaaa');
  const court = game.court;

  return `${camp} ${category} ${timestamp} - ${court}`;
}

export function formatPhoneNumber(input: string) {
  const digits = removeNonDigits(input);
  const digitsArray = digits.split('');
  return digitsArray
    .map((v, i) => {
      if (i === 0) return `(${v}`;
      if (i === 2) return `${v}) `;
      if (i === 5) return `${v}-`;
      return v;
    })
    .join('');
}

export function formatZipcode(input: string) {
  const digits = removeNonDigits(input);
  const digitsArray = digits.split('');
  return digitsArray.filter((_d, i) => i < 5).join('');
}

export function formatGameDate(date: string, time: string) {
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(3));
  const timezone = 'America/Chicago';
  const zonedTime = utcToZonedTime(date, timezone);
  zonedTime.setHours(hour, minute);
  return formatISO(zonedTime);
}

export function verifySelectedSessions(
  unverifiedSessions: Session[],
  serverSessions: Session[]
) {
  const verifiedSessions = unverifiedSessions.reduce(
    (acc: Session[], currSession: Session) => {
      if (currSession.isChecked) {
        const session = serverSessions.find(
          s => s.sessionId === currSession.sessionId
        );

        if (!session) return acc;

        const { isChecked, active, createdAt, updatedAt, ...formattedSession } =
          currSession;
        return [...acc, { ...formattedSession }];
      }

      return acc;
    },
    []
  );

  return verifiedSessions;
}

export function sessionReducer(
  registrations: Registration[],
  sessionId: string | undefined
) {
  return registrations.reduce(
    (acc: SessionsQuery, currReg) => {
      const session = currReg.sessions.find(s => s.sessionId === sessionId);

      if (session) {
        session.attending
          ? acc.attending.push(currReg)
          : acc.notAttending.push(currReg);
      }

      return acc;
    },
    { attending: [], notAttending: [] }
  );
}

export function sortString(
  array: any[],
  primary: string,
  secondary = '',
  direction: 'ascending' | 'descending'
) {
  if (direction === 'ascending') {
    return array.sort((a, b) => {
      if (a[primary] === b[primary]) {
        return a[secondary] < b[secondary] ? -1 : 1;
      }
      return a[primary] < b[primary] ? -1 : 1;
    });
  } else {
    return array.sort((a, b) => {
      if (a[primary] === b[primary]) {
        return a[secondary] < b[secondary] ? 1 : -1;
      }
      return a[primary] < b[primary] ? 1 : -1;
    });
  }
}

function calculateSubtotal(paymentMethod: PaymentMethod, subtotal: number) {
  if (paymentMethod === 'free') {
    return 0;
  }

  return subtotal * 100;
}

function calculateTotal(
  paymentMethod: PaymentMethod,
  subtotal: number,
  refundAmount: number,
  discountAmount: number
) {
  if (paymentMethod === 'free') {
    return 0;
  }

  return (subtotal - refundAmount - discountAmount) * 100;
}

export function calculateTotals(
  paymentMethod: PaymentMethod,
  subtotal: number,
  refundAmount: number,
  discountAmount: number
) {
  const s = calculateSubtotal(paymentMethod, subtotal);
  const t = calculateTotal(
    paymentMethod,
    subtotal,
    refundAmount,
    discountAmount
  );
  return { subtotal: s, total: t };
}

const NUM = '0123456789';

export function createIdNumber() {
  const rnd = crypto.randomBytes(11);
  const value = new Array(11);
  const charsLength = NUM.length;

  for (let i = 0; i < value.length; i++) {
    if (i === 5) {
      value[5] = '-';
    } else {
      value[i] = NUM[rnd[i] % charsLength];
    }
  }

  return value.join('');
}

export function splitCamelCase(term: string) {
  return term.split(/(?=[A-Z])/).join(' ');
}

export const stateList = [
  { value: 'AK', text: 'Alaska' },
  { value: 'AL', text: 'Alabama' },
  { value: 'AR', text: 'Arkansas' },
  { value: 'AS', text: 'American Samoa' },
  { value: 'AZ', text: 'Arizona' },
  { value: 'CA', text: 'California' },
  { value: 'CO', text: 'Colorado' },
  { value: 'CT', text: 'Connecticut' },
  { value: 'DC', text: 'District of Columbia' },
  { value: 'DE', text: 'Delaware' },
  { value: 'FL', text: 'Florida' },
  { value: 'GA', text: 'Georgia' },
  { value: 'GU', text: 'Guam' },
  { value: 'HI', text: 'Hawaii' },
  { value: 'IA', text: 'Iowa' },
  { value: 'ID', text: 'Idaho' },
  { value: 'IL', text: 'Illinois' },
  { value: 'IN', text: 'Indiana' },
  { value: 'KS', text: 'Kansas' },
  { value: 'KY', text: 'Kentucky' },
  { value: 'LA', text: 'Louisiana' },
  { value: 'MA', text: 'Massachusetts' },
  { value: 'MD', text: 'Maryland' },
  { value: 'ME', text: 'Maine' },
  { value: 'MI', text: 'Michigan' },
  { value: 'MN', text: 'Minnesota' },
  { value: 'MO', text: 'Missouri' },
  { value: 'MS', text: 'Mississippi' },
  { value: 'MT', text: 'Montana' },
  { value: 'NC', text: 'North Carolina' },
  { value: 'ND', text: 'North Dakota' },
  { value: 'NE', text: 'Nebraska' },
  { value: 'NH', text: 'New Hampshire' },
  { value: 'NJ', text: 'New Jersey' },
  { value: 'NM', text: 'New Mexico' },
  { value: 'NV', text: 'Nevada' },
  { value: 'NY', text: 'New York' },
  { value: 'OH', text: 'Ohio' },
  { value: 'OK', text: 'Oklahoma' },
  { value: 'OR', text: 'Oregon' },
  { value: 'PA', text: 'Pennsylvania' },
  { value: 'PR', text: 'Puerto Rico' },
  { value: 'RI', text: 'Rhode Island' },
  { value: 'SC', text: 'South Carolina' },
  { value: 'SD', text: 'South Dakota' },
  { value: 'TN', text: 'Tennessee' },
  { value: 'TX', text: 'Texas' },
  { value: 'UT', text: 'Utah' },
  { value: 'VA', text: 'Virginia' },
  { value: 'VI', text: 'Virgin Islands' },
  { value: 'VT', text: 'Vermont' },
  { value: 'WA', text: 'Washington' },
  { value: 'WI', text: 'Wisconsin' },
  { value: 'WV', text: 'West Virginia' },
  { value: 'WY', text: 'Wyoming' },
];
