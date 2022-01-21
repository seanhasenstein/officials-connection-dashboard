import { PaymentMethod, RegistrationDbFormat } from '../interfaces';
import {
  calculateTotals,
  checkForDefault,
  formatZipcode,
  removeNonDigits,
} from './misc';

export function formatRegistrationForDb(input: RegistrationDbFormat) {
  const { subtotal, total } = calculateTotals(
    input.paymentMethod as PaymentMethod,
    input.subtotal,
    input.refundAmount,
    input.discount.amount
  );

  const registration = {
    registrationId: input.registrationId,
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
    wiaaClass: checkForDefault(input.wiaaClass),
    wiaaNumber: input.wiaaNumber.trim(),
    associations: input.associations.trim(),
    foodAllergies: input.foodAllergies.trim(),
    emergencyContact: {
      name: input.emergencyContact.name.trim(),
      phone: removeNonDigits(input.emergencyContact.phone),
    },
    sessions: input.sessions,
    discount: {
      active: input.discount.active,
      name: input.discount.name,
      amount: input.discount.active ? input.discount.amount * 100 : 0,
    },
    crewMembers: input.crewMembers
      .filter((m: string) => m.trim())
      .map((m: string) => m.trim()),
    subtotal,
    total,
    paymentStatus: checkForDefault(input.paymentStatus),
    paymentMethod: checkForDefault(input.paymentMethod),
    checkNumber: input.checkNumber.trim(),
    stripeId: input.stripeId,
    refundAmount: input.refundAmount * 100,
    notes: input.notes,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };

  return registration;
}
