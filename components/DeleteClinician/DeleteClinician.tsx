import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import DeleteClinicianComponent from './styles';

type Props = {
  id: string;
  camp: 'Kaukauna Camp' | 'Plymouth Camp';
  modalIsOpen: boolean;
  closeModal: () => void;
};

export default function DeleteClinician({
  id,
  camp,
  modalIsOpen,
  closeModal,
}: Props) {
  const [showDeleteButton, setShowDeleteButton] = React.useState(false);
  const [serverError, setServerError] = React.useState(false);

  const queryClient = useQueryClient();

  const deleteClinician = useMutation(
    async (values: { id: string; camp: 'Kaukauna Camp' | 'Plymouth Camp' }) => {
      const response = await fetch('/api/clinician/delete', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete clinician');
      }

      const data = await response.json();
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('year');
      },
      onSuccess: () => {
        setServerError(false);
        setShowDeleteButton(false);
        closeModal();
      },
    }
  );

  const { isLoading } = deleteClinician;

  React.useEffect(() => {
    if (!modalIsOpen) {
      setShowDeleteButton(false);
      setServerError(false);
    }
  }, [modalIsOpen]);

  return (
    <DeleteClinicianComponent>
      {showDeleteButton ? (
        <div className="final-step">
          <p>Are you sure you want to delete?</p>
          <div className="delete-actions">
            <button
              type="button"
              onClick={() => setShowDeleteButton(false)}
              disabled={isLoading}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                deleteClinician.mutate(
                  { id, camp },
                  {
                    onError: () => {
                      setShowDeleteButton(false);
                      setServerError(true);
                    },
                  }
                );
              }}
              className="delete-button"
            >
              {isLoading ? 'Deleting...' : 'Yes, delete'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowDeleteButton(true)}
          disabled={isLoading}
          className="trigger-delete-button"
        >
          Delete this clinician
        </button>
      )}
      {serverError && <div className="error">A server error occurred!</div>}
    </DeleteClinicianComponent>
  );
}
