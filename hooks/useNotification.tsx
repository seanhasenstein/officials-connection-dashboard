import React from 'react';
import { useRouter } from 'next/router';

export default function useNotification() {
  const router = useRouter();
  const [showNotification, setShowNotification] = React.useState(false);

  React.useEffect(() => {
    if (
      router.query.deleteRegistrationModal === 'true' ||
      router.query.deleteGameModal === 'true'
    ) {
      setShowNotification(true);
    }
  }, [router.query.deleteGameModal, router.query.deleteRegistrationModal]);

  return { showNotification, setShowNotification };
}
