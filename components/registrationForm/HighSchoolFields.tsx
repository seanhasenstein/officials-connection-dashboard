import React from 'react';
import { Field } from 'formik';
import { RegistrationInput } from '../../interfaces';

type Props = {
  values: RegistrationInput;
};

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
                  <option value="Master">Master</option>
                  <option value="L5">L5</option>
                  <option value="L4">L4</option>
                  <option value="L3">L3</option>
                  <option value="L2">L2</option>
                  <option value="L1">L1</option>
                  <option value="LR">LR</option>
                  <option value="New">New Official</option>
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
