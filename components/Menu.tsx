import React from 'react';
import styled from 'styled-components';
import useOutsideClick from '../hooks/useOutsideClick';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
};

export default function Menu({ open, setOpen, children, className }: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(open, setOpen, menuRef);
  useEscapeKeydownClose(open, setOpen);

  return (
    <TableMenuStyles ref={menuRef} open={open} className={className}>
      {children}
    </TableMenuStyles>
  );
}

const TableMenuStyles = styled.div<{ open: boolean }>`
  padding: 0;
  overflow: auto;
  white-space: nowrap;
  position: absolute;
  top: 1.875rem;
  right: 0rem;
  display: ${props => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
    rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  z-index: 9999;

  a,
  button {
    padding: 0.75rem 1.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
    color: #6b7280;
    background-color: inherit;
    border: none;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f9fafb;
      color: #4b5563;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      text-decoration: underline;
      color: #2563eb;
    }
  }
`;
