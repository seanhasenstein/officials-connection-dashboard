import React from 'react';

import { Clinician } from 'types';

import useYearQuery from 'hooks/queries/useYearQuery';

import CampClinicians from 'components/CampClinicians';
import CliniciansModal from 'components/modals/CliniciansModal/CliniciansModal';

import CliniciansComponent from './styles';

const blankClinician: Clinician = {
  id: '0',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  camp: 'Kaukauna Camp',
};

export default function CliniciansContent() {
  const [showModal, setShowModal] = React.useState(false);
  const [mode, setMode] = React.useState<'add' | 'update'>('add');
  const [modalClinician, setModalClinician] =
    React.useState<Clinician>(blankClinician);

  const yearQuery = useYearQuery();
  const { isLoading, isError, kaukaunaCamp, stevensPointCamp } = yearQuery;

  if (isLoading) {
    return <div />;
  }

  if (isError) {
    return <div>An error occurred querying for the clinicians.</div>;
  }

  return (
    <>
      <CliniciansComponent>
        <div className="container">
          <button
            type="button"
            onClick={() => {
              setMode('add');
              setModalClinician(blankClinician);
              setShowModal(true);
            }}
            className="add-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <CampClinicians
            camp="UW-Stevens Point"
            clinicians={stevensPointCamp?.clinicians || []}
            setShowModal={setShowModal}
            setMode={() => setMode('update')}
            setModalClinician={setModalClinician}
          />
          <CampClinicians
            camp="Kaukauna"
            clinicians={kaukaunaCamp?.clinicians || []}
            setShowModal={setShowModal}
            setMode={() => setMode('update')}
            setModalClinician={setModalClinician}
          />
          {/* <CampClinicians
            camp="Plymouth"
            clinicians={plymouthCamp?.clinicians || []}
            setShowModal={setShowModal}
            setMode={() => setMode('update')}
            setModalClinician={setModalClinician}
          /> */}
        </div>
      </CliniciansComponent>
      <CliniciansModal
        isVisible={showModal}
        setIsVisible={setShowModal}
        clinician={modalClinician}
        mode={mode}
      />
    </>
  );
}
