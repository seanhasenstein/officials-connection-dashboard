import { Clinician } from 'types';

import ClinicianForm from 'components/forms/ClinicianForm/ClinicianForm';
import Modal from '../composedBlock/Modal';

import CliniciansModalComponent from './styles';

type Props = {
  clinician: Clinician;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  mode: 'add' | 'update';
};

export default function CliniciansModal({
  clinician,
  isVisible,
  setIsVisible,
  mode,
}: Props) {
  return (
    <CliniciansModalComponent>
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        customContainerClass="container"
      >
        <h3>Add a clinician</h3>
        <ClinicianForm
          initialValues={clinician}
          mode={mode}
          modalIsOpen={isVisible}
          closeModal={() => setIsVisible(false)}
        />
      </Modal>
    </CliniciansModalComponent>
  );
}
