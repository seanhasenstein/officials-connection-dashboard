import React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import {
  Camp,
  Registration,
  SessionWithAttachment,
  Year,
} from '../../interfaces';

const validationSchema = Yup.object().shape({
  subject: Yup.string().required('An email subject is required'),
  nextYearsDates: Yup.string().required('Next years camp dates are required'),
});

type Props = {
  camp: Camp | undefined;
  emailsNeeded: Registration[];
  sessions: SessionWithAttachment[];
};

export default function QuestionnaireEmailForm(props: Props) {
  const queryClient = useQueryClient();
  const [active, setActive] = React.useState(false);

  const sendEmail = useMutation(
    async ({
      nextYearsDates,
      subject,
    }: {
      nextYearsDates: string;
      subject: string;
    }) => {
      const response = await fetch('/api/send-questionnaire-emails', {
        method: 'POST',
        body: JSON.stringify({ camp: props.camp, nextYearsDates, subject }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send the questionnaire emails.');
      }

      const data: { year: Year } = await response.json();

      return data.year;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('year');
      },
    }
  );

  return (
    <QuestionnaireEmailFormStyles>
      <Formik
        initialValues={{
          subject: '',
          nextYearsDates: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          sendEmail.mutate(values, {
            onSettled: () => {
              actions.setSubmitting(false);
            },
          });
        }}
      >
        {() => (
          <Form>
            <div className="flex-row">
              <h3>Send questionnaire email</h3>
              <button
                type="button"
                onClick={() => setActive(!active)}
                role="switch"
                aria-checked={active}
                className={`toggle ${active ? 'on' : 'off'}`}
                disabled={
                  props.emailsNeeded.length > 0 ||
                  props.sessions.filter(
                    s => s.camp.campId === props.camp?.campId
                  ).length < 1 ||
                  props.sessions
                    .filter(s => s.camp.campId === props.camp?.campId)
                    .some(s => !s.attachment) ||
                  // sendEmail.isLoading ||
                  // sendEmail.isSuccess ||
                  props.camp?.questionnaireEmailSent
                }
              >
                <span aria-hidden="true" className="switch" />
              </button>
            </div>
            {active ? (
              <>
                <div className="form-item">
                  <label htmlFor="subject">Email subject</label>
                  <Field name="subject" id="subject" />
                  <ErrorMessage
                    component="div"
                    name="subject"
                    className="error"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="nextYearsDates">Next years camp dates</label>
                  <Field name="nextYearsDates" id="nextYearsDates" />
                  <ErrorMessage
                    component="div"
                    name="nextYearsDates"
                    className="error"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    !active ||
                    props.emailsNeeded.length > 0 ||
                    props.sessions
                      .filter(s => s.camp.campId === props.camp?.campId)
                      .some(s => !s.attachment) ||
                    sendEmail.isLoading ||
                    sendEmail.isSuccess ||
                    props.camp?.questionnaireEmailSent
                  }
                  className={`send-questionnaires-button${
                    props.camp?.questionnaireEmailSent ? ' line-through' : ''
                  }`}
                >
                  {sendEmail.isLoading ? (
                    'Sending emails...'
                  ) : (
                    <>
                      <span
                        className={`dot ${
                          !active ||
                          props.emailsNeeded.length > 0 ||
                          props.sessions.length < 1 ||
                          props.camp?.questionnaireEmailSent ||
                          props.sessions
                            .filter(s => s.camp.campId === props.camp?.campId)
                            .some(s => !s.attachment)
                            ? 'invalid'
                            : 'valid'
                        }`}
                      />
                      Send questionnaire emails
                    </>
                  )}
                </button>
              </>
            ) : null}
          </Form>
        )}
      </Formik>
    </QuestionnaireEmailFormStyles>
  );
}

const QuestionnaireEmailFormStyles = styled.div`
  width: 100%;

  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }
  }

  .form-item {
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;

    &:first-of-type {
      margin: 4rem 0 0;
    }
  }

  .send-questionnaires-button {
    margin: 1.5rem 0 0;
    padding: 0.625rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1f2937;
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f9fafb;
    border-radius: 0.3125rem;
    cursor: pointer;

    &:hover {
      background-color: #111827;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
        rgb(99, 102, 241) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:disabled {
      background-color: #e5e7eb;
      border-color: #d1d5db;
      color: #1f2937;
      cursor: default;
      pointer-events: none;
    }
  }

  .error {
    margin: 0.3125rem 0 0 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #be123c;
  }
`;
