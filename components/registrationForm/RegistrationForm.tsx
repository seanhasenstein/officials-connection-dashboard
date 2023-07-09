import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';

import { RegistrationInput } from '../../types';

import { validationSchema } from '../../utils/registrationForm';
import { stateList } from '../../utils/misc';
import {
  formatPhoneNumberOnChange,
  formatZipcodeOnChange,
} from 'utils/inputFormat';

import LoadingSpinner from '../LoadingSpinner';
import Sessions from './Sessions';
import HighSchoolFields from './HighSchoolFields';
import Summary from './Summary';
import CustomTextInput from 'components/CustomTextInput';

type Props = {
  initialValues: RegistrationInput;
  onSubmit: (input: any) => void;
  yearIsLoading: boolean;
  isSubmitting: boolean;
};

export default function RegistrationForm(props: Props) {
  const router = useRouter();

  const phoneRef = React.useRef<HTMLInputElement>(null);
  const zipRef = React.useRef<HTMLInputElement>(null);
  const emergencyPhoneRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormStyles>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={props.onSubmit}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
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
                <label htmlFor="email">Email address</label>
                <Field id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <CustomTextInput
                ref={phoneRef}
                name="phone"
                id="phone"
                label="Cell Phone"
                onInput={e => {
                  if (phoneRef.current) {
                    phoneRef.current.value = formatPhoneNumberOnChange(
                      e.target.value
                    );
                  }
                }}
              />
              <h4>Address</h4>
              <div className="item">
                <label htmlFor="street">Street</label>
                <Field id="street" name="address.street" />
              </div>
              <div className="item">
                <label htmlFor="street2">Line 2</label>
                <Field id="street2" name="address.street2" />
              </div>
              <div className="grid-col-2">
                <div className="item">
                  <label htmlFor="city">City</label>
                  <Field id="city" name="address.city" />
                </div>
                <div className="item">
                  <label htmlFor="state">State</label>
                  <Field name="address.state" as="select">
                    <option value="default">Select a state</option>
                    {stateList.map((s, i) => (
                      <option key={i} value={s.value}>
                        {s.text}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <CustomTextInput
                ref={zipRef}
                name="address.zipcode"
                id="address.zipcode"
                label="Zip Code"
                onInput={e => {
                  if (zipRef.current) {
                    zipRef.current.value = formatZipcodeOnChange(
                      e.target.value
                    );
                  }
                }}
              />
            </div>

            {props.yearIsLoading ? (
              <div>Loading...</div>
            ) : (
              <Sessions
                sessions={values.sessions}
                setFieldValue={setFieldValue}
              />
            )}

            <HighSchoolFields values={values} />

            <div className="section">
              <h3>Food Allergies</h3>
              <div className="item">
                <label htmlFor="foodAllergies">List any food allergies</label>
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
                <CustomTextInput
                  ref={emergencyPhoneRef}
                  name="emergencyContact.phone"
                  id="emergencyContact.phone"
                  label="Phone"
                  onInput={e => {
                    if (emergencyPhoneRef.current) {
                      emergencyPhoneRef.current.value =
                        formatPhoneNumberOnChange(e.target.value);
                    }
                  }}
                  customContainerClass="custom-emergency-phone"
                />
              </div>
            </div>

            <div className="section">
              <h3>Payment Information</h3>
              <div className="item">
                <label htmlFor="subtotal">Subtotal</label>
                <Field type="number" id="subtotal" name="subtotal" />
              </div>
              <div>TODO: add new discounts api integration</div>
              {/* <div className="discount">
                <div className="item row">
                  <p className="button-label">Include a discount</p>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('discount.active', !values.discount.active)
                    }
                    role="switch"
                    aria-checked={values.discount.active}
                    className={`toggle ${
                      values.discount.active ? 'on' : 'off'
                    }`}
                  >
                    <span className="sr-only">Toggle discount</span>
                    <span aria-hidden="true" className="switch" />
                  </button>
                </div>
                {values.discount.active && (
                  <>
                    <div className="grid-col-2 mt-6">
                      <div className="item">
                        <label htmlFor="temporaryDiscountName">
                          Select a discount
                        </label>
                        <Field
                          as="select"
                          name="temporaryDiscountName"
                          id="temporaryDiscountName"
                        >
                          <option value="default">Select a discount</option>
                          <option value="hscrew">HS Crew Discount</option>
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
                    {values.temporaryDiscountName === 'other' ? (
                      <div className="item">
                        <label htmlFor="discount.name">Discount name</label>
                        <Field name="discount.name" id="discount.name" />
                      </div>
                    ) : null}
                  </>
                )}
              </div> */}
              <div className="item">
                <label htmlFor="paymentMethod">Payment method</label>
                <Field
                  id="paymentMethod"
                  name="paymentMethod"
                  as="select"
                  disabled={values.paymentMethod === 'card'}
                >
                  <option value="default">Select a method</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="unpaid">Still needs to pay</option>
                  <option value="free">Free Entry</option>
                  {values.paymentMethod === 'card' && (
                    <option value="card">Card</option>
                  )}
                </Field>
              </div>
              {values.paymentMethod === 'check' && (
                <div className="item">
                  <label htmlFor="checkNumber">Check No.</label>
                  <Field id="checkNumber" name="checkNumber" />
                </div>
              )}
              <div className="item">
                <label htmlFor="paymentStatus">Payment status</label>
                <Field id="paymentStatus" name="paymentStatus" as="select">
                  <option value="default">Select a status</option>
                  {values.paymentMethod !== 'card' && (
                    <option value="unpaid">Still needs to pay</option>
                  )}
                  <option value="paid">Paid</option>
                  <option value="partiallyRefunded">Partially Refunded</option>
                  <option value="fullyRefunded">Fully Refunded</option>
                </Field>
              </div>
              {values.paymentStatus === 'partiallyRefunded' && (
                <div className="item">
                  <label htmlFor="refundAmount">Refund Amount</label>
                  <Field type="number" id="refundAmount" name="refundAmount" />
                </div>
              )}
            </div>

            <Summary
              selectedSessions={values.sessions.filter(s => s.isChecked)}
              subtotal={values.subtotal}
              refundAmount={values.refundAmount}
              discounts={values.discounts || []}
              paymentMethod={values.paymentMethod}
              paymentStatus={values.paymentStatus}
              setFieldValue={setFieldValue}
            />

            <div className="actions">
              <button
                type="submit"
                disabled={props.isSubmitting}
                className="submit-button"
              >
                {props.isSubmitting ? (
                  <ButtonLoadingSpinner isLoading={props.isSubmitting} />
                ) : (
                  <>
                    {router.pathname.split('/').includes('add')
                      ? 'Add'
                      : 'Update'}{' '}
                    registration
                  </>
                )}
              </button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </FormStyles>
  );
}

const FormStyles = styled.div`
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
    margin: 0;
    line-height: 1.5;
    color: #6b7280;

    a {
      text-decoration: underline;
    }
  }

  form {
    margin: 4rem 0 0;
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

  .toggle {
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
      background-color: #0441ac;

      & .switch {
        transform: translateX(1.25rem);
      }
    }

    &.off {
      background-color: #dadde2;

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

  .discount {
    margin: 3rem 0;
    padding: 1rem 1.5rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    .row {
      margin: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 0.875rem;
    }

    .mt-6 {
      margin-top: 1.5rem;
    }

    .button-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
    }
  }

  .actions {
    margin: 2rem 0 0;
    display: flex;
    justify-content: flex-end;
  }

  .submit-button {
    padding: 0.6875rem 0;
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1f252e;
    border: none;
    border-radius: 0.375rem;
    color: #f4f4f5;
    font-size: 0.9375rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: background-color 150ms linear;

    &:hover {
      background-color: #0f1217;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255 255 255) 0px 0px 0px 2px, #0448bf 0px 0px 0px 4px,
        rgb(0 0 0 / 5%) 0px 1px 2px 0px;
    }
  }

  .error {
    margin: 0.625rem 0 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #be123c;
  }

  .custom-emergency-phone {
    margin-top: 0;
  }
`;

const ButtonLoadingSpinner = styled(LoadingSpinner)`
  .spinner {
    border-color: #4e5e74;
    border-top-color: #7284a0;
  }
`;
