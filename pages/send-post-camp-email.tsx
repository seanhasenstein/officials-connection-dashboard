import React from 'react';
import styled from 'styled-components';

import Layout from 'components/Layout';

import useRegistrationsQuery from 'hooks/queries/useRegistrationsQuery';
import useCloseOnOutsideClick from 'hooks/useCloseOnOutsideClick';

import { formatPhoneNumber, formatSessionName } from 'utils/misc';

import { Registration } from 'types';

export default function SendPostCampEmail() {
  const [searchInput, setSearchInput] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Registration[]>([]);
  const [hasSearchResults, setHasSearchResults] = React.useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    React.useState<Registration | null>(null);
  const [selectedSession, setSelectedSession] = React.useState<{
    sessionId: string;
    camp: 'Kaukauna' | 'Plymouth';
  } | null>(null);
  const [sendActive, setSendActive] = React.useState(false);
  const [sessionValidationError, setSessionValidationError] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'error' | 'success'>(
    'idle'
  );
  const [successfulSentName, setSuccessfulSentName] = React.useState<string>();

  const searchResultsRef = React.useRef<HTMLDivElement>(null);

  const registrationsQuery = useRegistrationsQuery();

  useCloseOnOutsideClick(
    hasSearchResults,
    setHasSearchResults,
    searchResultsRef
  );

  const resetState = () => {
    setSearchInput('');
    setSearchResults([]);
    setHasSearchResults(false);
    setSelectedRegistration(null);
    setSelectedSession(null);
    setSendActive(false);
    setSessionValidationError(false);
  };

  const handleSendEmail = async () => {
    if (!selectedSession?.camp || !selectedSession?.sessionId) {
      setSessionValidationError(true);
    } else if (
      selectedRegistration &&
      selectedSession.camp &&
      selectedSession.sessionId
    ) {
      setIsLoading(true);
      const response = await fetch('/api/send-single-post-camp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campName: selectedSession.camp,
          registrationId: selectedRegistration.id,
          sessionId: selectedSession.sessionId,
        }),
      });

      if (response.ok) {
        setSuccessfulSentName(
          `${selectedRegistration.firstName} ${selectedRegistration.lastName}`
        );
        resetState();
        setStatus('success');
      } else {
        // todo: handle error
        setStatus('error');
      }
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (registrationsQuery.data && searchInput.length > 2) {
      const results = registrationsQuery.data.filter(r => {
        const fullName = `${r.firstName} ${r.lastName}`;
        return fullName.toLowerCase().includes(searchInput.toLowerCase());
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [registrationsQuery.data, searchInput]);

  React.useEffect(() => {
    if (searchResults.length > 0) {
      setHasSearchResults(true);

      if (!hasSearchResults) {
        setSearchResults([]);
      }
    }
  }, [hasSearchResults, searchResults]);

  return (
    <Layout>
      <SendPostCampEmailStyles>
        <div className="container">
          <div className="page-header">
            <h3>Send a post session email</h3>
            <p>
              Send a post session email to a camper. The email will include
              links to their filmed games (if they have any), a link to their
              session contact info page, and a link to their questionnaire.
            </p>
          </div>
          <div className="main-content">
            <div className="form">
              <div className="form-item">
                <label htmlFor="camper">Search for a camper</label>
                <input
                  type="text"
                  id="camper"
                  name="camper"
                  onChange={e => {
                    setSearchInput(e.target.value);
                    if (status === 'success') {
                      setSuccessfulSentName(undefined);
                      setStatus('idle');
                    }
                  }}
                  value={searchInput}
                />
              </div>
              {hasSearchResults && searchResults.length > 0 && (
                <div className="search-results-dropdown" ref={searchResultsRef}>
                  {searchResults.map(r => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => {
                        setSelectedRegistration(r);
                        setSearchInput(`${r.firstName} ${r.lastName}`);
                        setHasSearchResults(false);
                        if (r.sessions.length === 1) {
                          const sessionId = r.sessions[0].sessionId;
                          const camp = r.sessions[0].camp.name as
                            | 'Kaukauna'
                            | 'Plymouth';
                          setSelectedSession({ sessionId, camp });
                        }
                      }}
                      className="select-camper-button"
                    >
                      <div>
                        <p className="name">{`${r.firstName} ${r.lastName}`}</p>
                        <div>
                          {r.sessions.map(s => (
                            <p key={s.sessionId} className="session">
                              {formatSessionName(s)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedRegistration && (
              <div className="selected-camper">
                <p className="label">Selected camper:</p>
                <div className="row">
                  <div>
                    <p className="name">{`${selectedRegistration.firstName} ${selectedRegistration.lastName}`}</p>
                    <p className="email">{selectedRegistration.email}</p>
                    <p className="phone">
                      {formatPhoneNumber(selectedRegistration.phone)}
                    </p>
                    <div className="sessions">
                      <p className="sessions-label">Select a session:</p>
                      {selectedRegistration.sessions.map(s => (
                        <label key={s.sessionId} className="session">
                          <input
                            type="radio"
                            name="session"
                            value={s.sessionId}
                            onChange={() => {
                              setSelectedSession({
                                sessionId: s.sessionId,
                                camp: s.camp.name as 'Kaukauna' | 'Plymouth',
                              });
                              setSessionValidationError(false);
                            }}
                            checked={selectedSession?.sessionId === s.sessionId}
                          />
                          <span
                            className={
                              selectedSession?.sessionId === s.sessionId
                                ? 'selected'
                                : ''
                            }
                          >
                            {formatSessionName(s)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="reset-button"
                    onClick={resetState}
                  >
                    Reset
                  </button>
                </div>
                <div className="activate">
                  <div className="row">
                    <button
                      type="button"
                      className="send-email-button"
                      onClick={handleSendEmail}
                      disabled={!sendActive}
                    >
                      {sendActive
                        ? isLoading
                          ? 'Sending...'
                          : 'Send the post camp email'
                        : 'Click the switch to activate this button'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendActive(!sendActive)}
                      role="switch"
                      aria-checked={sendActive}
                      className={`toggle ${sendActive ? 'on' : 'off'}`}
                    >
                      <span aria-hidden="true" className="switch" />
                    </button>
                  </div>
                  {sessionValidationError && (
                    <p className="validation-error">A session is required</p>
                  )}
                </div>
              </div>
            )}
            {status === 'success' && (
              <p className="success-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="circle-check-icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                Email sent successfully to {successfulSentName}
              </p>
            )}
          </div>
        </div>
      </SendPostCampEmailStyles>
    </Layout>
  );
}

const SendPostCampEmailStyles = styled.div`
  padding: 2.5rem 3.25rem;
  min-height: calc(100vh - 151px);
  background-color: #f3f4f6;

  .container {
    position: relative;
    margin: 0 auto;
    max-width: 90rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2.25rem 0;
    .page-header {
      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
      }
      p {
        margin: 0.75rem 0 0;
        max-width: 36rem;
        font-size: 0.9375rem;
        color: #6b7280;
        line-height: 150%;
      }
    }
    .main-content {
      max-width: 30rem;
      .form {
        position: relative;
        .form-item {
          display: flex;
          flex-direction: column;
          input {
            border-radius: 0.375rem;
          }
        }
        .search-results-dropdown {
          position: absolute;
          top: 3.875rem;
          left: 0;
          width: 103%;
          margin: 0.75rem 0 0 -1.5%;
          display: flex;
          flex-direction: column;
          border: 1px solid #d4d4d8;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
          border-radius: 0.375rem;
          z-index: 100;
          .select-camper-button {
            padding: 0.375rem 0.625rem;
            background-color: #fff;
            border-width: 0 0 1px 0;
            border-style: solid;
            border-color: #d4d4d8;
            text-align: left;
            cursor: pointer;
            &:hover {
              background-color: #fbfbfb;
            }
            &:first-of-type {
              border-top-right-radius: 0.375rem;
              border-top-left-radius: 0.375rem;
            }
            &:last-of-type {
              border-bottom-right-radius: 0.375rem;
              border-bottom-left-radius: 0.375rem;
              border-width: 0;
            }
            p {
              margin: 0;
              font-size: 0.75rem;
              &.name {
                font-weight: 600;
                color: #09090b;
              }
              &.session {
                margin: 0.125rem 0 0;
                font-weight: 500;
                color: #71717a;
              }
            }
          }
        }
      }
      .selected-camper {
        position: relative;
        margin: 1.5rem 0 0;
        padding: 1rem;
        background-color: #fff;
        border: 1px solid #d4d4d8;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        .label {
          margin: 0;
          padding: 0 0 0.875rem;
          width: 100%;
          font-size: 0.75rem;
          font-weight: 700;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-bottom: 1px solid #d4d4d8;
        }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 0 1rem;
          p {
            margin: 0;
            font-size: 0.875rem;
            line-height: 100%;
            &.name {
              margin: 0.875rem 0 0;
              font-weight: 600;
              color: #09090b;
            }
            &.email,
            &.phone {
              font-size: 0.75rem;
              font-weight: 500;
              color: #71717a;
            }
            &.email {
              margin: 0.25rem 0 0;
            }
            &.phone {
              margin: 0.375rem 0 0;
            }
          }
          .sessions {
            margin: 1rem 0 0;
            .sessions-label {
              margin: 0;
              font-size: 0.8125rem;
              font-weight: 600;
              color: #09090b;
            }
          }
          .session {
            margin: 0.5rem 0 0;
            display: flex;
            align-items: center;
            gap: 0 0.25rem;
            input[type='radio'] {
              height: 1rem;
              width: 1rem;
            }
            span {
              margin: 0.125rem 0 0;
              font-size: 0.8125rem;
              font-weight: 500;
              color: #71717a;
              line-height: 100%;
              &.selected {
                font-weight: 600;
                color: #09090b;
              }
            }
          }
          .reset-button {
            position: absolute;
            top: 3.875rem;
            right: 1.125rem;
            padding: 0;
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: #111827;
            font-size: 0.75rem;
            font-weight: 500;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .activate {
          margin: 1rem 0 0;
          padding: 0.5rem 0.625rem;
          background-color: #f9f9f9;
          border: 1px solid #d4d4d8;
          border-radius: 0.375rem;
          .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .toggle {
              padding: 0;
              position: relative;
              flex-shrink: 0;
              display: inline-flex;
              height: 1.125rem;
              width: 2rem;
              border: 2px solid transparent;
              border-radius: 9999px;
              transition-property: background-color, border-color, color, fill,
                stroke;
              transition-duration: 0.2s;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
              &:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
              }
              &:focus-visible {
                box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
                  rgb(99, 102, 241) 0px 0px 0px 4px,
                  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
              }
              &.on {
                background-color: #059669;
                & .switch {
                  transform: translateX(0.8125rem);
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
              width: 0.875rem;
              height: 0.875rem;
              background-color: #fff;
              border-radius: 9999px;
              box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
                rgba(59, 130, 246, 0.5) 0px 0px 0px 0px,
                rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
                rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
              pointer-events: none;
              transition-duration: 0.2s;
              transition-property: background-color, border-color, color, fill,
                stroke, opacity, box-shadow, transform, filter, backdrop-filter,
                -webkit-backdrop-filter;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }
          }
          .send-email-button {
            width: 100%;
            padding: 0.5rem 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #1f2937;
            border: none;
            border-radius: 0.375rem;
            text-align: left;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
            color: #f3f4f6;
            cursor: pointer;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            transition: all 150ms linear;
            &:hover:not(:disabled) {
              background-color: #111827;
            }
            &:disabled {
              background-color: #71717a;
              box-shadow: none;
              pointer-events: none;
              cursor: default;
            }
          }
        }
        .validation-error {
          margin: 0.5rem 0 0;
          font-size: 0.75rem;
          font-weight: 500;
          color: #c2410c;
        }
      }
      .success-message {
        margin: 0.75rem 0 0;
        display: flex;
        align-items: center;
        gap: 0 0.3125rem;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #09090b;
        .circle-check-icon {
          height: 1rem;
          width: 1rem;
          color: #059669;
        }
      }
    }
  }
`;
