import React from 'react';
import styled from 'styled-components';
import useOutsideClick from '../hooks/useOutsideClick';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useToggleScroll from '../hooks/useToggleScroll';
import LoadingSpinner from './LoadingSpinner';

type DeleteModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
  isLoading: boolean;
  category: string;
};

export default function DeleteModal({
  showModal,
  setShowModal,
  callback,
  isLoading,
  category,
}: DeleteModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(showModal, setShowModal, modalRef);
  useEscapeKeydownClose(showModal, setShowModal);
  useToggleScroll(showModal);

  const handleDeleteClick = () => {
    callback();
  };

  return (
    <DeleteModalStyles showModal={showModal}>
      <div ref={modalRef} className="modal">
        <h3>Delete {category}</h3>
        <p>
          Are you sure you want to delete this {category}? This cannot be
          undone.
        </p>
        <div className="actions">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="primary-button"
          >
            Delete
          </button>
        </div>
        <DeleteLoadingSpinner isLoading={isLoading} />
      </div>
    </DeleteModalStyles>
  );
}

const DeleteModalStyles = styled.div<{ showModal: boolean }>`
  display: ${props => (props.showModal ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  .modal {
    position: relative;
    padding: 2.5rem 3rem;
    max-width: 30rem;
    width: 100%;
    text-align: left;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;

    h3 {
      margin: 0 0 1.125rem;
      font-size: 1.125rem;
      font-weight: 500;
      color: #111827;
    }

    p {
      margin: 0 0 1.25rem;
      font-size: 0.9375rem;
      color: #4b5563;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .primary-button,
  .secondary-button {
    cursor: pointer;
    font-size: 0.875rem;
  }

  .primary-button {
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    color: #b91c1c;
    background-color: #fee2e2;
    border: 1px solid #fdcfcf;
    box-shadow: inset 0 1px 1px #fff;
    border-radius: 0.25rem;

    &:hover {
      color: #a81919;
      border-color: #fcbcbc;
      box-shadow: inset 0 1px 1px #fff, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      text-decoration: underline;
    }
  }

  .secondary-button {
    color: #6b7280;
    background-color: transparent;
    border: none;

    &:hover {
      color: #1f2937;
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      text-decoration: underline;
    }
  }
`;

const DeleteLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
`;
