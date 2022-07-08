import React from 'react';
import styled from 'styled-components';

type Props<A, B> = {
  active: A | B;
  setActive: React.Dispatch<React.SetStateAction<A | B>>;
  optionA: A;
  optionB: B;
  handleClick?: (option: A | B) => void;
};

export default function ButtonSwitch<A, B>(props: Props<A, B>) {
  const handleClick = (option: A | B) => {
    props.setActive(option);

    if (props.handleClick) {
      props.handleClick(option);
    }
  };

  return (
    <ButtonSwitchStyles>
      <button
        type="button"
        className={props.active === props.optionA ? 'active' : ''}
        onClick={() => handleClick(props.optionA)}
      >
        <>
          {props.active === props.optionA ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
          {props.optionA} camp
        </>
      </button>
      <button
        type="button"
        className={props.active === props.optionB ? 'active' : ''}
        onClick={() => handleClick(props.optionB)}
      >
        <>
          {props.active === props.optionB ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
          {props.optionB} camp
        </>
      </button>
    </ButtonSwitchStyles>
  );
}

const ButtonSwitchStyles = styled.div`
  margin: 2rem auto 0;
  padding: 0.1875rem;
  display: flex;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  background-color: #f0f1f4;

  &:hover {
    border-color: #d7dbe5;
  }

  button {
    width: 100%;
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px solid transparent;
    background-color: #eff1f5;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    color: #1f2937;
    cursor: pointer;
    text-transform: capitalize;
    z-index: 100;
    white-space: nowrap;

    svg {
      margin-right: 0.625rem;
      height: 1rem;
      width: 1rem;
      color: #9ca3af;
    }

    &.active,
    &.active:hover,
    &.active:focus {
      background-color: #fff;
      color: #111827;
      border-color: #e5e7eb;
      z-index: 200;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      svg {
        color: #14b8a6;
      }
    }
  }
`;
