import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import {
  CloudinaryAttachment,
  Registration,
  SessionWithAttachment,
  Year,
} from '../../types';
import { formatSessionName } from '../../utils/misc';
import SessionAttachments from './SessionAttachments';
import QuestionnaireEmailForm from './QuestionnaireEmailForm';

type Props = {
  year: Year | undefined;
};

type CloudinaryQuery = {
  attachments: CloudinaryAttachment[];
  kaukaunaEmailsNeeded: Registration[];
  plymouthEmailsNeeded: Registration[];
  sessions: SessionWithAttachment[];
};

export default function SendQuestionnaireEmails(props: Props) {
  const [allow, setAllow] = React.useState(false);
  const cloudinaryQuery = useQuery<CloudinaryQuery, Error>(
    ['sessions', 'attachments'],
    async () => {
      const response = await fetch('/api/get-cloudinary-attachments');

      if (!response.ok) {
        throw new Error(
          'An error occurred fetching the cloudinary attachments'
        );
      }

      const data: CloudinaryQuery = await response.json();
      return {
        attachments: data.attachments,
        kaukaunaEmailsNeeded: data.kaukaunaEmailsNeeded,
        plymouthEmailsNeeded: data.plymouthEmailsNeeded,
        sessions: data.sessions,
      };
    },
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );

  if (!props.year) {
    return null;
  }

  return (
    <div className="box">
      <div className="header-row">
        <h2>Questionnaire emails</h2>
        <button
          type="button"
          onClick={() => setAllow(!allow)}
          role="switch"
          aria-checked={allow}
          className={`toggle ${allow ? 'on' : 'off'}`}
        >
          <span aria-hidden="true" className="switch" />
        </button>
      </div>
      {allow ? (
        <>
          <div className="section">
            <SessionAttachments
              attachments={cloudinaryQuery.data?.attachments || []}
              sessions={cloudinaryQuery.data?.sessions || []}
              year={props.year}
            />
          </div>
          <div className="section emails-and-form">
            <div className="grid">
              <div className="camp w-1/2">
                <h3>Kaukauna emails needed:</h3>
                {cloudinaryQuery.data &&
                  cloudinaryQuery.data.kaukaunaEmailsNeeded.length < 1 && (
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
                      No emails needed
                    </div>
                  )}
                {cloudinaryQuery.data?.kaukaunaEmailsNeeded.map(r => (
                  <Link
                    key={r._id}
                    href={`registrations/${r._id}`}
                    className="item"
                  >
                    <div>
                      {r.firstName} {r.lastName}
                    </div>
                    <div className="sessions">
                      {r.sessions
                        .filter(s => s.camp.name === 'Kaukauna' && s.attending)
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
              </div>
              <div className="camp w-1/2">
                <h3>Plymouth emails needed:</h3>
                {cloudinaryQuery.data &&
                  cloudinaryQuery.data.plymouthEmailsNeeded.length < 1 && (
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
                      No emails needed
                    </div>
                  )}
                {cloudinaryQuery.data?.plymouthEmailsNeeded.map(r => (
                  <Link
                    key={r._id}
                    href={`registrations/${r._id}`}
                    className="item"
                  >
                    {r.firstName} {r.lastName} <span>{r.registrationId}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="send-emails-section">
              <h3>Send camp emails</h3>
              <div className="email-grid">
                {props.year.camps.map(c => (
                  <QuestionnaireEmailForm
                    key={c.campId}
                    camp={c}
                    emailsNeeded={
                      c.location.city.toLowerCase() === 'kaukauna'
                        ? cloudinaryQuery.data?.kaukaunaEmailsNeeded || []
                        : cloudinaryQuery.data?.plymouthEmailsNeeded || []
                    }
                    sessions={
                      cloudinaryQuery.data?.sessions.filter(
                        s => s.camp.campId === c.campId
                      ) || []
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
