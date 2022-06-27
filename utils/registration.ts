import {
  PaymentMethod,
  PaymentStatus,
  RegistrationForDb,
  RegistrationDiscount,
  RegistrationInput,
  Session,
  TemporaryDiscountName,
  WiaaClass,
  DiscountName,
} from '../interfaces';
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

function formatDiscountName(
  discount: RegistrationDiscount,
  temporaryDiscountName: TemporaryDiscountName
) {
  if (discount.active === false || temporaryDiscountName === 'default') {
    return '';
  }

  if (temporaryDiscountName === 'hscrew') {
    return 'HSCREW';
  }

  return discount.name.toUpperCase();
}

export function formatRegistrationForDb(
  input: RegistrationInput,
  serverSessions: Session[]
) {
  const {
    paymentMethod,
    subtotal: inputSubtotal,
    refundAmount,
    discount,
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
    discount.amount
  );
  const timestamp = new Date().toISOString();

  const registrationForDb: RegistrationForDb = {
    registrationId:
      input.registrationId === '' ? createIdNumber() : input.registrationId,
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
    discount: {
      active: input.discount.active,
      name: formatDiscountName(
        input.discount,
        input.temporaryDiscountName
      ) as DiscountName,
      amount: input.discount.active ? input.discount.amount * 100 : 0,
    },
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
