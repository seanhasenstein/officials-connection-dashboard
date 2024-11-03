import { Clinician } from 'types';

import { formatPhoneNumber } from 'utils/misc';

import CliniciansComponent from './styles';

type Props = {
  camp: 'Kaukauna' | 'Plymouth' | 'UW-Stevens Point';
  clinicians: Clinician[];
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: () => void;
  setModalClinician: React.Dispatch<React.SetStateAction<Clinician>>;
};

export default function CampClinicians(props: Props) {
  const handleEditClick = (clinician: Clinician) => {
    props.setMode();
    props.setModalClinician(clinician);
    props.setShowModal(true);
  };

  return (
    <CliniciansComponent>
      {props.clinicians.length > 0 ? (
        <>
          <h3>{props.camp} Clinicians</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {props.clinicians.map(c => (
                  <tr key={c.id} className="list-item">
                    <td>
                      {c.firstName} {c.lastName}
                    </td>
                    <td>{c.email}</td>
                    <td>{formatPhoneNumber(c.phone)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleEditClick(c)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="no-clinicians">
          <h3>{props.camp} Clinicians</h3>
          <div className="table-container">
            There are currently no clinicians.
          </div>
        </div>
      )}
    </CliniciansComponent>
  );
}
