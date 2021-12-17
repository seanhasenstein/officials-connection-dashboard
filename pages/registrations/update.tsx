import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import useUpdateRegistration from '../../hooks/useUpdateRegistration';
import useSession from '../../hooks/useSessions';
import { formatSessionName, stateList } from '../../utils';
import Layout from '../../components/Layout';
import PaymentStatusField from '../../components/PaymentStatusField';
import RefundAmountField from '../../components/RefundAmountField';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UpdateRegistration() {
  const [session, sessionLoading] = useSession();
  const router = useRouter();
  const {
    registrationQuery,
    updateRegistration,
    initialValues,
    sessions,
    handleSessionUpdate,
    handleAttendingToggle,
    showHSFields,
  } = useUpdateRegistration();

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <UpdateRegistrationStyles>
        <div className="container">
          <h2>Update Registration</h2>
          {registrationQuery.isLoading && (
            <LoadingSpinner isLoading={registrationQuery.isLoading} />
          )}
          {registrationQuery.error && (
            <div>Error: {registrationQuery.error.message}</div>
          )}
          {registrationQuery.data && (
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              onSubmit={async values => {
                updateRegistration.mutate(values, {
                  onSuccess: data => router.push(`/registrations/${data._id}`),
                });
              }}
            >
              {({ isSubmitting, values }) => (
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
                    </div>
                    <div className="item">
                      <label htmlFor="phone">Phone Number</label>
                      <Field id="phone" name="phone" />
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
                    {sessions.map(s => (
                      <div key={s.id} className="checkbox-item">
                        <label htmlFor={`session-${s.id}`}>
                          <input
                            type="checkbox"
                            id={`session-${s.id}`}
                            name={`session-${s.id}`}
                            value={s.id}
                            checked={s.isChecked}
                            onChange={e => handleSessionUpdate(e)}
                          />
                          {formatSessionName(s)}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="section">
                    <h3>Session Status</h3>
                    <p>
                      This section allows you to toggle the selected sessions
                      from attending to not-attending status.
                    </p>
                    <div className="session-status-items">
                      {sessions.map(s => {
                        if (s.isChecked) {
                          return (
                            <div key={s.id} className="session-status-item">
                              <p>{formatSessionName(s)}</p>
                              <button
                                type="button"
                                onClick={() => handleAttendingToggle(s.id)}
                                role="switch"
                                aria-checked={s.attending}
                                className={`session-toggle ${
                                  s.attending ? 'on' : 'off'
                                }`}
                              >
                                <span className="sr-only">
                                  Toggle attending
                                </span>
                                <span aria-hidden="true" className="switch" />
                              </button>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {showHSFields && (
                    <>
                      <div className="section">
                        <h3>High School Crew Deal</h3>
                        <div className="radio-item">
                          <label htmlFor="true">
                            <Field
                              type="radio"
                              id="true"
                              name="discount"
                              value="true"
                            />
                            Yes
                          </label>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label htmlFor="false">
                            <Field
                              type="radio"
                              id="false"
                              name="discount"
                              value="false"
                            />
                            No
                          </label>
                        </div>
                        {values.discount === 'true' && (
                          <>
                            <h3>Crew Members</h3>
                            <div className="item">
                              <label htmlFor="crewMember1">
                                Crew Member #1
                              </label>
                              <Field id="crewMember1" name="crewMembers.0" />
                            </div>
                            <div className="item">
                              <label htmlFor="crewMember2">
                                Crew Member #2
                              </label>
                              <Field id="crewMember2" name="crewMembers.1" />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="section">
                        <h3>WIAA Information</h3>
                        <div className="grid-col-2">
                          <div className="item">
                            <label htmlFor="wiaaClass">
                              WIAA Classification
                            </label>
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
                            <label htmlFor="wiaaNumber">WIAA Number</label>
                            <Field id="wiaaNumber" name="wiaaNumber" />
                          </div>
                        </div>
                        <div className="item">
                          <label htmlFor="associations">Associations</label>
                          <Field id="associations" name="associations" />
                        </div>
                      </div>
                    </>
                  )}
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
                      </div>
                    </div>
                  </div>
                  <div className="section">
                    <h3>Payment Details</h3>
                    {values.paymentMethod !== 'card' && (
                      <>
                        <div className="grid-col-2">
                          <div className="item">
                            <label htmlFor="paymentMethod">
                              Payment Method
                            </label>
                            <Field
                              id="paymentMethod"
                              name="paymentMethod"
                              as="select"
                            >
                              <option value="default">Select a method</option>
                              <option value="unpaid">Still needs to pay</option>
                              <option value="cash">Cash</option>
                              <option value="check">Check</option>
                              <option value="free">Free Entry</option>
                            </Field>
                          </div>

                          <div className="item">
                            <label htmlFor="paymentAmount">
                              Payment Amount
                            </label>
                            <Field
                              type="number"
                              step=".01"
                              id="paymentAmount"
                              name="paymentAmount"
                            />
                          </div>
                        </div>
                        {values.paymentMethod === 'check' && (
                          <div className="item">
                            <label htmlFor="checkNumber">Check #</label>
                            <Field id="checkNumber" name="checkNumber" />
                          </div>
                        )}
                      </>
                    )}
                    {values.paymentMethod === 'card' && (
                      <div className="payment-note">
                        This camper paid with a card. The payment details are
                        available in the{' '}
                        <a
                          href="https://dashboard.stripe.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Stripe dashboard
                        </a>
                        .
                      </div>
                    )}
                    <div className="item">
                      <label htmlFor="paymentStatus">Payment Status</label>
                      <PaymentStatusField name="paymentStatus" />
                    </div>
                    {(values.paymentStatus === 'fullyRefunded' ||
                      values.paymentStatus === 'partiallyRefunded') && (
                      <div className="item">
                        <RefundAmountField />
                      </div>
                    )}
                  </div>
                  <div className="form-actions">
                    {isSubmitting ? (
                      <LoadingSpinner isLoading={isSubmitting} />
                    ) : (
                      <Link
                        href={`/registrations/${registrationQuery?.data?._id}`}
                      >
                        <a>Cancel</a>
                      </Link>
                    )}
                    <button type="submit">Update Registration</button>
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

const UpdateRegistrationStyles = styled.div`
  padding: 0 1.5rem;
  width: 100%;
  min-height: 100vh;
  background-color: #f9fafb;

  .container {
    padding: 3rem 0;
    margin: 0 auto;
    max-width: 32rem;
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
    margin: 3rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0 0.875rem;

    button {
      padding: 0.625rem 1.5rem;
      background-color: #4f46e5;
      border: 1px solid #3730a3;
      box-shadow: inset 0 1px 0 #818cf8;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #3f35e3;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
          rgb(59, 130, 246) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
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
`;
