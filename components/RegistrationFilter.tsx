import React from 'react';
import styled from 'styled-components';
import { FilterOptions } from '../interfaces';
import { formatSessionName } from '../utils/misc';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useOutsideClick from '../hooks/useOutsideClick';
import { useYearQuery } from '../hooks/useYearQuery';

type Props = {
  filter: { paymentStatus: string[]; sessions: string[] };
  setFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMenuButtonClick: (id: string) => void;
};

type Nav = 'paymentStatus' | 'session';

const paymentStatusOptions = [
  { id: 1, name: 'paid', label: 'Paid' },
  { id: 2, name: 'unpaid', label: 'Unpaid' },
  { id: 3, name: 'fullyRefunded', label: 'Fully Refunded' },
  { id: 4, name: 'partiallyRefunded', label: 'Partially Refunded' },
];

export default function RegistrationFilter({
  filter,
  setFilter,
  isOpen,
  setIsOpen,
  handleMenuButtonClick,
}: Props) {
  const { sessions } = useYearQuery();
  const [active, setActive] = React.useState<Nav>('paymentStatus');
  const containerRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(isOpen, setIsOpen, containerRef);
  useEscapeKeydownClose(isOpen, setIsOpen);

  const handleNavClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.value as Nav);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FilterOptions;
    if (!e.target.checked) {
      const update = filter[name].filter(v => v !== e.target.value);
      setFilter({ ...filter, [name]: update });
      return;
    }
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: [...prevFilter[name], e.target.value],
    }));
  };

  return (
    <RegistrationFilterStyles isOpen={isOpen}>
      <button
        type="button"
        onClick={() => handleMenuButtonClick('filter')}
        className="action-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Filter
      </button>

      <div ref={containerRef} className="filter-menu">
        <div>
          <div className="nav">
            <div className="radio-item">
              <input
                type="radio"
                name="nav"
                id="paymentStatus"
                value="paymentStatus"
                checked={active === 'paymentStatus'}
                onChange={handleNavClick}
                className="sr-only"
              />
              <label htmlFor="paymentStatus">Payment Status</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="nav"
                id="session"
                value="session"
                checked={active === 'session'}
                onChange={handleNavClick}
                className="sr-only"
              />
              <label htmlFor="session">Session</label>
            </div>
          </div>
        </div>
        <div className="options">
          {active === 'paymentStatus' && (
            <>
              {paymentStatusOptions.map(o => (
                <div key={o.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    name="paymentStatus"
                    id={o.name}
                    value={o.name}
                    checked={filter.paymentStatus.includes(o.name)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={o.name}>{o.label}</label>
                </div>
              ))}
            </>
          )}
          {active === 'session' && (
            <>
              {sessions?.map(s => (
                <div key={s.sessionId} className="checkbox-item">
                  <input
                    type="checkbox"
                    name="sessions"
                    id={s.sessionId}
                    value={s.sessionId}
                    checked={filter.sessions.includes(s.sessionId)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={s.sessionId}>{formatSessionName(s)}</label>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </RegistrationFilterStyles>
  );
}

const RegistrationFilterStyles = styled.div<{ isOpen: boolean }>`
  position: relative;
  flex-shrink: 0;

  .action-button {
    position: relative;
    flex-shrink: 0;
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

  .filter-menu {
    position: absolute;
    top: 2.75rem;
    left: 0;
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    gap: 1rem;
    white-space: nowrap;
    z-index: 100;
  }

  .nav {
    padding: 0.5rem 0;
    min-width: 9.5rem;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

    input:checked + label {
      background-color: #f3f4f6;
      color: #111827;
    }

    label {
      margin: 0;
      padding: 0.5rem 1.25rem;
      display: flex;
      font-size: 0.875rem;
      cursor: pointer;

      &:hover {
        color: #111827;
      }
    }
  }

  .options {
    padding: 0.875rem 1.375rem;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

    input[type='checkbox'] {
      margin: 0;
      cursor: pointer;

      &:hover + label,
      &:checked + label {
        color: #111827;
      }
    }

    label {
      margin: 0 0 0 0.625rem;
      cursor: pointer;

      &:hover {
        color: #111827;
      }
    }
  }

  .checkbox-item {
    padding: 0.375rem 0;
  }
`;
