import React from 'react';
import { Field, useFormikContext } from 'formik';
import { RegistrationInput } from '../interfaces';

export default function RefundAmountField() {
  const { values, setFieldValue } = useFormikContext<RegistrationInput>();

  React.useEffect(() => {
    if (values.paymentStatus === 'fullyRefunded') {
      setFieldValue('refundAmount', values.paymentAmount);
    }
  }, [setFieldValue, values.paymentAmount, values.paymentStatus]);

  return (
    <>
      <label htmlFor="refundAmount">Refund Amount</label>
      <Field type="number" step="0.01" id="refundAmount" name="refundAmount" />
    </>
  );
}
