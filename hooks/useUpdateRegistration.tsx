import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { RegistrationDbFormat } from '../interfaces';
import { formatPhoneNumber, getUrlParam } from '../utils/misc';
import { useRegistrationQuery } from './useRegistrationQuery';
import { useYearQuery } from './useYearQuery';
import { registrationKeys } from './queries';
import { formatRegistrationForDb } from '../utils/registration';

const emptyInitialValues: RegistrationDbFormat = {
  registrationId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    street2: '',
    city: '',
    state: '',
    zipcode: '',
  },
  sessions: [],
  wiaaClass: 'default',
  wiaaNumber: '',
  associations: '',
  foodAllergies: '',
  emergencyContact: {
    name: '',
    phone: '',
  },
  crewMembers: ['', ''],
  subtotal: 0,
  total: 0,
  refundAmount: 0,
  discount: {
    active: false,
    name: 'default',
    amount: 0,
  },
  paymentStatus: 'default',
  paymentMethod: 'default',
  checkNumber: '',
  notes: [],
  stripeId: null,
  createdAt: '',
  updatedAt: '',
};

export default function useUpdateRegistration() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sessions: yearSessions } = useYearQuery();
  const registrationQuery = useRegistrationQuery(getUrlParam(router.query.rid));
  const [initialValues, setInitialValues] =
    React.useState<RegistrationDbFormat>(emptyInitialValues);
  const [showHSFields, setShowHSFields] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (yearSessions && registrationQuery.data) {
      const regData = registrationQuery.data;
      const updatedSessions = yearSessions.map(yearSession => {
        const regSessions = regData.sessions.find(
          regSession => regSession.sessionId === yearSession.sessionId
        );
        return {
          ...yearSession,
          isChecked: regSessions ? true : false,
          attending: regSessions ? regSessions.attending : false,
        };
      });

      const hsSessionSelected = updatedSessions.some(
        s => s.isChecked && s.category === 'High School'
      );
      setShowHSFields(hsSessionSelected);

      const discount = {
        active: regData.discount.active,
        name: regData.discount.name,
        amount: regData.discount.amount / 100,
      };
      const subtotal = regData.subtotal / 100;
      const refundAmount = regData.refundAmount / 100;
      const phone = formatPhoneNumber(regData.phone);
      const emergencyContactPhone = formatPhoneNumber(
        regData.emergencyContact.phone
      );
      const crewMembers =
        regData.crewMembers?.length === 1
          ? [regData.crewMembers[0], '']
          : regData.crewMembers?.length === 2
          ? regData.crewMembers
          : ['', ''];
      const notes = regData.notes;

      const updatedRegistration = {
        ...emptyInitialValues,
        ...regData,
        phone,
        sessions: updatedSessions,
        discount,
        crewMembers,
        emergencyContact: {
          name: regData?.emergencyContact.name || '',
          phone: emergencyContactPhone,
        },
        subtotal,
        refundAmount,
        notes,
      };

      setInitialValues(updatedRegistration);
    }
  }, [registrationQuery.data, yearSessions]);

  const updateRegistration = useMutation(
    async (registration: RegistrationDbFormat) => {
      setIsLoading(true);
      const selectedSessions = registration.sessions.filter(s => s.isChecked);

      const response = await fetch(`/api/registrations/update`, {
        method: 'POST',
        body: JSON.stringify({ ...registration, sessions: selectedSessions }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Failed to update the registration.');
      }

      const data = await response.json();
      return data.registration;
    },
    {
      onMutate: async registration => {
        await queryClient.cancelQueries(
          registrationKeys.registration(getUrlParam(router.query.rid))
        );

        const updatedSessions = registration.sessions.filter(s => s.isChecked);
        const updatedRegistration = formatRegistrationForDb({
          ...registration,
          sessions: updatedSessions,
        });

        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(router.query.rid)),
          updatedRegistration
        );
        return updatedRegistration;
      },
      onError: () => {
        setIsLoading(false);
        queryClient.setQueryData(
          registrationKeys.registration(getUrlParam(router.query.rid)),
          registrationQuery.data
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  return {
    registrationQuery,
    updateRegistration,
    initialValues,
    showHSFields,
    setShowHSFields,
    isLoading,
  };
}
