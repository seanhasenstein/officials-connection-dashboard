import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RegistrationDbFormat, Session } from '../../interfaces';
import useUpdateRegistration from '../../hooks/useUpdateRegistration';
import { useYearQuery } from '../../hooks/useYearQuery';
import useAuthSession from '../../hooks/useAuthSession';
import {
  formatSessionName,
  formatToMoney,
  removeNonDigits,
  stateList,
} from '../../utils/misc';
import Layout from '../../components/Layout';
import PaymentStatusField from '../../components/PaymentStatusField';
import RefundAmountField from '../../components/RefundAmountField';
import LoadingSpinner from '../../components/LoadingSpinner';

const validationSchema = Yup.object().shape({
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

export default function UpdateRegistration() {
  const [session, sessionLoading] = useAuthSession();
  const router = useRouter();
  const { isLoading: yearIsLoading, error: yearError } = useYearQuery();
  const {
    registrationQuery,
    updateRegistration,
    initialValues,
    showHSFields,
    setShowHSFields,
    isLoading,
  } = useUpdateRegistration();

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <UpdateRegistrationStyles>
        <div className="container">
          <h2>Update Registration</h2>
          {registrationQuery.isLoading ||
            (yearIsLoading && (
              <LoadingSpinner
                isLoading={registrationQuery.isLoading || yearIsLoading}
              />
            ))}
          {registrationQuery.error && (
            <div>Error: {registrationQuery.error.message}</div>
          )}
          {yearError && <div>Error: {yearError.message}</div>}
          {registrationQuery.data && (
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={async values => {
                updateRegistration.mutate(values, {
                  onSuccess: data => {
                    router.push(`/registrations/${data._id}`);
                  },
                });
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="section">
                    <div className="grid-col-2">
                      <div className="item">
                        <label htmlFor="firstName">First name</label>
                        <Field id="firstName" name="firstName" />
                      </div>
                      <div className="item">
                        <label htmlFor="lastName">Last name</label>
                        <Field id="lastName" name="lastName" />
                      </div>
                    </div>
                    <div className="item">
                      <label htmlFor="email">Email Address</label>
                      <Field id="email" name="email" />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="item">
                      <label htmlFor="phone">Phone Number</label>
                      <Field id="phone" name="phone" />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="error"
                      />
                    </div>
                    <h4>Address</h4>
                    <div className="item">
                      <label htmlFor="address.street">Street</label>
                      <Field id="address.street" name="address.street" />
                    </div>
                    <div className="item">
                      <label htmlFor="address.street2">Apartment</label>
                      <Field id="address.street2" name="address.street2" />
                    </div>
                    <div className="item">
                      <label htmlFor="address.city">City</label>
                      <Field id="address.city" name="address.city" />
                    </div>
                    <div className="grid-col-2">
                      <div className="item">
                        <label htmlFor="address.state">State</label>
                        <Field
                          id="address.state"
                          name="address.state"
                          as="select"
                        >
                          <option value="default">Select a state</option>
                          {stateList.map((s, i) => (
                            <option key={i} value={s.value}>
                              {s.text}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="item">
                        <label htmlFor="address.zipcode">Zipcode</label>
                        <Field id="address.zipcode" name="address.zipcode" />
                      </div>
                    </div>
                  </div>
                  <div className="section">
                    <h3>Select Sessions</h3>
                    <SelectSessions
                      sessions={values.sessions}
                      setFieldValue={setFieldValue}
                    />
                  </div>

                  {values.sessions.some(s => s.isChecked) && (
                    <div className="section">
                      <h3>Session Status</h3>
                      <p>
                        Toggle the selected sessions from attending to
                        not-attending.
                      </p>
                      <div className="session-status-items">
                        <SessionStatus
                          sessions={values.sessions}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    </div>
                  )}

                  <HighSchoolFields
                    values={values}
                    showHSFields={showHSFields}
                    setShowHSFields={setShowHSFields}
                  />

                  <div className="section">
                    <h3>Food Allegies</h3>
                    <div className="item">
                      <label htmlFor="foodAllergies">
                        List any food allergies
                      </label>
                      <Field id="foodAllergies" name="foodAllergies" />
                    </div>
                  </div>
                  <div className="section">
                    <h3>Emergency Contact</h3>
                    <div className="grid-col-2">
                      <div className="item">
                        <label htmlFor="emergencyContact.name">Name</label>
                        <Field
                          id="emergencyContact.name"
                          name="emergencyContact.name"
                        />
                      </div>
                      <div className="item">
                        <label htmlFor="emergencyContact.phone">
                          Phone Number
                        </label>
                        <Field
                          id="emergencyContact.phone"
                          name="emergencyContact.phone"
                        />
                        <ErrorMessage
                          name="emergencyContact.phone"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="section">
                    <h3>Payment Details</h3>
                    <div className="item">
                      <label htmlFor="subtotal">Subtotal</label>
                      <Field
                        type="number"
                        step="1"
                        id="subtotal"
                        name="subtotal"
                      />
                    </div>
                    <div className="grid-col-2">
                      <div className="item">
                        <label htmlFor="paymentMethod">Payment method</label>
                        <Field
                          id="paymentMethod"
                          name="paymentMethod"
                          as="select"
                        >
                          {values.paymentMethod === 'card' ? (
                            <option value="card">Card</option>
                          ) : (
                            <>
                              <option value="default">Select a method</option>
                              <option value="cash">Cash</option>
                              <option value="check">Check</option>
                              <option value="unpaid">Still needs to pay</option>
                              <option value="free">Free Entry</option>
                            </>
                          )}
                        </Field>
                      </div>
                      <div className="item">
                        <label htmlFor="paymentStatus">Payment status</label>
                        <PaymentStatusField name="paymentStatus" />
                      </div>
                    </div>
                    {values.paymentMethod === 'check' && (
                      <div className="item">
                        <label htmlFor="checkNumber">Check #</label>
                        <Field id="checkNumber" name="checkNumber" />
                      </div>
                    )}

                    <RefundAmountField />

                    <div className="checkbox-item discount">
                      <Field
                        type="checkbox"
                        name="discount.active"
                        id="discount.active"
                        checked={values.discount.active}
                      />
                      <label htmlFor="discount.active">Add a discount</label>
                    </div>
                    <DiscountFields
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                  <div className="section">
                    <div className="registration-summary">
                      <div className="sessions">
                        <h4>Sessions</h4>
                        {values.sessions.map(s => {
                          if (s.isChecked) {
                            return (
                              <div key={s.sessionId} className="session">
                                <div>
                                  {s.attending ? (
                                    <div className="attending">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="not-attending">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  {s.camp.name} {s.category} {s.dates}{' '}
                                  {s.levels && s.levels}
                                </div>
                                <div>{formatToMoney(s.price)}</div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div className="summary-numbers-container">
                        <div className="summary-numbers-row">
                          <div className="summary-item">
                            <div className="label">Subtotal</div>
                            <div className="value">
                              {formatToMoney(values.subtotal * 100, true)}
                            </div>
                          </div>
                          <div className="summary-item">
                            <div className="label">Discount</div>
                            <div className="value">
                              {formatToMoney(
                                values.discount.amount * 100,
                                true
                              )}
                            </div>
                          </div>
                          {values.refundAmount > 0 && (
                            <div className="summary-item">
                              <div className="label">Refund Amount</div>
                              <div className="value">
                                {formatToMoney(values.refundAmount * 100, true)}
                              </div>
                            </div>
                          )}
                          <div className="summary-item total">
                            <div className="label">Total</div>
                            <div className="value">
                              {formatToMoney(
                                (values.subtotal -
                                  values.discount.amount -
                                  values.refundAmount) *
                                  100,
                                true
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      {isLoading ? (
                        <LoadingSpinner isLoading={isLoading} />
                      ) : (
                        <Link href="/">
                          <a>Cancel</a>
                        </Link>
                      )}
                      <button type="submit" disabled={isLoading}>
                        Update registration
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </UpdateRegistrationStyles>
    </Layout>
  );
}

type SessionsFnProps = {
  sessions: Session[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

function SelectSessions({ sessions, setFieldValue }: SessionsFnProps) {
  const handleCheckboxChange = (updateId: string) => {
    const updatedSessions = sessions.map(s => {
      if (s.sessionId === updateId) {
        return {
          ...s,
          isChecked: !s.isChecked,
          attending: s.isChecked ? false : true,
        };
      }
      return s;
    });

    setFieldValue('sessions', updatedSessions);
  };

  return (
    <>
      {sessions.map(s => (
        <div key={s.sessionId} className="checkbox-item">
          <label htmlFor={`session-${s.sessionId}`}>
            <Field
              type="checkbox"
              id={`session-${s.sessionId}`}
              name={`session-${s.sessionId}`}
              checked={s.isChecked}
              onChange={() => handleCheckboxChange(s.sessionId)}
            />
            {formatSessionName(s)}
          </label>
        </div>
      ))}
    </>
  );
}

function SessionStatus({ sessions, setFieldValue }: SessionsFnProps) {
  const handleStatusChange = (updateId: string) => {
    const updatedSessions = sessions.map(s => {
      if (s.sessionId === updateId) {
        return { ...s, attending: !s.attending };
      }
      return s;
    });

    setFieldValue('sessions', updatedSessions);
  };

  return (
    <>
      {sessions?.map(s => {
        if (s.isChecked) {
          return (
            <div key={s.sessionId} className="session-status-item">
              <p>{formatSessionName(s)}</p>
              <button
                type="button"
                onClick={() => handleStatusChange(s.sessionId)}
                role="switch"
                aria-checked={s.attending}
                className={`session-toggle ${s.attending ? 'on' : 'off'}`}
              >
                <span className="sr-only">Toggle attending</span>
                <span aria-hidden="true" className="switch" />
              </button>
            </div>
          );
        }
      })}
    </>
  );
}

type HSFieldsProps = {
  values: RegistrationDbFormat;
  showHSFields: boolean;
  setShowHSFields: React.Dispatch<React.SetStateAction<boolean>>;
};

function HighSchoolFields({
  values,
  showHSFields,
  setShowHSFields,
}: HSFieldsProps) {
  React.useEffect(() => {
    const hsSessionSelected = values.sessions.some(
      s => s.isChecked && s.category === 'High School'
    );
    setShowHSFields(hsSessionSelected);
  }, [setShowHSFields, values.sessions]);

  if (showHSFields) {
    return (
      <>
        <div className="section">
          <h3>Crew Members</h3>
          <div className="item">
            <label htmlFor="crewMember1">Crew member 1</label>
            <Field id="crewMember1" name="crewMembers.0" />
          </div>
          <div className="item">
            <label htmlFor="crewMember2">Crew member 2</label>
            <Field id="crewMember2" name="crewMembers.1" />
          </div>
        </div>
        <div className="section">
          <h3>WIAA Information</h3>
          <div className="grid-col-2">
            <div className="item">
              <label htmlFor="wiaaClass">WIAA classification</label>
              <Field id="wiaaClass" name="wiaaClass" as="select">
                <option value="default">Select a class</option>
                <option value="Master">Master</option>
                <option value="L5">L5</option>
                <option value="L4">L4</option>
                <option value="L3">L3</option>
                <option value="L2">L2</option>
                <option value="L1">L1</option>
                <option value="LR">LR</option>
                <option value="New">New Official</option>
              </Field>
            </div>
            <div className="item">
              <label htmlFor="wiaaNumber">WIAA number</label>
              <Field id="wiaaNumber" name="wiaaNumber" />
            </div>
          </div>
          <div className="item">
            <label htmlFor="associations">Associations</label>
            <Field id="associations" name="associations" />
          </div>
        </div>
      </>
    );
  }

  return null;
}

type DiscountProps = {
  values: RegistrationDbFormat;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

function DiscountFields({ values, setFieldValue }: DiscountProps) {
  React.useEffect(() => {
    if (!values.discount.active) {
      setFieldValue('discount.amount', 0);
      setFieldValue('discount.name', 'default');
    }
    if (values.discount.name === 'default') {
      setFieldValue('discount.amount', 0);
    }
    if (values.discount.active) {
      if (values.discount.name === 'hsCrew') {
        setFieldValue('discount.amount', 10);
      }
    }
  }, [setFieldValue, values.discount.name, values.discount.active]);

  return (
    <>
      {values.discount.active && (
        <div className="grid-col-2">
          <div className="item">
            <label htmlFor="discount.name">Select a discount</label>
            <Field as="select" name="discount.name" id="discount.name">
              <option value="default">Select a discount</option>
              <option value="hsCrew">HS Crew Discount</option>
              <option value="other">Other</option>
            </Field>
          </div>
          <div className="item">
            <label htmlFor="discount.amount">Discount amount</label>
            <Field
              type="number"
              step="1"
              id="discount.amount"
              name="discount.amount"
            />
          </div>
        </div>
      )}
    </>
  );
}

const UpdateRegistrationStyles = styled.div`
  padding: 5rem 1.5rem 3rem;
  width: 100%;
  min-height: 100vh;
  background-color: #f9fafb;

  .container {
    margin: 0 auto;
    max-width: 31rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 2rem;
    color: #111827;
    font-weight: 600;
  }

  h3 {
    margin: 0 0 1.25rem;
    font-size: 1.125rem;
    color: #1f2937;
  }

  h4 {
    margin: 2rem 0 1.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    color: #1f2937;
  }

  p {
    margin: 0 0 1rem;
    color: #6b7280;
    line-height: 1.5;

    a {
      text-decoration: underline;
    }
  }

  .section {
    margin: 0 0 5rem;

    &:last-of-type {
      margin: 0;
    }
  }

  .grid-col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;
  }

  .item {
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
  }

  .checkbox-item {
    margin: 0 0 0.75rem;

    &.discount {
      margin: 2rem 0;
    }

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  .radio-item {
    margin: 0 0 1.25rem;
    display: grid;
    grid-template-columns: 8rem 8rem;

    label {
      display: flex;
      align-items: center;
      font-size: 1rem;
    }

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  label {
    margin: 0 0 0.375rem;
  }

  .session-status-items {
    margin: 1.5rem 0;
    width: 20rem;
  }

  .session-status-item {
    padding: 0.75rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.125rem;
    border-top: 1px solid #e5e7eb;

    &:last-of-type {
      border-bottom: 1px solid #e5e7eb;
    }

    p {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
    }

    .session-toggle {
      padding: 0;
      position: relative;
      flex-shrink: 0;
      display: inline-flex;
      height: 1.5rem;
      width: 2.75rem;
      border: 2px solid transparent;
      border-radius: 9999px;
      transition-property: background-color, border-color, color, fill, stroke;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
          rgb(99, 102, 241) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
      }

      &.on {
        background-color: #4f46e5;

        & .switch {
          transform: translateX(1.25rem);
        }
      }

      &.off {
        background-color: #e5e7eb;

        & .switch {
          transform: translateX(0rem);
        }
      }
    }

    .switch {
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      background-color: #fff;
      border-radius: 9999px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
        rgba(59, 130, 246, 0.5) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
      pointer-events: none;
      transition-duration: 0.2s;
      transition-property: background-color, border-color, color, fill, stroke,
        opacity, box-shadow, transform, filter, backdrop-filter,
        -webkit-backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .form-actions {
    margin: 1.5rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0 0.875rem;

    button {
      padding: 0.75rem 1.875rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #272e3a;
      border: none;
      border-radius: 0.25rem;
      color: #f4f4f5;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        background-color: #2f3845;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: rgb(255 255 255) 0px 0px 0px 2px,
          rgb(99 102 241) 0px 0px 0px 4px, rgb(0 0 0 / 5%) 0px 1px 2px 0px;
      }
    }

    a {
      padding: 0.625rem 1.5rem;
      border-radius: 0.375rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;

      &:hover {
        border-color: #111827;
        text-decoration: underline;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
          rgb(59, 130, 246) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }

  .payment-note {
    margin: 0 0 3rem;
    color: #4b5563;
    line-height: 1.5;

    a {
      text-decoration: underline;

      &:hover {
        color: #1f2937;
      }
    }
  }

  .error {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #9f1239;
  }

  .registration-summary {
    .session {
      padding: 0.625rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9375rem;
      line-height: 1;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;

      &:first-of-type {
        border-top: 1px solid #e5e7eb;
      }
    }

    .attending,
    .not-attending {
      margin: 0.125rem 0.625rem 0 0;
      display: inline-flex;
      height: 0.75rem;
      width: 0.75rem;
    }

    .attending {
      color: #059669;
    }

    .not-attending {
      color: #9f1239;
    }
  }

  .summary-numbers-container {
    padding: 1.25rem 0;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e5e7eb;
  }

  .summary-numbers-row {
    max-width: 13rem;
    width: 100%;
  }

  .summary-item {
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;

    &.total {
      font-weight: 600;

      .label {
        color: #111827;
      }

      .value {
        color: #047857;
      }
    }
  }
`;
