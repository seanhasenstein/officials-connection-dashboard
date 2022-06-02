import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { UseMutationResult } from 'react-query';
import { Note, Registration } from '../interfaces';
import { createIdNumber } from '../utils/misc';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  notes: Note[];
  addNote: UseMutationResult<Registration, unknown, Note[], unknown>;
  deleteNote: UseMutationResult<Registration, unknown, Note[], unknown>;
};

export default function Notes({ notes, addNote, deleteNote }: Props) {
  const [text, setText] = React.useState('');

  const handleAddClick = () => {
    if (text === '') return;

    const newNote = {
      id: createIdNumber(),
      text: text.trim(),
      createdAt: `${new Date().toISOString()}`,
      updatedAt: `${new Date().toISOString()}`,
    };
    addNote.mutate([...notes, newNote], { onSuccess: () => setText('') });
  };

  const handleDeleteClick = (id: string) => {
    const filteredNotes = notes.filter(n => n.id !== id);
    deleteNote.mutate(filteredNotes);
  };

  return (
    <NoteSectionStyles>
      <h3>Notes</h3>
      <div className="notes">
        {notes?.map(n => (
          <div key={n.id} className="note">
            <div className="flex-row">
              <div>
                <div className="text">{n.text}</div>
                <div className="date">
                  {format(new Date(n.createdAt), 'MMM d, yyyy - h:mmaaa')}
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleDeleteClick(n.id)}
                className="delete-button"
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
                <span className="sr-only">Delete Note</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-section">
        <textarea
          placeholder="Add a note"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="note-actions">
          <LoadingSpinner isLoading={addNote.isLoading} />
          <button
            type="button"
            onClick={handleAddClick}
            disabled={addNote.isLoading || deleteNote.isLoading}
            className="add-button"
          >
            Add note
          </button>
        </div>
      </div>
      <DeleteLoadingSpinner isLoading={deleteNote.isLoading} />
      {addNote.isError ||
        (deleteNote.isError && (
          <div className="error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {addNote.error instanceof Error && addNote.error.message}
            {deleteNote.error instanceof Error && deleteNote.error.message}
          </div>
        ))}
    </NoteSectionStyles>
  );
}

const NoteSectionStyles = styled.div`
  .notes {
    margin: 0 0 1rem;
  }

  h3 {
    margin: 0 0 0.5rem;
  }

  .note {
    position: relative;
    padding: 1.5rem 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;

    &:last-of-type {
      border-bottom: none;
    }
  }

  .flex-row {
    padding-right: 1rem;
    display: flex;
  }

  .text {
    margin: 0.0625rem 0 0.5rem;
    font-size: 0.9375rem;
    color: #111827;
    line-height: 1.35;
  }

  .date {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #9ca3af;
  }

  .delete-button {
    padding: 0.25rem;
    display: inline-flex;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    border-radius: 9999px;

    svg {
      height: 0.75rem;
      width: 0.75rem;
    }

    &:hover svg {
      color: #374151;
    }
  }

  .note-actions {
    position: relative;
    margin: 0.875rem 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.875rem;
  }

  textarea {
    width: 100%;
  }

  .add-button {
    padding: 0.5rem 1rem;
    background-color: #1f2937;
    border: none;
    color: #f3f4f6;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 100ms linear;

    &:hover {
      background-color: #111827;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .error {
    position: absolute;
    bottom: 0;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #dc2626;
    line-height: 1.25;

    svg {
      height: 0.875rem;
      width: 0.875rem;
      color: #f87171;
    }
  }
`;

const DeleteLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 1.5rem;
  right: 1rem;
`;
