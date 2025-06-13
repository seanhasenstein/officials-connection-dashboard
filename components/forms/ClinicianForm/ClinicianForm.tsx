import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from 'react-query';

import { Clinician } from 'types';

import { FormValues, validationSchema } from './utils';
import { createId, formatPhoneNumber } from 'utils/misc';
import { formatPhoneNumberOnChange } from 'utils/inputFormat';

import DeleteClinician from 'components/DeleteClinician';
import CustomTextInput from 'components/CustomTextInput';

import ClinicianFormComponent from './styles';

type Props = {
  initialValues: FormValues;
  mode: 'add' | 'update';
  modalIsOpen: boolean;
  closeModal: () => void;
};

export default function ClinicianForm(props: Props) {
  const [mutationStatus, setMutationStatus] = React.useState<
    'idle' | 'error' | 'success'
  >('idle');

  const phoneRef = React.useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { id, camp, firstName, lastName, email, phone } =
    props.initialValues ?? {};

  const clinicianMutation = useMutation(
    async (formValues: FormValues) => {
      const response = await fetch('/api/clinician/add-or-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formValues, mode: props.mode }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${props.mode === 'add' ? 'add' : 'update'} clinician`
        );
      }

      setMutationStatus('success');
      const data: Clinician = await response.json();
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('year');
      },
      onSuccess: () => {
        props.closeModal();
      },
    }
  );

  const { isLoading, isError } = clinicianMutation;

  const handleSubmit = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    clinicianMutation.mutate(values, {
      onError: () => {
        setMutationStatus('error');
        formikHelpers.setSubmitting(false);
      },
      onSuccess: () => {
        formikHelpers.resetForm();
      },
    });
  };

  return (
    <ClinicianFormComponent>
      <Formik
        initialValues={{
          id: id ?? createId(),
          camp: camp ?? 'Kaukauna Camp',
          firstName: firstName ?? '',
          lastName: lastName ?? '',
          email: email ?? '',
          phone: phone ? formatPhoneNumber(phone) : '',
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => {
          const loading = isSubmitting || isLoading;

          return (
            <Form>
              <div
                className="form-item radio-item"
                role="group"
                aria-labelledby="camp"
              >
                <label
                  htmlFor="stevensPoint"
                  className={`
                    ${values.camp === 'UW-Stevens Point Camp' ? 'active' : ''}
                      ${props.mode === 'update' ? 'disabled' : ''}
                  `}
                >
                  <Field
                    type="radio"
                    name="camp"
                    id="stevensPoint"
                    value="UW-Stevens Point Camp"
                    disabled={props.mode === 'update'}
                  />
                  UW-Stevens Point Camp
                </label>
                <label
                  htmlFor="kaukauna"
                  className={`
                    ${values.camp === 'Kaukauna Camp' ? 'active' : ''}
                      ${props.mode === 'update' ? 'disabled' : ''}
                  `}
                >
                  <Field
                    type="radio"
                    name="camp"
                    id="kaukauna"
                    value="Kaukauna Camp"
                    disabled={props.mode === 'update'}
                  />
                  Kaukauna Camp
                </label>
                <label
                  htmlFor="plymouth"
                  className={`
                  ${values.camp === 'Plymouth Camp' ? 'active' : ''}
                    ${props.mode === 'update' ? 'disabled' : ''}
                `}
                >
                  <Field
                    type="radio"
                    name="camp"
                    id="plymouth"
                    value="Plymouth Camp"
                    disabled={props.mode === 'update'}
                  />
                  Plymouth Camp
                </label>
              </div>
              <div className="grid-col-2">
                <div className="form-item">
                  <label htmlFor="firstName">First Name</label>
                  <Field type="text" name="firstName" id="firstName" />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="lastName">Last Name</label>
                  <Field type="text" name="lastName" id="lastName" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-item">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" />
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
              <div className="actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading
                    ? 'Loading...'
                    : props.mode === 'add'
                    ? 'Add Clinician'
                    : 'Update Clinician'}
                </button>
              </div>
              {props.mode === 'update' ? (
                <DeleteClinician
                  id={props.initialValues?.id}
                  camp={props.initialValues?.camp}
                  modalIsOpen={props.modalIsOpen}
                  closeModal={props.closeModal}
                />
              ) : null}
              {mutationStatus === 'error' || isError ? (
                <div className="error">A server error occurred!</div>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </ClinicianFormComponent>
  );
}
