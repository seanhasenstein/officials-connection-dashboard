import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { connectToDb, registration } from '../../db';
import { Registration } from '../../interfaces';
import Layout from '../../components/Layout';
import { unitedStates, sessionsData } from '../../data';
import { formatPhoneNumber } from '../../utils';

const EditStyles = styled.div`
  padding: 0 1.5rem;
  width: 100%;

  .wrapper {
    padding: 3rem 0;
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 2rem;
    color: #111827;
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

  .section {
    margin: 0 0 4rem;
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

  .actions {
    margin: 1.75rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0 0.875rem;

    button {
      padding: 0.625rem 1.5rem;
      background-color: #0284c7;
      border: 1px solid #0284c7;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #0277b4;
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
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #0f172a;
      cursor: pointer;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      &:hover {
        border-color: #9ca3af;
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

type Props = {
  registration: Registration;
};

export default function Edit({ registration }: Props) {
  const router = useRouter();
  const [valueOverwrites] = React.useState(() => {
    const sessions = registration.sessions.map(s => s.id);
    const hsCrewDeal = registration.hsCrewDeal === true ? 'true' : 'false';
    const paymentAmount = (registration.total / 100).toFixed(2);
    const phone = formatPhoneNumber(registration.phone);
    const ecPhone = formatPhoneNumber(registration.emergencyContact.phone);
    const crewMembers =
      registration.crewMembers && registration.crewMembers.length > 0
        ? registration.crewMembers
        : ['', ''];

    return {
      phone,
      sessions,
      hsCrewDeal,
      crewMembers,
      paymentAmount,
      emergencyContact: {
        name: registration.emergencyContact.name,
        phone: ecPhone,
      },
    };
  });

  return (
    <Layout>
      <EditStyles>
        <div className="wrapper">
          <h2>Edit Registration</h2>
          <Formik
            initialValues={{
              ...registration,
              ...valueOverwrites,
            }}
            onSubmit={async values => {
              const response = await fetch('/api/update-registration', {
                method: 'post',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });

              const result = await response.json();

              console.log(result);

              if (result.success) {
                router.push(`/registration?id=${result.data._id}`);
              }
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
                    <label htmlFor="street">Street</label>
                    <Field id="street" name="address.street" />
                  </div>
                  <div className="item">
                    <label htmlFor="street2">Apartment</label>
                    <Field id="street2" name="address.street2" />
                  </div>
                  <div className="item">
                    <label htmlFor="city">City</label>
                    <Field id="city" name="address.city" />
                  </div>
                  <div className="grid-col-2">
                    <div className="item">
                      <label htmlFor="state">State</label>
                      <Field name="address.state" as="select">
                        <option value="DEFAULT">Select a state</option>
                        {unitedStates.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="item">
                      <label htmlFor="zipcode">Zipcode</label>
                      <Field id="zipcode" name="address.zipcode" />
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h3>Select Sessions</h3>
                  {sessionsData.map(s => (
                    <div key={s.id} className="checkbox-item">
                      <label htmlFor={s.id}>
                        <Field
                          id={s.id}
                          name="sessions"
                          type="checkbox"
                          value={s.id}
                        />
                        {s.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="section">
                  <h3>High School Crew Deal</h3>
                  <div className="radio-item">
                    <label htmlFor="true">
                      <Field
                        type="radio"
                        id="true"
                        name="hsCrewDeal"
                        value="true"
                      />
                      Yes
                    </label>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="false">
                      <Field
                        type="radio"
                        id="false"
                        name="hsCrewDeal"
                        value="false"
                      />
                      No
                    </label>
                  </div>
                  {values.hsCrewDeal === 'true' && (
                    <>
                      <h3>Crew Members</h3>
                      <div className="item">
                        <label htmlFor="crewMember1">Crew Member #1</label>
                        <Field id="crewMember1" name="crewMembers.0" />
                      </div>
                      <div className="item">
                        <label htmlFor="crewMember2">Crew Member #2</label>
                        <Field id="crewMember2" name="crewMembers.1" />
                      </div>
                    </>
                  )}
                </div>
                <div className="section">
                  <h3>WIAA Information</h3>
                  <div className="grid-col-2">
                    <div className="item">
                      <label htmlFor="wiaaClass">WIAA Classification</label>
                      <Field name="wiaaInformation.wiaaClass" as="select">
                        <option value="DEFAULT">Select a class</option>
                        <option value="MASTER">Master</option>
                        <option value="L5">L5</option>
                        <option value="L4">L4</option>
                        <option value="L3">L3</option>
                        <option value="L2">L2</option>
                        <option value="L1">L1</option>
                        <option value="LR">LR</option>
                        <option value="NEW_OFFICIAL">New Official</option>
                      </Field>
                    </div>
                    <div className="item">
                      <label htmlFor="wiaaNumber">WIAA Number</label>
                      <Field
                        id="wiaaNumber"
                        name="wiaaInformation.wiaaNumber"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <label htmlFor="associations">Officials Associations</label>
                    <Field
                      id="associations"
                      name="wiaaInformation.associations"
                    />
                  </div>
                </div>
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
                      <label htmlFor="ecName">Name</label>
                      <Field id="ecName" name="emergencyContact.name" />
                    </div>
                    <div className="item">
                      <label htmlFor="ecPhone">Phone Number</label>
                      <Field id="ecPhone" name="emergencyContact.phone" />
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h3>Payment Details</h3>
                  {values.paymentMethod !== 'card' && (
                    <>
                      <div className="grid-col-2">
                        <div className="item">
                          <label htmlFor="paymentMethod">Payment Method</label>
                          <Field
                            id="paymentMethod"
                            name="paymentMethod"
                            as="select"
                          >
                            <option value="DEFAULT">Select a method</option>
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="free">Free Entry</option>
                          </Field>
                        </div>

                        <div className="item">
                          <label htmlFor="paymentAmount">Payment Amount</label>
                          <Field id="paymentAmount" name="paymentAmount" />
                        </div>
                      </div>
                      {values.paymentMethod === 'check' && (
                        <div className="item">
                          <label htmlFor="checkNumber">Check #</label>
                          <Field id="checkNumber" name="checkNumber" />
                        </div>
                      )}
                      <div className="item">
                        <label htmlFor="paymentStatus">Payment Status</label>
                        <Field
                          id="paymentStatus"
                          name="paymentStatus"
                          as="select"
                        >
                          <option value="DEFAULT">Select a status</option>
                          <option value="succeeded">Paid</option>
                          <option value="unpaid">Still needs to pay</option>
                          <option value="fully_refunded">Fully refunded</option>
                        </Field>
                      </div>
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
                </div>

                <div>
                  <h3>Notes</h3>
                  <div className="item">
                    <label htmlFor="notes" className="sr-only">
                      Add notes here
                    </label>
                    <Field
                      id="notes"
                      name="notes"
                      as="textarea"
                      placeholder="Add a note..."
                    />
                  </div>
                </div>

                <div className="actions">
                  <Link href={`/registration?id=${registration._id}`}>
                    <a>Cancel</a>
                  </Link>
                  <button type="submit">
                    {isSubmitting ? 'Loading...' : 'Update'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </EditStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    if (!id) {
      throw new Error('No query id provided.');
    }

    const { db } = await connectToDb();
    const response = await registration.getRegistration(db, id);

    return {
      props: {
        registration: { ...response },
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};
