import React from 'react';

export default function useToggleScroll(open: boolean) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);
}
