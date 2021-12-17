import React from 'react';
import styled from 'styled-components';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useOutsideClick from '../hooks/useOutsideClick';
import { SortOrder, SortVariable } from '../interfaces';

type Props = {
  setOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
  setVariable: React.Dispatch<React.SetStateAction<SortVariable>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMenuButtonClick: (id: string) => void;
};

export default function RegistrationSort({
  setOrder,
  setVariable,
  isOpen,
  setIsOpen,
  handleMenuButtonClick,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(isOpen, setIsOpen, containerRef);
  useEscapeKeydownClose(isOpen, setIsOpen);

  return (
    <RegistrationSortStyles isOpen={isOpen}>
      <button
        type="button"
        onClick={() => handleMenuButtonClick('sort')}
        className="action-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
        Sort
      </button>
      <div ref={containerRef} className="sort-menu">
        <div className="options">
          <select
            id="variable"
            defaultValue="lastName"
            onBlur={e => setVariable(e.target.value as SortVariable)}
            onChange={e => setVariable(e.target.value as SortVariable)}
          >
            <option value="lastName">Last name</option>
            <option value="date">Date</option>
          </select>
          <select
            id="order"
            defaultValue="ascending"
            onBlur={e => setOrder(e.target.value as SortOrder)}
            onChange={e => setOrder(e.target.value as SortOrder)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>
    </RegistrationSortStyles>
  );
}

const RegistrationSortStyles = styled.div<{ isOpen: boolean }>`
  position: relative;
  flex-shrink: 0;

  .action-button {
    margin: 0 0 1.125rem;
    padding: 0.375rem 0.875rem;
    display: flex;
    align-items: center;
    background-color: #e5e7eb;
    border: 1px solid #d1d5db;
    box-shadow: inset 0 1px 1px #fff;
    border-radius: 0.3125rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    letter-spacing: 0.0125em;
    cursor: pointer;
    transition: all 100ms ease-in-out;

    &:hover {
      border-color: #bbc1ca;
      color: #111827;
      box-shadow: inset 0 1px 1px #fff, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    svg {
      margin: 0 0.375rem 0 0;
      height: 0.875rem;
      width: 0.875rem;

      color: #9ca3af;
    }
  }

  .sort-menu {
    position: absolute;
    top: 2.75rem;
    left: 0;
    display: ${props => (props.isOpen ? 'flex' : 'none')};
  }

  .options {
    padding: 1rem 1.25rem;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 24rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }

  select {
    width: 100%;
  }
`;
