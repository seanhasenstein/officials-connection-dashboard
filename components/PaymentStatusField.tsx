import React from 'react';
import { useField, useFormikContext } from 'formik';
import { RegistrationInput } from '../interfaces';

type Props = {
  name: string;
};

export default function PaymentStatusField(props: Props) {
  const { values, setFieldValue } = useFormikContext<RegistrationInput>();
  const [field] = useField(props);

  React.useEffect(() => {
    if (values.paymentMethod === 'unpaid') {
      setFieldValue('paymentStatus', 'unpaid');
    }

    if (values.paymentMethod === 'free') {
      setFieldValue('paymentStatus', 'paid');
      setFieldValue('paymentAmount', 0);
    }
  }, [props.name, setFieldValue, values.paymentMethod]);

  return (
    <select {...props} {...field}>
      <option value="default">Select a status</option>
      {values.paymentMethod !== 'card' && (
        <option value="unpaid">Still needs to pay</option>
      )}
      <option value="paid">Paid</option>
      <option value="partiallyRefunded">Partially Refunded</option>
      <option value="fullyRefunded">Fully Refunded</option>
    </select>
  );
}
