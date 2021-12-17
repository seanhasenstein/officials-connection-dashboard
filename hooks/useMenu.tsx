import React from 'react';

export default function useMenu() {
  const [activeMenuId, setActiveMenuId] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMenuButtonClick = (id: string) => {
    if (id === activeMenuId && isOpen) {
      setActiveMenuId(undefined);
      setIsOpen(false);
      return;
    }
    setActiveMenuId(id);
    setIsOpen(true);
  };

  return {
    activeMenuId,
    setActiveMenuId,
    isOpen,
    setIsOpen,
    handleMenuButtonClick,
  };
}
