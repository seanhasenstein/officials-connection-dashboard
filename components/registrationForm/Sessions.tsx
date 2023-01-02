import styled from 'styled-components';
import { Field } from 'formik';
import { Session } from '../../types';
import { formatSessionName } from '../../utils/misc';

type Props = {
  sessions: Session[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

export default function Sessions({ sessions, setFieldValue }: Props) {
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
    <SessionsStyles>
      <div className="section">
        <h3>Select Sessions</h3>
        {sessions?.map(s => (
          <div key={s.sessionId} className="checkbox-item">
            <label htmlFor={`session-${s.sessionId}`}>
              <Field
                type="checkbox"
                id={`session-${s.sessionId}`}
                name={`session-${s.sessionId}`}
                checked={s.isChecked || false}
                onChange={() => handleCheckboxChange(s.sessionId)}
              />
              {formatSessionName(s)}
            </label>
          </div>
        ))}
      </div>

      {sessions.some(s => s.isChecked) && (
        <div className="section">
          <h3>Session Status</h3>
          <p>
            Toggle selected sessions from attending to not-attending status.
          </p>
          <div className="sessions-status">
            {sessions?.map(s => {
              if (s.isChecked) {
                return (
                  <div key={s.sessionId} className="status-item">
                    <p>{formatSessionName(s)}</p>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.sessionId)}
                      role="switch"
                      aria-checked={s.attending}
                      className={`toggle ${s.attending ? 'on' : 'off'}`}
                    >
                      <span className="sr-only">Toggle attending</span>
                      <span aria-hidden="true" className="switch" />
                    </button>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </SessionsStyles>
  );
}

const SessionsStyles = styled.div`
  .sessions-status {
    margin: 1.5rem 0;
  }

  .status-item {
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
  }
`;
