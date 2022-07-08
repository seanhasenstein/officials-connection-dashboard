import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Registration,
  RegistrationInput,
  Session,
  TemporaryDiscountName,
} from '../../interfaces';
import { formatPhoneNumber } from '../../utils/misc';
import { initialValues as emptyInitialValues } from '../../utils/registrationForm';
import { registrationKeys } from '../queries';

export default function useUpdateRegistration(
  registration: Registration | undefined,
  yearSessions: Session[] | undefined
) {
  const queryClient = useQueryClient();
  const [initialValues, setInitialValues] =
    React.useState<RegistrationInput>(emptyInitialValues);

  React.useEffect(() => {
    if (yearSessions && registration) {
      const data = registration;
      const updatedSessions = yearSessions.map(yearSession => {
        const registrationSessions = data.sessions.find(
          registrationSession =>
            registrationSession.sessionId === yearSession.sessionId
        );
        return {
          ...yearSession,
          isChecked: registrationSessions ? true : false,
          attending: registrationSessions
            ? registrationSessions.attending
            : false,
        };
      });

      const discount = {
        active: data.discount.active,
        name: data.discount.name,
        amount: data.discount.amount / 100,
      };
      const subtotal = data.subtotal / 100;
      const refundAmount = data.refundAmount / 100;
      const phone = formatPhoneNumber(data.phone);
      const emergencyContactPhone = formatPhoneNumber(
        data.emergencyContact.phone
      );
      const crewMembers =
        data.crewMembers?.length === 1
          ? [data.crewMembers[0], '']
          : data.crewMembers?.length === 2
          ? data.crewMembers
          : ['', ''];
      const notes = data.notes;

      const updatedRegistration = {
        ...emptyInitialValues,
        ...data,
        phone,
        sessions: updatedSessions,
        discount,
        temporaryDiscountName:
          discount.name === ''
            ? 'default'
            : discount.name === 'HSCREW'
            ? 'hscrew'
            : ('other' as TemporaryDiscountName),
        crewMembers,
        emergencyContact: {
          name: data.emergencyContact.name,
          phone: emergencyContactPhone,
        },
        subtotal,
        refundAmount,
        notes,
      };

      setInitialValues(updatedRegistration);
    }
  }, [registration, yearSessions]);

  const updateRegistration = useMutation(
    async ({
      _id,
      formValues,
    }: {
      _id: string;
      formValues: RegistrationInput;
    }) => {
      const response = await fetch(`/api/registrations/update`, {
        method: 'POST',
        body: JSON.stringify({ formValues, _id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the registration.');
      }

      const data: { registration: Registration } = await response.json();
      return data.registration;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
        queryClient.invalidateQueries('sessions');
      },
    }
  );

  return {
    updateRegistration,
    initialValues,
  };
}
