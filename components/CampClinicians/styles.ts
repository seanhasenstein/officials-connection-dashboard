import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
  }

  .table-container {
    flex: 1;
    margin: 1.25rem 0 0;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    max-width: 42rem;
    background-color: #fff;
    border-radius: 0.1875rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    padding: 0.5rem 1rem;

    &:first-of-type {
      padding-left: 0;
    }
  }

  th {
    padding-top: 0;
    padding-bottom: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #111827;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    font-size: 0.8125rem;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;

    &:first-of-type {
      font-weight: 600;
      color: #111827;
    }

    &:last-of-type {
      padding-right: 0;
      text-align: right;
    }
  }

  .edit-button {
    padding: 0.0625rem 0 0.0625rem 0.5rem;
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 0.8125rem;
    font-weight: 400;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.05s linear;

    &:hover {
      color: #111827;
      text-decoration: underline;
    }
  }

  .no-clinicians {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;

    .table-container {
      display: flex;
      align-items: center;
    }
  }

  @media (min-width: 1248px) {
    .no-clinicians {
      .table-container {
        justify-content: center;
      }
    }
  }
`;
