import styled from 'styled-components';

export default styled.div`
  margin: 1.125rem 0 0;
  text-align: center;

  .trigger-delete-button {
    margin: 0 auto;
    padding: 0;
    background-color: transparent;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #991b1b;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .final-step {
    margin: 1.25rem 0 0;
    padding: 0.75rem 0;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.1875rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
  }

  .delete-actions {
    margin: 1rem 0 0;
    display: flex;
    justify-content: center;
    gap: 1.25rem;
  }

  .delete-button,
  .cancel-button {
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .cancel-button {
    color: #1f2937;
    font-size: 0.875rem;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .delete-button {
    padding: 0.3125rem 0.6875rem;
    background-color: #991b1b;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    border-radius: 0.25rem;
    transition: all 150ms ease-in-out;

    &:hover {
      background-color: #7f1d1d;
    }
  }

  .error {
    margin: 0.875rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;
  }
`;
