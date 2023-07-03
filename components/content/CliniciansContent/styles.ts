import styled from 'styled-components';

export default styled.div`
  position: relative;
  padding: 3.5rem 3.25rem;
  min-height: calc(100vh - 151px);
  background-color: #f3f4f6;

  .container {
    display: flex;
    flex-direction: column;
    gap: 3rem 0;
  }

  .add-button {
    margin: 0;
    padding: 0;
    height: 2rem;
    width: 2rem;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e5e7eb;
    border: 1px solid #d1d5db;
    border-radius: 9999px;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 120%;
    cursor: pointer;
    transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;

    svg {
      height: 1rem;
      width: 1rem;
    }

    &:hover {
      color: #111827;
      border-color: #bbc1ca;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.075),
        0 1px 2px -1px rgb(0 0 0 / 0.075);
    }
  }

  @media (min-width: 1248px) {
    .container {
      flex-direction: row;
      gap: 0 3rem;
    }
  }
`;
