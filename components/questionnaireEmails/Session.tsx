import React from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import {
  CloudinaryAttachment,
  SessionWithAttachment,
  Year,
} from '../../interfaces';
import { formatSessionName } from '../../utils/misc';
import SessionMenu from './SessionMenu';

type Props = {
  attachments: CloudinaryAttachment[];
  session: SessionWithAttachment;
  sessions: SessionWithAttachment[];
  year: Year;
};

type UpdateAttachment = {
  public_id: string;
  updatedMetadata: string;
};

export default function Session(props: Props) {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = React.useState(false);

  const updateAttachment = useMutation(
    async ({ updatedMetadata, public_id }: UpdateAttachment) => {
      const response = await fetch(
        `/api/update-cloudinary-metadata?public_id=${public_id}&metadata=${updatedMetadata}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          'An error occurred while updating the Cloudinary metadata'
        );
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('sessions');
      },
    }
  );

  const handleRemoveAttachment = () => {
    if (props.session.attachment.session_ids) {
      const splitMetadata = props.session.attachment.session_ids.split(',');
      const updatedMetadata = splitMetadata
        .filter(m => m !== props.session.sessionId)
        .join(',');
      const public_id = props.session.attachment.public_id;
      updateAttachment.mutate({ updatedMetadata, public_id });
    }
  };

  return (
    <SessionStyles>
      <div className="session-name">
        {props.session.attachment ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="valid"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="invalid"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {formatSessionName(props.session)}
      </div>
      <div className="filename">
        {props.session.attachment ? (
          <>
            <a
              href={props.session.attachment.secure_url}
              target="_blank"
              rel="noreferrer"
              className="attachment-link"
            >
              {props.session.attachment.filename}
            </a>
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="remove-attachment-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Remove attachment</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className="session-menu-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            <span className="sr-only">Connect to a pdf</span>
          </button>
        )}
      </div>
      <SessionMenu
        attachments={props.attachments}
        show={showMenu}
        setShow={setShowMenu}
        session={props.session}
        updateAttachment={updateAttachment}
      />
    </SessionStyles>
  );
}

const SessionStyles = styled.div`
  position: relative;
  padding: 0.625rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;

  .session-name {
    display: flex;
    align-items: center;

    svg {
      margin: 0 0.5rem 0 0;
      height: 0.875rem;
      width: 0.875rem;

      &.valid {
        color: #059669;
      }

      &.invalid {
        color: #e11d48;
      }
    }
  }

  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:first-of-type {
    border-top: 1px solid #e5e7eb;
  }

  .filename {
    display: flex;
  }

  a:hover {
    text-decoration: underline;
  }

  .attachment-link {
    color: #0369a1;
    font-weight: 500;
  }

  .remove-attachment-button {
    margin: 0 0.1875rem 0 0.75rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      color: #000;
    }

    svg {
      height: 0.75rem;
      width: 0.75rem;
    }
  }

  .session-menu-button {
    padding: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 2px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: #9ca3af;
    cursor: pointer;
    transition: all 100ms linear;

    svg {
      height: 1rem;
      width: 1rem;
    }

    &:hover {
      text-decoration: underline;
      color: #111827;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border: 2px solid #0441ac;
      border-radius: 0.25rem;
    }
  }
`;
