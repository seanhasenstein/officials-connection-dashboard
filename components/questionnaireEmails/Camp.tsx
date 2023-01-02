import Link from 'next/link';
import styled from 'styled-components';
import {
  Camp as ICamp,
  Registration,
  SessionWithAttachment,
} from '../../types';
import { formatSessionName } from '../../utils/misc';
import QuestionnaireEmailForm from './QuestionnaireEmailForm';

type Props = {
  camp: ICamp | undefined;
  emailsNeeded: Registration[];
  sessions: SessionWithAttachment[] | undefined;
};

export default function Camp(props: Props) {
  return (
    <CampStyles>
      <h3>{props.camp?.name}</h3>
      {props.camp?.questionnaireEmailSent ? (
        <div className="email-already-sent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Questionnaire emails have been sent!
        </div>
      ) : (
        <>
          <div className="emails-needed">
            <div className="emails">
              {props.emailsNeeded.length < 1 ? (
                <div className="no-emails">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All registrations have email addresses
                </div>
              ) : (
                <>
                  <h4>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Email addresses needed:
                  </h4>
                  {props.emailsNeeded.map(r => (
                    <Link
                      key={r.id}
                      href={`registrations/${r.id}`}
                      className="item"
                    >
                      <div>
                        {r.firstName} {r.lastName}
                      </div>
                      <div className="sessions">
                        {r.sessions
                          .filter(
                            s => s.camp.name === 'Kaukauna' && s.attending
                          )
                          .map(s => (
                            <div key={s.sessionId}>{formatSessionName(s)}</div>
                          ))}
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="session-attachments-check">
            {props.sessions
              ?.filter(s => s.camp.campId === props.camp?.campId)
              .every(s => s.attachment) ? (
              <div className="valid">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                All sessions have an attachment
              </div>
            ) : (
              <div className="invalid">
                <h4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Attachments needed for:
                </h4>
                <div className="flex-col">
                  {props.sessions
                    ?.filter(s => !s.attachment)
                    .map(s => (
                      <div key={s.sessionId} className="attachments-needed">
                        {formatSessionName(s)}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="send-emails-section">
            <QuestionnaireEmailForm
              camp={props.camp}
              emailsNeeded={props.emailsNeeded}
              sessions={props.sessions || []}
            />
          </div>
        </>
      )}
    </CampStyles>
  );
}

const CampStyles = styled.div`
  width: 100%;
  padding: 0.5rem 4rem;

  &:first-of-type {
    border-right: 1px solid #d1d5db;
  }

  .email-already-sent {
    margin: 2rem 0 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;

    svg {
      height: 1rem;
      width: 1rem;
      color: #059669;
    }
  }

  h4 {
    margin: 0 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1f2937;

    svg {
      height: 0.9375rem;
      width: 0.9375rem;
      color: #be123c;
    }
  }

  .emails {
    margin: 2rem 0 0;
  }

  .session-attachments-check {
    margin: 0.75rem 0 2.5rem;

    svg {
      height: 0.875rem;
      width: 0.875rem;
    }

    .valid {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #1f2937;

      svg {
        color: #059669;
      }
    }

    .invalid {
      margin: 2.5rem 0 0;
    }

    .attachments-needed {
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
      color: #1f2937;

      &:first-of-type {
        border-top: 1px solid #e5e7eb;
      }
    }
  }
`;
