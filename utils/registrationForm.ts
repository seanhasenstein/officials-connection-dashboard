import * as Yup from 'yup';
import { RegistrationInput } from '../types';
import { removeNonDigits } from './misc';

export const initialValues: RegistrationInput = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    street2: '',
    city: '',
    state: 'default',
    zipcode: '',
  },
  sessions: [],
  wiaaClass: 'default',
  wiaaNumber: '',
  associations: '',
  foodAllergies: '',
  emergencyContact: { name: '', phone: '' },
  crewMembers: ['', ''],
  subtotal: 0,
  total: 0,
  refundAmount: 0,
  discount: {
    active: false,
    name: '',
    amount: 0,
  },
  temporaryDiscountName: 'default',
  paymentStatus: 'default',
  paymentMethod: 'default',
  checkNumber: '',
  notes: [],
  stripeId: null,
  updatedAt: '',
  createdAt: '',
};

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address'),
  phone: Yup.string()
    .transform(value => removeNonDigits(value))
    .matches(
      new RegExp(/^\d{10}$/),
      'A valid 10 digit phone number is required'
    ),
  emergencyContact: Yup.object().shape({
    phone: Yup.string()
      .transform(value => removeNonDigits(value))
      .matches(
        new RegExp(/^\d{10}$/),
        'A valid 10 digit phone number is required'
      ),
  }),
});
