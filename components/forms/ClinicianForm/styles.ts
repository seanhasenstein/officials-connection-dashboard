import styled from 'styled-components';

export default styled.div`
  .form-item {
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;

    &:first-of-type {
      margin: 1.75rem 0 0;
    }

    &.radio-item {
      margin-bottom: 1.75rem;
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      width: 100%;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

      label {
        margin: 0 0 0 -1px;
        padding: 0.75rem 1.25rem;
        display: flex;
        align-items: center;
        border: 1px solid #d1d5db;
        cursor: pointer;

        &.active {
          background-color: #f3f4f6;
          border-color: #c6cbd2;
          z-index: 2;
          color: #030712;
        }

        &.disabled {
          cursor: not-allowed;
        }

        &:first-of-type {
          border-radius: 0.375rem 0 0 0.375rem;
        }

        &:last-of-type {
          border-radius: 0 0.375rem 0.375rem 0;
        }
      }

      input {
        margin: 0 0.5rem 0 0;
        color: #1f2937;

        &:disabled {
          cursor: not-allowed;
        }
      }
    }
  }

  .grid-col-2 {
    margin: 1rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0 1rem;

    .form-item {
      margin: 0;
    }
  }

  .actions {
    margin: 2rem 0 0;
    display: flex;
    gap: 1rem;
  }

  .submit-button {
    padding: 0.6875rem 0;
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1f252e;
    border: 1px solid #1f252e;
    border-radius: 0.375rem;
    color: #f4f4f5;
    font-size: 0.9375rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      background-color: #0f1217;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255 255 255) 0px 0px 0px 2px, #0448bf 0px 0px 0px 4px,
        rgb(0 0 0 / 5%) 0px 1px 2px 0px;
    }
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;
  }
`;
