import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { RegistrationInput } from '../interfaces';
import { formatPhoneNumber } from '../utils';
import useRegistration from '../hooks/useRegistration';
import { registrationKeys } from './queries';
import { sessionsData } from '../data';

const blankInitialValues: RegistrationInput = {
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
  wiaaClass: 'default',
  wiaaNumber: '',
  associations: '',
  foodAllergies: '',
  emergencyContact: {
    name: '',
    phone: '',
  },
  discount: 'false',
  crewMembers: [''],
  paymentAmount: 0,
  paymentStatus: 'unpaid',
  paymentMethod: 'cash',
  checkNumber: '',
  refundAmount: 0,
  notes: [],
};

export default function useUpdateRegistration() {
  const queryClient = useQueryClient();
  const { registrationQuery } = useRegistration();
  const [initialValues, setInitialValues] =
    React.useState<RegistrationInput>(blankInitialValues);
  const [sessions, setSessions] = React.useState(sessionsData);
  const [showHSFields, setShowHSFields] = React.useState(false);

  const handleSessionUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sessionsUpdate = sessions.map(s =>
      s.id === e.target.value
        ? { ...s, isChecked: !s.isChecked, attending: !s.isChecked }
        : s
    );
    setSessions(sessionsUpdate);
    const hsCheckUpdate = sessionsUpdate.some(
      s => s.isChecked && s.category === 'High School'
    );
    setShowHSFields(hsCheckUpdate);
  };

  const handleAttendingToggle = (id: string) => {
    const update = sessions.map(s => {
      if (s.id === id) {
        return { ...s, attending: !s.attending };
      }
      return s;
    });
    setSessions(update);
  };

  React.useEffect(() => {
    if (registrationQuery.data) {
      const data = registrationQuery.data;
      const updatedSessions = sessionsData.map(s => {
        const rs = data?.sessions.find(rs => rs.id === s.id);
        return {
          ...s,
          isChecked: rs ? true : false,
          attending: rs ? rs.attending : false,
        };
      });
      setSessions(updatedSessions);

      const hsSessionSelected = updatedSessions.some(
        s => s.isChecked && s.category === 'High School'
      );
      setShowHSFields(hsSessionSelected);

      const discount = `${data.discount}`;
      const paymentAmount = (data.total / 100).toFixed(2);
      const refundAmount = (data.refundAmount / 100).toFixed(2);
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
        ...blankInitialValues,
        ...data,
        phone,
        discount,
        crewMembers,
        emergencyContact: {
          name: data?.emergencyContact.name || '',
          phone: emergencyContactPhone,
        },
        paymentAmount,
        refundAmount,
        notes,
      };

      setInitialValues(updatedRegistration);
    }
  }, [registrationQuery.data]);

  const updateRegistration = useMutation(
    async (registration: RegistrationInput) => {
      const selectedSessions = sessions.filter(s => s.isChecked);
      const response = await fetch(`/api/registrations/update`, {
        method: 'POST',
        body: JSON.stringify({ ...registration, sessions: selectedSessions }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update the registration.');
      }

      const data = await response.json();
      return data.registration;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(registrationKeys.all);
      },
    }
  );

  return {
    registrationQuery,
    updateRegistration,
    initialValues,
    sessions,
    handleSessionUpdate,
    handleAttendingToggle,
    showHSFields,
  };
}
