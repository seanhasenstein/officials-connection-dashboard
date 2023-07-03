import React from 'react';

import useEscapeKeydownClose from 'hooks/useEscapeKeydownClose';
import useCloseOnOutsideClick from 'hooks/useCloseOnOutsideClick';

import ContainerComponent from './styles';

type Props = {
  children: React.ReactNode;
  customContainerClass?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Container({
  children,
  customContainerClass,
  isVisible,
  setIsVisible,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEscapeKeydownClose(isVisible, setIsVisible);
  useCloseOnOutsideClick(isVisible, setIsVisible, containerRef);

  return (
    <ContainerComponent
      ref={containerRef}
      className={customContainerClass ?? ''}
    >
      {children}
    </ContainerComponent>
  );
}
