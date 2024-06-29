import { useMutation, useQueryClient } from 'react-query';

import Modal from '../composedBlock/Modal';

import { Year } from 'types';
import { HydratedGame } from 'components/filmedGames/Camp';

import StyledComponent from './styles';

type Props = {
  year: Year;
  game: HydratedGame;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteFilmedGameModal({
  year,
  game,
  isVisible,
  setIsVisible,
}: Props) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    async () => {
      const updatedGames = year?.filmedGames.filter(g => g.id !== game.id);
      await fetch('/api/filmed-games/update', {
        method: 'POST',
        body: JSON.stringify(updatedGames),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('year');
        const updatedFilmedGames = year.filmedGames.filter(
          g => g.id !== game.id
        );
        queryClient.setQueryData('year', {
          ...year,
          filmedGames: updatedFilmedGames,
        });
        setIsVisible(false);
      },
      onError: () => {
        // todo: handle error (show a toast?)
        queryClient.invalidateQueries('year');
        queryClient.setQueryData('year', year);
      },
    }
  );

  const handleDeleteClick = () => {
    mutate();
  };

  return (
    <StyledComponent>
      <Modal
        {...{ isVisible, setIsVisible }}
        customContainerClass="delete-game-modal"
      >
        <h3>Delete this game?</h3>
        <p>
          Are you sure you want to delete {game.name}. This action cannot be
          undone.
        </p>
        <div className="actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setIsVisible(false);
            }}
          >
            No, cancel
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteClick}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </Modal>
    </StyledComponent>
  );
}
