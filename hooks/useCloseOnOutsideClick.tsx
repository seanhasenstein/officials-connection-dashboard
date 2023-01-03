import React from 'react';

export default function useCloseOnOutsideClick(
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ref: React.RefObject<HTMLElement>
) {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, ref, setOpen]);
}
