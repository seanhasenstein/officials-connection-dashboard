import * as Yup from 'yup';

import { removeNonDigits } from '../../../utils/misc';

import { Camps } from 'types';

export interface FormValues {
  id: string;
  camp: Camps;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const validationSchema = Yup.object({
  camp: Yup.string()
    .oneOf(['Kaukauna Camp', 'Plymouth Camp', 'UW-Stevens Point Camp'])
    .required('Camp is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .transform(value => removeNonDigits(value))
    .matches(
      new RegExp(/^\d{10}$/),
      'A valid 10 digit phone number is required'
    )
    .required('Phone is required'),
});
