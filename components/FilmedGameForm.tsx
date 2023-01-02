import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import useRegistrationsQuery from '../hooks/queries/useRegistrationsQuery';
import useYearQuery from '../hooks/queries/useYearQuery';
import useOutsideClick from '../hooks/useOutsideClick';
import { FilmedGame, Registration } from '../types';
import { formatSessionName } from '../utils/misc';

type Props = {
  initialValues: FilmedGame;
  enableReinitialize: boolean;
  onSubmit: (
    values: FilmedGame,
    actions: FormikHelpers<FilmedGame>,
    shouldRedirectOnSuccess: boolean
  ) => void;
  mutationError: boolean;
};

export default function FilmedGameForm(props: Props) {
  const router = useRouter();
  const registrationsQuery = useRegistrationsQuery();
  const { kaukaunaCamp, plymouthCamp } = useYearQuery();
  const [searchInput, setSearchInput] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Registration[]>([]);
  const [hasSearchResults, setHasSearchResults] = React.useState(false);
  const [shouldRedirectOnSuccess, setShouldRedirectOnSuccess] =
    React.useState(true);
  const searchResultsRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(hasSearchResults, setHasSearchResults, searchResultsRef);

  React.useEffect(() => {
    if (registrationsQuery.data && searchInput.length > 2) {
      const results = registrationsQuery.data.filter(r => {
        const name = `${r.firstName} ${r.lastName}`;
        return name.toLowerCase().includes(searchInput.toLowerCase());
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [registrationsQuery.data, searchInput]);

  React.useEffect(() => {
    if (searchResults.length > 0) {
      setHasSearchResults(true);

      if (!hasSearchResults) {
        setSearchResults([]);
      }
    }
  }, [hasSearchResults, searchResults]);

  const validationSchema = Yup.object().shape({
    camp: Yup.string().required('Camp is required.'),
    sessions: Yup.array().min(1, 'At least 1 session is required.'),
    name: Yup.string().required('A game name is required.'),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <FilmedGameFormStyles hasSearchResults={searchResults.length > 0}>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize={props.enableReinitialize}
        validationSchema={validationSchema}
        onSubmit={(values, actions) =>
          props.onSubmit(values, actions, shouldRedirectOnSuccess)
        }
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="item">
              <label htmlFor="camp">Camp</label>
              <Field as="select" name="camp" id="camp">
                <option value="">Select camp</option>
                <option value="kaukauna">Kaukauna</option>
                <option value="plymouth">Plymouth</option>
              </Field>
              <ErrorMessage component="div" name="camp" className="error" />
            </div>
            <div className="item">
              <h3>Sessions</h3>
              <div className="sessions">
                <div
                  role="group"
                  aria-labelledby="checkbox-group"
                  className="checkbox-group"
                >
                  {kaukaunaCamp?.sessions.map(s => (
                    <label key={s.sessionId} htmlFor={s.sessionId}>
                      <Field
                        type="checkbox"
                        name="sessions"
                        id={s.sessionId}
                        value={s.sessionId}
                      />
                      {formatSessionName(s)}
                    </label>
                  ))}
                </div>
                <div
                  role="group"
                  aria-labelledby="checkbox-group"
                  className="checkbox-group"
                >
                  {plymouthCamp?.sessions.map(s => (
                    <label key={s.sessionId} htmlFor={s.sessionId}>
                      <Field
                        type="checkbox"
                        name="sessions"
                        id={s.sessionId}
                        value={s.sessionId}
                      />
                      {formatSessionName(s)}
                    </label>
                  ))}
                </div>
              </div>
              <ErrorMessage component="div" name="sessions" className="error" />
            </div>
            <div className="item">
              <label htmlFor="name">Game name</label>
              <Field name="name" id="name" />
              <ErrorMessage component="div" name="name" className="error" />
            </div>
            <div className="item add-officials">
              <label htmlFor="searchOfficials">Add an official</label>
              <input
                type="text"
                name="searchOfficials"
                id="searchOfficials"
                onChange={e => handleSearch(e)}
                value={searchInput}
              />
              <div className="officials">
                {hasSearchResults && (
                  <div ref={searchResultsRef} className="search-results">
                    <hr />
                    {searchResults.map(sr => (
                      <button
                        key={sr._id}
                        type="button"
                        onClick={() => {
                          setFieldValue('officials', [
                            ...values.officials,
                            {
                              _id: sr._id,
                              name: `${sr.firstName} ${sr.lastName}`,
                            },
                          ]);
                          setSearchInput('');
                          setSearchResults([]);
                        }}
                        className="add-official-button"
                      >
                        <div className="inner">
                          <div>
                            {sr.firstName} {sr.lastName}{' '}
                            <span className="light">
                              [#{sr.registrationId}]
                            </span>
                          </div>
                          <div className="reg-sessions">
                            {sr.sessions.map(s => (
                              <div key={s.sessionId}>
                                {formatSessionName(s)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {values.officials.length > 0 ? (
                  <div className="selected-officials">
                    {values.officials.map(o => (
                      <div key={o._id} className="official">
                        {o.name}
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => {
                            const filteredOfficials = values.officials.filter(
                              v => v._id !== o._id
                            );
                            setFieldValue('officials', filteredOfficials);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Remove {o.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="item">
              <label htmlFor="clinicians">Clinicians</label>
              <Field name="clinicians" id="clinicians" />
              <ErrorMessage
                component="div"
                name="clinicians"
                className="error"
              />
            </div>
            <div className="item">
              <label htmlFor="url">YouTube url</label>
              <Field name="url" id="url" />
              <ErrorMessage component="div" name="url" className="error" />
            </div>
            <div className="actions">
              {router.pathname.includes('add') && (
                <>
                  <button
                    type="submit"
                    onClick={() => setShouldRedirectOnSuccess(false)}
                    disabled={isSubmitting}
                    className="secondary-button submit-button"
                  >
                    {isSubmitting ? 'Loading...' : 'Save and add more'}
                  </button>
                  <button
                    type="submit"
                    onClick={() => setShouldRedirectOnSuccess(true)}
                    disabled={isSubmitting}
                    className="primary-button submit-button"
                  >
                    {isSubmitting ? 'Loading...' : 'Save game'}
                  </button>
                </>
              )}
              {router.pathname.includes('update') && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button submit-button"
                >
                  {isSubmitting ? 'Loading...' : 'Update game'}
                </button>
              )}
            </div>
            {props.mutationError && (
              <div className="error">
                Error! Please try adding your game again.
              </div>
            )}
          </Form>
        )}
      </Formik>
    </FilmedGameFormStyles>
  );
}

const FilmedGameFormStyles = styled.div<{ hasSearchResults: boolean }>`
  .item {
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;

    &.add-officials input {
      ${props => (props.hasSearchResults ? 'border-bottom: none' : '')};
      border-radius: ${props =>
        props.hasSearchResults ? '0.25rem 0.25rem 0 0' : '0.25rem'};
    }
  }

  .sessions {
    display: flex;
    justify-content: space-between;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;

    input {
      margin-right: 0.875rem;
    }
  }

  .officials {
    position: relative;

    hr {
      margin: 0 auto;
      width: 95%;
      border-width: 1px 0 0 0;
      border-style: solid;
      border-color: #d1d5db;
    }
  }

  .selected-officials {
    margin: 0.875rem 0 0;
    display: flex;
    gap: 0.5rem;
  }

  .official {
    padding: 0.375rem 0.5rem 0.375rem 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    color: #1f252e;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .remove-button {
    margin: 0 0 0 0.4375rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;

    &:hover {
      color: #0f1217;
    }

    svg {
      height: 0.8125rem;
      width: 0.8125rem;
    }
  }

  .search-results {
    display: ${props => (props.hasSearchResults ? 'block' : 'none')};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: #d1d5db;
    border-radius: 0 0 0.25rem 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .add-official-button {
    margin: 0 auto;
    padding: 0 2.5%;
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: #f9fafb;
    }

    &:last-of-type .inner {
      border-bottom: none;
    }

    .inner {
      margin: 0 auto;
      padding: 0.75rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: #d1d5db;
    }

    .light {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .reg-sessions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
  }

  .actions {
    margin: 2rem 0 0;
    display: flex;
    gap: 1rem;
  }

  .submit-button {
    padding: 0.6875rem 0;
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1f252e;
    border: 1px solid #1f252e;
    border-radius: 0.375rem;
    color: #f4f4f5;
    font-size: 0.9375rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      background-color: #0f1217;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255 255 255) 0px 0px 0px 2px, #0448bf 0px 0px 0px 4px,
        rgb(0 0 0 / 5%) 0px 1px 2px 0px;
    }
  }

  .secondary-button {
    background-color: #fff;
    color: #0f1217;
    border-color: #d1d5db;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: #fff;
      border-color: #9ca3af;
    }
  }

  .error {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;
  }
`;
