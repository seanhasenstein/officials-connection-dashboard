import React from 'react';
import { Field, useFormikContext } from 'formik';
import { RegistrationInput } from '../interfaces';

export default function RefundAmountField() {
  const { values, setFieldValue } = useFormikContext<RegistrationInput>();

  React.useEffect(() => {
    if (values.paymentStatus === 'fullyRefunded') {
      setFieldValue('refundAmount', values.subtotal);
      setFieldValue('discount.amount', 0);
      setFieldValue('discount.active', false);
      setFieldValue('discount.name', 'default');
    }
  }, [setFieldValue, values.subtotal, values.paymentStatus]);

  React.useEffect(() => {
    if (
      values.paymentStatus !== 'fullyRefunded' &&
      values.paymentStatus !== 'partiallyRefunded'
    ) {
      setFieldValue('refundAmount', 0);
    }
  }, [setFieldValue, values.paymentStatus]);

  return (
    <>
      {(values.paymentStatus === 'partiallyRefunded' ||
        values.paymentStatus === 'fullyRefunded') && (
        <div className="item">
          <label htmlFor="refundAmount">Refund Amount</label>
          <Field type="number" step="1" id="refundAmount" name="refundAmount" />
        </div>
      )}
    </>
  );
}
