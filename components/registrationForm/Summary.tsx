import React from 'react';
import styled from 'styled-components';
import {
  PaymentMethod,
  PaymentStatus,
  RegistrationDiscount,
  Session,
} from '../../types';
import { calculateTotal, formatToMoney } from '../../utils/misc';

type Props = {
  selectedSessions: Session[];
  subtotal: number;
  discounts: RegistrationDiscount[];
  refundAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

// const resetDiscount = {
//   active: false,
//   name: undefined,
//   amount: 0,
// };

export default function Summary(props: Props) {
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    // if (props.discount.active === false) {
    //   props.setFieldValue('discount', resetDiscount);
    // }

    const discountsAmount = props.discounts.reduce(
      (acc, discount) => acc + discount.amount,
      0
    );

    if (props.paymentStatus === 'fullyRefunded') {
      props.setFieldValue('refundAmount', props.subtotal - discountsAmount);
    }

    if (props.paymentStatus === 'partiallyRefunded' && total < 0) {
      props.setFieldValue('paymentStatus', 'fullyRefunded');
      props.setFieldValue('refundAmount', props.subtotal - discountsAmount);
    }

    if (
      props.paymentStatus !== 'fullyRefunded' &&
      props.paymentStatus !== 'partiallyRefunded'
    ) {
      props.setFieldValue('refundAmount', 0);
    }

    setTotal(
      calculateTotal(
        props.paymentMethod,
        props.subtotal,
        props.refundAmount,
        discountsAmount
      )
    );
  }, [props.subtotal, props.paymentStatus, props.refundAmount]);

  return (
    <SummaryStyles>
      <h3>Registration Details</h3>
      <div className="sessions">
        {props.selectedSessions.length > 0 ? (
          <>
            {props.selectedSessions.map(session => (
              <div key={session.sessionId} className="session">
                <div>
                  {session.camp.name} {session.category} {session.dates}{' '}
                  {session.levels ? session.levels : null}
                </div>
                <div>{formatToMoney(session.price)}</div>
              </div>
            ))}
          </>
        ) : (
          <div className="session">No sessions selected</div>
        )}
      </div>
      <div className="summary">
        <div className="summary-container">
          <div className="summary-item">
            <div className="label">Subtotal</div>
            <div className="value">
              {formatToMoney(props.subtotal * 100, true)}
            </div>
          </div>
          <div>TODO: add new discounts api</div>
          {/* <div className="summary-item">
            <div className="label">Discount</div>
            <div className="value">
              {formatToMoney(props.discount.amount * 100, true)}
            </div>
          </div> */}
          <div className="summary-item">
            <div className="label">Refund amount</div>
            <div className="value">
              {formatToMoney(props.refundAmount * 100, true)}
            </div>
          </div>
          <div className="summary-item total">
            <div className="label">Total</div>
            <div className="value">{formatToMoney(total, true)}</div>
          </div>
        </div>
      </div>
    </SummaryStyles>
  );
}

const SummaryStyles = styled.div`
  .session {
    padding: 0.75rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;

    &:first-of-type {
      border-top: 1px solid #e5e7eb;
    }
  }

  .summary {
    padding: 1.25rem 0;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e5e7eb;
  }

  .summary-container {
    max-width: 15rem;
    width: 100%;
  }

  .summary-item {
    margin: 0.625rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;

    &.total {
      font-weight: 600;

      .label {
        color: #000;
      }

      .value {
        color: #047857;
      }
    }
  }
`;
