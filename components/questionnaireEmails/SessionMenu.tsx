import React from 'react';
import styled from 'styled-components';
import { UseMutationResult } from 'react-query';
import useEscapeKeydownClose from '../../hooks/useEscapeKeydownClose';
import useCloseOnOutsideClick from '../../hooks/useCloseOnOutsideClick';
import { CloudinaryAttachment, SessionWithAttachment } from '../../types';
import { formatSessionName } from '../../utils/misc';

type Props = {
  attachments: CloudinaryAttachment[];
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  session: SessionWithAttachment;
  updateAttachment: UseMutationResult<
    void,
    unknown,
    { updatedMetadata: string; public_id: string },
    unknown
  >;
};

export default function SessionMenu(props: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  useCloseOnOutsideClick(props.show, props.setShow, menuRef);
  useEscapeKeydownClose(props.show, props.setShow);
  const [value, setValue] = React.useState(() => {
    if (props.session.attachment) {
      return props.session.attachment.public_id;
    } else {
      return 'default';
    }
  });

  const handleSaveAttachment = () => {
    const attachment = props.attachments.find(a => a.public_id === value);
    const updatedMetadata = `${
      attachment?.session_ids ? `${attachment.session_ids},` : ''
    }${props.session.sessionId}`;
    const public_id = value;
    props.updateAttachment.mutate(
      { updatedMetadata, public_id },
      {
        onSettled: () => {
          props.setShow(false);
          setValue('default');
        },
      }
    );
  };

  return (
    <SessionMenuStyles
      ref={menuRef}
      className={`session-menu${props.show ? ' show' : ''}`}
    >
      <button
        type="button"
        onClick={() => props.setShow(false)}
        className="close-button"
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
        <span className="sr-only">Close menu</span>
      </button>
      <div className="flex-col">
        <label htmlFor="select-attachment">
          Select attachment for <br />
          {formatSessionName(props.session)}
        </label>
        <select
          name="select-attachment"
          id="select-attachment"
          value={value}
          onChange={e => setValue(e.target.value)}
        >
          <option value="default">Select file</option>
          {props.attachments.map(a => (
            <option key={a.public_id} value={a.public_id}>
              {a.filename}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSaveAttachment}
          disabled={props.updateAttachment.isLoading}
          className="save-attachment-button"
        >
          {props.updateAttachment.isLoading ? 'Loading...' : 'Save attachment'}
        </button>
      </div>
    </SessionMenuStyles>
  );
}

const SessionMenuStyles = styled.div`
  display: none;
  padding: 1.5rem 2rem;
  position: absolute;
  top: 0.625rem;
  right: -0.5rem;
  z-index: 100;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  &.show {
    display: flex;
    flex-direction: column;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .close-button {
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;
    padding: 0;
    height: 1.25rem;
    width: 1.25rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;
    border-radius: 9999px;
    transition: all 150ms linear;

    &:hover {
      color: #000;
    }

    svg {
      height: 0.875rem;
      width: 0.875rem;
    }
  }

  label {
    color: #374151;
    line-height: 1.5;
  }

  .save-attachment-button {
    margin: 0.75rem 0 0;
    padding: 0.5rem 0;
    background-color: #0369a1;
    border: none;
    border-radius: 0.1875rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #f0f9ff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      background-color: #075985;
      color: #fff;
    }
  }
`;
