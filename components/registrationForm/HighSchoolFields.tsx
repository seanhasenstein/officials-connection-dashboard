import React from 'react';
import { Field } from 'formik';
import { RegistrationInput, WiaaClass } from '../../types';

type Props = {
  values: RegistrationInput;
};

const wiaaClasses: { value: WiaaClass; label: string }[] = [
  { value: 'Master', label: 'Master' },
  { value: 'L5', label: 'L5' },
  { value: 'L4', label: 'L4' },
  { value: 'L3', label: 'L3' },
  { value: 'L2', label: 'L2' },
  { value: 'L1', label: 'L1' },
  { value: 'L0', label: 'L0' },
  { value: 'LR', label: 'LR' },
  { value: 'New', label: 'New Official' },
];

export default function HighSchoolFields({ values }: Props) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const isHsSessionSelected = values.sessions.some(
      session => session.isChecked && session.category === 'High School'
    );
    setShow(isHsSessionSelected);
  }, [values.sessions]);

  return (
    <>
      {show ? (
        <>
          <div className="section">
            <h3>WIAA Information</h3>
            <div className="grid-col-2">
              <div className="item">
                <label htmlFor="wiaaClass">WIAA classification</label>
                <Field name="wiaaClass" as="select">
                  <option value="default">Select a class</option>
                  {wiaaClasses.map(wc => (
                    <option key={wc.value} value={wc.value}>
                      {wc.label}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="item">
                <label htmlFor="wiaaNumber">WIAA number</label>
                <Field id="wiaaNumber" name="wiaaNumber" />
              </div>
            </div>
            <div className="item">
              <label htmlFor="associations">Associations</label>
              <Field id="associations" name="associations" />
            </div>
          </div>
          <div className="section">
            <h3>Crew Members</h3>
            <div className="item">
              <label htmlFor="crewMember1">Crew member 1</label>
              <Field id="crewMember1" name="crewMembers.0" />
            </div>
            <div className="item">
              <label htmlFor="crewMember2">Crew member 2</label>
              <Field id="crewMember2" name="crewMembers.1" />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
