import React from 'react';
import { useField } from 'formik';
import styled from 'styled-components';

type Props = {
  name: string;
  id: string;
  label: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customContainerClass?: string;
  customValidationErrorClass?: string;
};

const CustomTextInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { label, customContainerClass, customValidationErrorClass, ...props },
    ref
  ) => {
    const [field, meta] = useField(props);

    return (
      <CustomTextInputComponent className={customContainerClass}>
        <label htmlFor={props.name} id={props.name}>
          {label}
        </label>
        <input ref={ref} type="text" {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="validation-error">{meta.error}</div>
        ) : null}
      </CustomTextInputComponent>
    );
  }
);

CustomTextInput.displayName = 'CustomTextInput';

const CustomTextInputComponent = styled.div`
  margin: 0.875rem 0 0;
  display: flex;
  flex-direction: column;

  input,
  textarea {
    appearance: none;
    background-color: #fff;
    border: 1px solid #dddde2;
    border-radius: 0.3125rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    &:focus {
      outline-color: #1f30c2;
    }
  }

  input:not([type='checkbox']),
  textarea {
    padding: 0.6875rem 0.75rem;
    font-size: 0.8125rem;
  }

  input[type='checkbox'] {
    flex-shrink: 0;
    height: 1rem;
    width: 1rem;
    border-radius: 0.25rem;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }

    &:checked {
      border-color: transparent;
      background-color: #1f30c2;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .validation-error {
    margin: 0.625rem 0 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #be123c;
  }

  @media (max-width: 500px) {
    input:not([type='checkbox']),
    textarea {
      font-size: 1rem;
    }
  }
`;

export default CustomTextInput;
