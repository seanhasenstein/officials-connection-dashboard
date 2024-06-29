import styled from 'styled-components';

export default styled.div`
  .delete-game-modal {
    padding: 1.5rem 1.875rem 1.5rem;
    max-width: 32rem;
    width: 100%;

    h3 {
      margin: 0 0 1.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      text-transform: none;
      letter-spacing: -0.0125em;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      .cancel-button,
      .delete-button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 0.375rem;
      }
      .cancel-button {
        color: #09090b;
        background-color: #fff;
        border: 1px solid #d4d4d8;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        transition: background-color 0.5s ease;
        &:hover {
          background-color: #fafafa;
        }
      }
      .delete-button {
        color: #fef2f2;
        background-color: #b91c1c;
        border: none;
        transition: background-color 0.25s ease, color 0.25s ease;
        &:hover {
          background-color: #a31313;
          color: #fff;
        }
      }
    }
  }
`;
