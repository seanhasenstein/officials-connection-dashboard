import React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import useAuthSession from '../hooks/useAuthSession';

import Layout from '../components/Layout';

const validationSchema = Yup.object({
  to: Yup.string().required('A mailing list is required'),
  from: Yup.string().required('A from address is required'),
  subject: Yup.string().required('A subject is required'),
  body: Yup.string().required('A body is required'),
});

export default function SendAnEmail() {
  const [session, sessionLoading] = useAuthSession();
  const [triggerSend, setTriggerSend] = React.useState(false);
  const [serverError, setServerError] = React.useState(false);

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <SendAnEmailComponent>
        <div className="container">
          <h3>Send a an email</h3>
          <p>Use this form to send a an email with the WBYOC branding.</p>
          <Formik
            initialValues={{
              to: 'seanhasenstein@gmail.com',
              from: 'WBYOC<no-reply@officialsconnection.org>',
              bcc: 'wbyoc@officialsconnection.org',
              replyTo: 'tom.rusch25@gmail.com',
              subject: '',
              body: '',
              signOff: 'Sincerely,',
              includeMoreInfoLinks: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, formikHelpers) => {
              const splitBody = values.body.split('\n').filter(Boolean);

              const response = await fetch('/api/send-an-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...values,
                  body: splitBody,
                }),
              });

              if (!response.ok) {
                setServerError(true);
                throw new Error(
                  'A server error occurred while sending the email.'
                );
              }

              const data = await response.json();
              console.log(data);
              formikHelpers.resetForm();
              setTriggerSend(false);
              setServerError(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="form">
                <div className="form-item">
                  <label htmlFor="to">To (mailing list):</label>
                  <Field id="to" name="to" />
                  <ErrorMessage name="to" component="div" className="error" />
                </div>
                <div className="form-item">
                  <label htmlFor="to">From:</label>
                  <Field id="from" name="from" />
                  <ErrorMessage name="from" component="div" className="error" />
                </div>
                <div className="form-item">
                  <label htmlFor="bcc">BCC:</label>
                  <Field id="bcc" name="bcc" />
                  <ErrorMessage name="bcc" component="div" className="error" />
                </div>
                <div className="form-item">
                  <label htmlFor="replyTo">Reply to:</label>
                  <Field id="replyTo" name="replyTo" />
                  <ErrorMessage
                    name="replyTo"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="subject">Subject:</label>
                  <Field id="subject" name="subject" />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="body">Body:</label>
                  <Field as="textarea" id="body" name="body" />
                  <ErrorMessage name="body" component="div" className="error" />
                </div>
                <div className="form-item">
                  <label htmlFor="signOff">Sign off:</label>
                  <Field id="signOff" name="signOff" />
                  <ErrorMessage
                    name="signOff"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-item checkbox">
                  <Field
                    type="checkbox"
                    name="includeMoreInfoLinks"
                    id="includeMoreInfoLinks"
                  />
                  <label htmlFor="includeMoreInfoLinks">
                    Include more info links at the bottom of the email.
                  </label>
                </div>
                <div className="form-item switch-item">
                  <button
                    type="button"
                    onClick={() => setTriggerSend(prevState => !prevState)}
                    role="switch"
                    aria-checked={triggerSend}
                    className={`toggle ${triggerSend ? 'on' : 'off'}`}
                  >
                    <span className="sr-only">Toggle activate send email</span>
                    <span aria-hidden="true" className="switch" />
                  </button>
                  <p>Activate to send email</p>
                </div>
                <div className="actions">
                  {triggerSend && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button"
                    >
                      {isSubmitting ? 'Sending...' : 'Send the email'}
                    </button>
                  )}
                </div>
                {serverError ? (
                  <div className="error">A server error occurred</div>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      </SendAnEmailComponent>
    </Layout>
  );
}

const SendAnEmailComponent = styled.div`
  padding: 5rem 2.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    margin: 0 auto;
    padding: 1.5rem 2rem;
    max-width: 36rem;
    width: 100%;
    background: #fff;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    p {
      margin: 1rem 0 0;
      font-size: 1rem;
      color: #4b5563;
    }
  }

  .form {
    margin: 1.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1.125rem 0;
  }

  .form-item {
    display: flex;
    flex-direction: column;

    &.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0 0.5rem;

      label {
        margin: 0;
      }
    }

    textarea {
      min-height: 12rem;
    }
  }

  .switch-item {
    flex-direction: row;
    align-items: center;

    p {
      margin: 0 0 0 0.625rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
    }
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

  .actions {
    margin: 0.125rem 0 0;
  }

  .submit-button {
    padding: 0.6875rem 0;
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1f252e;
    border: 1px solid #1f252e;
    border-radius: 0.375rem;
    color: #f4f4f5;
    font-size: 0.9375rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 150ms linear;

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
    &:disabled {
      cursor: default;
    }
  }

  .error {
    margin: 0.375rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;
  }
`;
