import React from 'react';
import styled from 'styled-components';
import useMenu from '../hooks/useMenu';
import {
  FilterOptions,
  Registration,
  SortOrder,
  SortVariable,
} from '../interfaces';
import {
  formatSessionNameFromId,
  sortString,
  splitCamelCase,
} from '../utils/misc';
import RegistrationFilter from './RegistrationFilter';
import RegistrationSort from './RegistrationSort';
import useYearQuery from '../hooks/queries/useYearQuery';

type Props = {
  regQueryData: Registration[] | undefined;
  sortOrder: SortOrder;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
  sortVariable: SortVariable;
  setSortVariable: React.Dispatch<React.SetStateAction<SortVariable>>;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
};

export default function SortAndFilter({
  regQueryData,
  sortOrder,
  setSortOrder,
  sortVariable,
  setSortVariable,
  filterOptions,
  setFilterOptions,
  setRegistrations,
}: Props) {
  const { isLoading, sessions } = useYearQuery();
  const { isOpen, setIsOpen, handleMenuButtonClick, activeMenuId } = useMenu();

  React.useEffect(() => {
    if (regQueryData) {
      // FILTER
      const filteredData = regQueryData.filter(r => {
        const includesPaymentStatus =
          filterOptions.paymentStatus.length > 0
            ? filterOptions.paymentStatus.includes(r.paymentStatus)
            : true;
        const includesASession =
          filterOptions.sessions.length > 0
            ? filterOptions.sessions.some(s =>
                r.sessions.some(rs => rs.sessionId === s)
              )
            : true;

        return includesPaymentStatus && includesASession ? true : false;
      });

      // SORT
      if (sortVariable === 'lastName') {
        if (sortOrder === 'ascending') {
          const sortResult = sortString(
            filteredData,
            'lastName',
            'firstName',
            'ascending'
          );
          setRegistrations([...sortResult]);
        }
        if (sortOrder === 'descending') {
          const sortResult = sortString(
            filteredData,
            'lastName',
            'firstName',
            'descending'
          );
          setRegistrations([...sortResult]);
        }
      }

      if (sortVariable === 'date') {
        if (sortOrder === 'ascending') {
          const sortResult = sortString(
            filteredData,
            'createdAt',
            '',
            'ascending'
          );
          setRegistrations([...sortResult]);
        }
        if (sortOrder === 'descending') {
          const sortResult = sortString(
            filteredData,
            'createdAt',
            '',
            'descending'
          );
          setRegistrations([...sortResult]);
        }
      }
    }
  }, [
    filterOptions.paymentStatus,
    filterOptions.sessions,
    regQueryData,
    setRegistrations,
    sortOrder,
    sortVariable,
  ]);

  const handlePaymentStatusRemoval = (value: string) => {
    const update = filterOptions.paymentStatus.filter(s => s !== value);
    setFilterOptions(prevState => ({ ...prevState, paymentStatus: update }));
  };

  const handleSessionRemoval = (value: string) => {
    const update = filterOptions.sessions.filter(s => s !== value);
    setFilterOptions(prevState => ({ ...prevState, sessions: update }));
  };

  if (isLoading) {
    return <div />;
  }

  if (!sessions) {
    throw new Error("Failed to load the year's sessions");
  }

  return (
    <SortAndFilterStyles>
      <RegistrationSort
        setOrder={setSortOrder}
        setVariable={setSortVariable}
        isOpen={isOpen && activeMenuId === 'sort'}
        setIsOpen={setIsOpen}
        handleMenuButtonClick={handleMenuButtonClick}
      />
      <RegistrationFilter
        filter={filterOptions}
        setFilter={setFilterOptions}
        isOpen={isOpen && activeMenuId === 'filter'}
        setIsOpen={setIsOpen}
        handleMenuButtonClick={handleMenuButtonClick}
      />
      <div className="filter-items">
        {filterOptions.paymentStatus.map(s => (
          <div key={s} className="filter-item">
            {splitCamelCase(s)}
            <button
              type="button"
              onClick={() => handlePaymentStatusRemoval(s)}
              className="remove-button"
            >
              <span className="sr-only">Remove filter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        {filterOptions.sessions.map(s => (
          <div key={s} className="filter-item">
            {formatSessionNameFromId(sessions, s)}
            <button
              type="button"
              onClick={() => handleSessionRemoval(s)}
              className="remove-button"
            >
              <span className="sr-only">Remove filter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </SortAndFilterStyles>
  );
}

const SortAndFilterStyles = styled.div`
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 1rem;
  }

  .filter-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-item {
    padding: 0.25rem 0.5rem 0.3125rem 0.875rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: capitalize;
    border: 1px solid #d1d5db;
    border-radius: 0.3125rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .remove-button {
    margin: 0 0 0 0.25rem;
    padding: 0.25rem;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #111827;

    svg {
      height: 0.75rem;
      width: 0.75rem;
    }

    &:hover {
      color: #991b1b;
    }
`;
