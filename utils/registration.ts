import {
  PaymentMethod,
  PaymentStatus,
  RegistrationForDb,
  RegistrationInput,
  Session,
  WiaaClass,
} from '../types';
import {
  calculateTotals,
  checkForDefault,
  createIdNumber,
  formatZipcode,
  removeNonDigits,
} from './misc';

function verifySelectedSessions(
  unverifiedSessions: Session[],
  serverSessions: Session[]
) {
  const verifiedSessions = unverifiedSessions.reduce(
    (acc: Session[], currUnverifiedSession: Session) => {
      if (currUnverifiedSession.isChecked) {
        const session = serverSessions.find(
          serverSession =>
            serverSession.sessionId === currUnverifiedSession.sessionId
        );

        if (!session) return acc;

        const { isChecked, active, createdAt, updatedAt, ...formattedSession } =
          currUnverifiedSession;
        return [...acc, { ...formattedSession }];
      }

      return acc;
    },
    []
  );

  return verifiedSessions;
}

export function formatRegistrationForDb(
  input: RegistrationInput,
  serverSessions: Session[]
) {
  const {
    paymentMethod,
    subtotal: inputSubtotal,
    refundAmount,
    discounts = [],
  } = input;
  const selectedSessions = input.sessions.filter(session => session.isChecked);
  const verifiedSessions = verifySelectedSessions(
    selectedSessions,
    serverSessions
  );
  const { subtotal, total } = calculateTotals(
    paymentMethod,
    inputSubtotal,
    refundAmount,
    discounts
  );
  const timestamp = new Date().toISOString();

  const registrationForDb: RegistrationForDb = {
    id: input.id === '' ? createIdNumber() : input.id,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.toLowerCase().trim(),
    phone: removeNonDigits(input.phone),
    address: {
      street: input.address.street.trim(),
      street2: input.address.street2.trim(),
      city: input.address.city.trim(),
      state: checkForDefault(input.address.state),
      zipcode: formatZipcode(input.address.zipcode),
    },
    sessions: verifiedSessions,
    wiaaClass: checkForDefault(input.wiaaClass.trim() as WiaaClass),
    wiaaNumber: input.wiaaNumber.trim(),
    associations: input.associations.trim(),
    foodAllergies: input.foodAllergies.trim(),
    emergencyContact: {
      name: input.emergencyContact.name.trim(),
      phone: removeNonDigits(input.emergencyContact.phone),
    },
    discounts: input.discounts || [],
    crewMembers: input.crewMembers,
    subtotal,
    total,
    paymentStatus: checkForDefault(input.paymentStatus) as PaymentStatus,
    paymentMethod: checkForDefault(input.paymentMethod) as PaymentMethod,
    checkNumber: input.checkNumber,
    refundAmount: input.refundAmount,
    notes: input.notes,
    stripeId: input.stripeId ? input.stripeId : null,
    createdAt: input.createdAt === '' ? timestamp : input.createdAt,
    updatedAt: timestamp,
  };

  return registrationForDb;
}
